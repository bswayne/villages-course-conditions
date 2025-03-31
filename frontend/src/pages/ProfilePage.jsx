// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Your Axios instance
import { useAuth } from '../contexts/AuthContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
// Consider adding Dialog for delete confirmation if implementing delete later

// Village list (keep consistent with Flutter)
const villagesList = [ 'I am not a Villager',
    'Alhambra',
    'Amelia',
    'Ashland',
    'Belle Aire',
    'Belvedere',
    'Bonita',
    'Bonnybrook',
    'Bradford',
    'Briar Meadow',
    'Bridgeport at Creekside Landing',
    'Bridgeport at Lake Shore Cottages',
    'Bridgeport at Lake Sumter',
    'Bridgeport at Laurel Valley',
    'Bridgeport at Miona Shores',
    'Bridgeport at Mission Hills',
    'Buttonwood',
    'Calumet Grove',
    'Caroline',
    'Cason Hammock',
    'Charlotte',
    'Chatham',
    'Chatham at Soulliere',
    'Chitty Chatty',
    'Citrus Grove',
    'Collier',
    'Collier at Atwood Bungalows',
    'Collier at Alden Bungalows',
    'Collier at Antrim Dells',
    'Country Club',
    'Dabney',
    'De Allende',
    'De La Vista',
    'Del Mar',
    'DeLuna',
    'DeSoto',
    'Dunedin',
    'Duval',
    'El Cortez',
    'Fenney',
    'Fernandina',
    'Gilchrist',
    'Glenbrook',
    'Hacienda',
    'Hadley',
    'Hammock at Fenney',
    'Hawkins',
    'Hemingway',
    'Hillsborough',
    'La Reynalda',
    'La Zamora',
    'LaBelle',
    'Lake Denham',
    'Lake Deaton',
    'Lake Miona',
    'Largo',
    'Liberty Park',
    'Linden',
    'Lynnhaven',
    'Mallory Square',
    'Marsh Bend',
    'McClure',
    'Mira Mesa',
    'Monarch Grove',
    'Moultrie Creek',
    'Newell',
    'Oak Meadows',
    'Orange Blossom Gardens',
    'Osceola Hills',
    'Osceola Hills at Soaring Eagle Preserve',
    'Pallo Alto',
    'Pennecamp',
    'Piedmont',
    'Pine Hills',
    'Pine Ridge',
    'Pinellas',
    'Poinciana',
    'Polo Ridge',
    'Richmond',
    'Rio Grande',
    'Rio Ponderosa',
    'Rio Ranchero',
    'Sabal Chase',
    'Sanibel',
    'Santiago',
    'Santo Domingo',
    'Shady Brook',
    'Silver Lake',
    'Spring Arbor',
    'Springdale',
    'St. Catherine',
    'St. Charles',
    'St. James',
    'St. Johns',
    'Summerhill',
    'Sunset Pointe',
    'Tall Trees',
    'Tamarind Grove',
    'Tierra Del Sol',
    'Valle Verde',
    'Virginia Trace',
    'Winifred',
    'Woodbury',
    'Woodbury at Phillips'
];

// Display name formats (optional for web, can simplify)
// const displayFormats = [ 'Full Name + Village', /* ... other formats ... */ ];
const displayFormats = [
    'Full Name + Village',
    'First Name + Last Initial + Village',
    'First Initial + Last Name + Village',
    'First Initial + Last Initial + Village',
];

// Helper function to generate display name (simplified for web example)
const generateDisplayName = (firstName, lastName, village, format) => {
    const first = firstName?.trim() || '';
    const last = lastName?.trim() || '';
    const villageText = (village && village !== 'I am not a Villager') ? ` of ${village}` : ''; // 'of' looks better

    const firstInitial = first ? first[0] + '.' : ''; // Add dot if exists
    const lastInitial = last ? last[0] + '.' : '';   // Add dot if exists

    switch (format) {
        case 'First Name + Last Initial + Village':
            return `${first} ${lastInitial}${villageText}`.trim(); // Trim potential leading/trailing space
        case 'First Initial + Last Name + Village':
            return `${firstInitial} ${last}${villageText}`.trim();
        case 'First Initial + Last Initial + Village':
            return `${firstInitial} ${lastInitial}${villageText}`.trim();
        case 'Full Name + Village':
        default:
             // Handle cases where first/last might be empty
             if (first && last) return `${first} ${last}${villageText}`;
             if (first) return `${first}${villageText}`;
             if (last) return `${last}${villageText}`;
             return ''; // Return empty if no name parts
    }
};

function ProfilePage() {
    const { currentUser } = useAuth(); // Get Firebase auth user info if needed
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('I am not a Villager');
    const [derivedDisplayName, setDerivedDisplayName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saveStatus, setSaveStatus] = useState({ saving: false, error: '', success: false });
    const [selectedDisplayFormat, setSelectedDisplayFormat] = useState(displayFormats[0]); // Default to first format

    // Helper to guess format based on stored name (if needed on load)
    const determineFormatFromDisplayName = (fName, lName, village, storedDisplay) => {
         if (!storedDisplay) return displayFormats[0]; // Default if no stored name
         // Compare generated names for each format with the stored name
         for (const format of displayFormats) {
             if (generateDisplayName(fName, lName, village, format) === storedDisplay) {
                 return format;
             }
         }
         return displayFormats[0]; // Default if no match found
    };
    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get('/user/profile');
                const data = response.data;
                setProfile(data);
                const fetchedFirstName = data.firstName || '';
                const fetchedLastName = data.lastName || '';
                const fetchedVillage = villagesList.includes(data.village) ? data.village : 'I am not a Villager';
                const fetchedDisplayName = data.displayName || '';

                setFirstName(fetchedFirstName);
                setLastName(fetchedLastName);
                setSelectedVillage(fetchedVillage);

                // Determine and set the display format based on fetched data
                const initialFormat = determineFormatFromDisplayName(fetchedFirstName, fetchedLastName, fetchedVillage, fetchedDisplayName);
                setSelectedDisplayFormat(initialFormat);

                // Set initial derived display name using determined format
                setDerivedDisplayName(generateDisplayName(fetchedFirstName, fetchedLastName, fetchedVillage, initialFormat) || data.email || '');
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data || err.message || 'Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Update derived display name when form fields change
    useEffect(() => {
        setDerivedDisplayName(generateDisplayName(firstName, lastName, selectedVillage, selectedDisplayFormat) || profile?.email || currentUser?.email || ''); // Use fetched/auth email as fallback
    }, [firstName, lastName, selectedVillage, selectedDisplayFormat, profile, currentUser]); // Add profile to dependencies

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setSaveStatus({ saving: true, error: '', success: false });
        setError('');

        // Ensure derivedDisplayName is updated before saving
        const currentDerivedName = generateDisplayName(firstName, lastName, selectedVillage, selectedDisplayFormat) || profile?.email || currentUser?.email || '';
        if (!currentDerivedName && !firstName && !lastName) {
             setSaveStatus({ saving: false, error: 'Cannot save profile without a name or derived display name.', success: false });
             return;
        }


        try {
            const updatePayload = {
                firstName: firstName,
                lastName: lastName,
                village: selectedVillage,
                displayName: currentDerivedName, // Send the currently derived display name
            };

            const response = await api.put('/user/profile', updatePayload);
            const data = response.data;

            // Update local state with confirmed data
            setProfile(data);
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            const updatedVillage = villagesList.includes(data.village) ? data.village : 'I am not a Villager';
            setSelectedVillage(updatedVillage);
            // Re-determine format in case backend logic changed something (unlikely here)
            const updatedFormat = determineFormatFromDisplayName(data.firstName, data.lastName, updatedVillage, data.displayName);
            setSelectedDisplayFormat(updatedFormat);
            setDerivedDisplayName(generateDisplayName(data.firstName, data.lastName, updatedVillage, updatedFormat) || data.email || '');


            setSaveStatus({ saving: false, error: '', success: true });
            setTimeout(() => setSaveStatus(prev => ({ ...prev, success: false })), 3000);

        } catch (err) {
             console.error("Error updating profile:", err);
             const errMsg = err.response?.data || err.message || 'Failed to save changes.';
             setSaveStatus({ saving: false, error: errMsg, success: false });
         }
     };

    // --- Placeholder functions for Account Admin actions ---
    // Logout is handled in Navbar
    // Deletion needs client-side re-auth flow (complex)
    // const handleResetConsent = () => { alert("Reset Privacy Consent - Not implemented in web yet."); };
    // const handleDeleteAccount = () => { alert("Delete Account - Requires secure re-authentication flow (Not implemented)."); };
    // ---

    if (loading) {
        return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>;
    }

    if (error) {
        return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
    }

    if (!profile) {
         return <Container sx={{ py: 4 }}><Alert severity="warning">Could not load profile data.</Alert></Container>;
     }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                User Profile
            </Typography>

            {/* Account Admin Card (Simplified) */}
            {/* <Card variant="outlined" sx={{ mb: 3 }}> */}
                {/* <CardContent> */}
                    {/* <Typography variant="h6" gutterBottom>Account Administration</Typography> */}
                    {/* <Stack direction="row" spacing={1} flexWrap="wrap"> */}
                        {/* Logout button is in Navbar */}
                         {/* <Button size="small" variant="outlined" onClick={handleResetConsent}>Reset Privacy Consent</Button> */}
                         {/* <Button size="small" variant="contained" color="error" onClick={handleDeleteAccount}>Delete Account</Button> */}
                     {/* </Stack> */}
                 {/* </CardContent> */}
             {/* </Card> */}

             {/* Display Preferences Form */}
             <Card variant="outlined">
                 <CardContent>
                     <Typography variant="h6" gutterBottom>Display Preferences</Typography>
                     <Box component="form" onSubmit={handleSaveChanges}>
                         <Stack spacing={3}>
                             <Typography>
                                 <strong>Display Name Preview:</strong> {derivedDisplayName || '(Enter name details)'}
                             </Typography>

                             <TextField /* First Name */
                                 label="First Name"
                                 fullWidth
                                 value={firstName}
                                 onChange={(e) => setFirstName(e.target.value)}
                                 disabled={saveStatus.saving}
                             />
                             <TextField /* Last Name */
                                 label="Last Name"
                                 fullWidth
                                 value={lastName}
                                 onChange={(e) => setLastName(e.target.value)}
                                 disabled={saveStatus.saving}
                             />

                             <FormControl fullWidth> {/* Village Dropdown */}
                                 <InputLabel id="village-select-label">My Village</InputLabel>
                                 <Select /* ... village select props ... */
                                      labelId="village-select-label"
                                      value={selectedVillage}
                                      label="My Village"
                                      onChange={(e) => setSelectedVillage(e.target.value)}
                                      disabled={saveStatus.saving}
                                 >
                                      {villagesList.map((village) => (
                                          <MenuItem key={village} value={village}>
                                              {village}
                                          </MenuItem>
                                      ))}
                                  </Select>
                              </FormControl>

                             {/* --- Add Display Format Dropdown --- */}
                             <FormControl fullWidth>
                                 <InputLabel id="display-format-select-label">Display Name Format</InputLabel>
                                 <Select
                                     labelId="display-format-select-label"
                                     value={selectedDisplayFormat}
                                     label="Display Name Format"
                                     onChange={(e) => setSelectedDisplayFormat(e.target.value)}
                                     disabled={saveStatus.saving}
                                 >
                                     {displayFormats.map((format) => (
                                         <MenuItem key={format} value={format}>
                                             {format}
                                         </MenuItem>
                                     ))}
                                 </Select>
                             </FormControl>
                             {/* --- End Add --- */}


                             <Box sx={{ mt: 2 }}> {/* Save Button & Status */}
                                 <Button /* ... save button props ... */
                                      type="submit"
                                      variant="contained"
                                      disabled={saveStatus.saving}
                                 >
                                     {saveStatus.saving ? <CircularProgress size={24} /> : 'Save Changes'}
                                 </Button>
                                 {saveStatus.error && <Alert severity="error" sx={{ mt: 2 }}>{saveStatus.error}</Alert>}
                                 {saveStatus.success && <Alert severity="success" sx={{ mt: 2 }}>Profile updated successfully!</Alert>}
                             </Box>
                         </Stack>
                     </Box>
                 </CardContent>
             </Card>
         </Container>
     );
 }

 export default ProfilePage;