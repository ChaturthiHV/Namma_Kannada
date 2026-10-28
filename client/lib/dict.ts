// Static English -> Kannada UI dictionary. Anything missing here is translated through /api/translate and cached.
// {name} placeholders are filled in by t(en, { name }).
export const DICT: Record<string, string> = {
  // brand / nav
  'Namma Kannada': 'ನಮ್ಮ ಕನ್ನಡ', 'Namma Karnataka': 'ನಮ್ಮ ಕರ್ನಾಟಕ',
  'Different regions. Same heart. One Kannada.': 'ಬೇರೆ ಬೇರೆ ಪ್ರದೇಶ. ಒಂದೇ ಹೃದಯ. ಒಂದೇ ಕನ್ನಡ.',
  'Different regions.': 'ಬೇರೆ ಬೇರೆ ಪ್ರದೇಶ.', 'Same heart.': 'ಒಂದೇ ಹೃದಯ.', 'One Kannada.': 'ಒಂದೇ ಕನ್ನಡ.',
  'Home': 'ಮುಖಪುಟ', 'Explore Karnataka Map': 'ಕರ್ನಾಟಕ ನಕ್ಷೆ', 'Living Language Map': 'ಜೀವಂತ ನಕ್ಷೆ', 'Voice Gallery': 'ಧ್ವನಿ ಗ್ಯಾಲರಿ',
  'Regional Voice Gallery': 'ಪ್ರಾದೇಶಿಕ ಧ್ವನಿ ಗ್ಯಾಲರಿ',
  'Speak Like a Local': 'ಸ್ಥಳೀಯರಂತೆ ಮಾತು', 'Talk to a Local': 'ಸ್ಥಳೀಯರೊಂದಿಗೆ ಮಾತು', 'Smart Search': 'ಸ್ಮಾರ್ಟ್ ಹುಡುಕಾಟ',
  'Dialect Battle': 'ಉಪಭಾಷೆ ಸ್ಪರ್ಧೆ', 'Dialect Detective': 'ಉಪಭಾಷೆ ಪತ್ತೇದಾರ', 'Contribute a Word': 'ಪದ ಕೊಡುಗೆ', 'Profile': 'ಪ್ರೊಫೈಲ್', 'My Profile': 'ನನ್ನ ಪ್ರೊಫೈಲ್',
  'About Namma Kannada': 'ನಮ್ಮ ಕನ್ನಡ ಬಗ್ಗೆ', 'More Modules': 'ಇನ್ನಷ್ಟು ವಿಭಾಗಗಳು', 'Map': 'ನಕ್ಷೆ', 'Play': 'ಆಟ', 'More': 'ಇನ್ನಷ್ಟು', 'All features': 'ಎಲ್ಲಾ ವೈಶಿಷ್ಟ್ಯಗಳು', 'Close': 'ಮುಚ್ಚಿ', 'Mobile': 'ಮೊಬೈಲ್',
  'Log out': 'ಲಾಗ್ ಔಟ್', 'Login': 'ಲಾಗಿನ್', 'Register': 'ನೋಂದಣಿ', 'Switch language': 'ಭಾಷೆ ಬದಲಿಸಿ', 'Theme': 'ಥೀಮ್', 'Light': 'ಹಗಲು', 'Dark': 'ರಾತ್ರಿ',
  'English': 'English', 'DIFFERENT REGIONS · SAME HEART · ONE KANNADA': 'ಬೇರೆ ಬೇರೆ ಪ್ರದೇಶ · ಒಂದೇ ಹೃದಯ · ಒಂದೇ ಕನ್ನಡ',
  'Namma Kannada logo': 'ನಮ್ಮ ಕನ್ನಡ ಲಾಂಛನ',
  // auth
  'Welcome back': 'ಮರಳಿ ಸ್ವಾಗತ', 'Welcome to Namma Kannada': 'ನಮ್ಮ ಕನ್ನಡಕ್ಕೆ ಸ್ವಾಗತ', 'Create account': 'ಖಾತೆ ರಚಿಸಿ', 'Please wait…': 'ದಯವಿಟ್ಟು ಕಾಯಿರಿ…',
  'Full name': 'ಪೂರ್ಣ ಹೆಸರು', 'Phone number (10 digits)': 'ಫೋನ್ ಸಂಖ್ಯೆ (10 ಅಂಕೆಗಳು)', 'Password': 'ಪಾಸ್‌ವರ್ಡ್', 'Confirm password': 'ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ', 'New password': 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್',
  'Which Kannada do you speak?': 'ನೀವು ಯಾವ ಕನ್ನಡ ಮಾತನಾಡುತ್ತೀರಿ?', 'Select your district': 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ', 'Choose your Kannada first': 'ಮೊದಲು ನಿಮ್ಮ ಕನ್ನಡ ಆರಿಸಿ', 'District': 'ಜಿಲ್ಲೆ',
  'Forgot password?': 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?', 'Demo build: accounts are stored on this device only.': 'ಡೆಮೊ ಆವೃತ್ತಿ: ಖಾತೆಗಳು ಈ ಸಾಧನದಲ್ಲಿ ಮಾತ್ರ ಸಂಗ್ರಹವಾಗುತ್ತವೆ.',
  'Pick your Kannada while registering and watch your home light up.': 'ನೋಂದಣಿಯ ವೇಳೆ ನಿಮ್ಮ ಕನ್ನಡವನ್ನು ಆರಿಸಿ, ನಿಮ್ಮ ಊರು ನಕ್ಷೆಯಲ್ಲಿ ಬೆಳಗುವುದನ್ನು ನೋಡಿ.',
  'Enter a valid 10-digit mobile number.': 'ಸರಿಯಾದ 10 ಅಂಕೆಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.', 'Password must be at least 6 characters.': 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು.',
  'Please enter your name.': 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.', 'Choose which Kannada you speak.': 'ನೀವು ಮಾತನಾಡುವ ಕನ್ನಡವನ್ನು ಆರಿಸಿ.', 'Choose your district.': 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ.', 'Passwords do not match.': 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.',
  'Reset password': 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ', 'Send code': 'ಕೋಡ್ ಕಳುಹಿಸಿ', 'Set new password': 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ', '6-digit code': '6 ಅಂಕೆಗಳ ಕೋಡ್', 'Back to login': 'ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ',
  'Enter the 6-digit code.': '6 ಅಂಕೆಗಳ ಕೋಡ್ ನಮೂದಿಸಿ.', 'Dev mode: your code is {code}': 'ಡೆವ್ ಮೋಡ್: ನಿಮ್ಮ ಕೋಡ್ {code}', 'If this number is registered, a code was sent by SMS.': 'ಈ ಸಂಖ್ಯೆ ನೋಂದಣಿಯಾಗಿದ್ದರೆ, SMS ಮೂಲಕ ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ.',
  'This phone number is already registered. Please log in.': 'ಈ ಫೋನ್ ಸಂಖ್ಯೆ ಈಗಾಗಲೇ ನೋಂದಣಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ.', 'Phone number or password is incorrect.': 'ಫೋನ್ ಸಂಖ್ಯೆ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ.',
  'Password reset needs the server (NEXT_PUBLIC_API_URL).': 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಕೆಗೆ ಸರ್ವರ್ ಬೇಕು.', 'Cannot reach the server. Please try again.': 'ಸರ್ವರ್ ತಲುಪಲು ಆಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', 'Cannot reach the server.': 'ಸರ್ವರ್ ತಲುಪಲು ಆಗುತ್ತಿಲ್ಲ.',
  'Not logged in': 'ಲಾಗಿನ್ ಆಗಿಲ್ಲ', 'User not found': 'ಬಳಕೆದಾರರು ಸಿಗಲಿಲ್ಲ', 'Failed to save changes.': 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಲು ಆಗಲಿಲ್ಲ.', 'Request failed': 'ವಿನಂತಿ ವಿಫಲವಾಯಿತು',
  // welcome / home
  'Namaskara': 'ನಮಸ್ಕಾರ', 'Namaskara, {name}!': 'ನಮಸ್ಕಾರ, {name}!', 'Your dialect: ': 'ನಿಮ್ಮ ಉಪಭಾಷೆ: ', ', district: ': ', ಜಿಲ್ಲೆ: ', '. Both are highlighted on the map below.': '. ಎರಡನ್ನೂ ಕೆಳಗಿನ ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಲಾಗಿದೆ.', 'Not selected': 'ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ',
  'Explore, hear, compare and keep the rich regional dialects of Kannada alive.': 'ಕನ್ನಡದ ಸಮೃದ್ಧ ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ, ಆಲಿಸಿ, ಹೋಲಿಸಿ ಮತ್ತು ಜೀವಂತವಾಗಿಡಿ.',
  'Search words, phrases, regions...': 'ಪದ, ವಾಕ್ಯ, ಪ್ರದೇಶ ಹುಡುಕಿ...', 'Search words, phrases, regions…': 'ಪದ, ವಾಕ್ಯ, ಪ್ರದೇಶ ಹುಡುಕಿ…', 'Word of the Day': 'ಇಂದಿನ ಪದ', 'Play audio': 'ಧ್ವನಿ ಕೇಳಿ', 'Search': 'ಹುಡುಕಿ',
  'Explore by Region': 'ಪ್ರದೇಶದ ಪ್ರಕಾರ ನೋಡಿ', 'Your dialect area is glowing. Tap any region to explore it.': 'ನಿಮ್ಮ ಉಪಭಾಷೆ ಪ್ರದೇಶ ಬೆಳಗುತ್ತಿದೆ. ಯಾವುದೇ ಪ್ರದೇಶವನ್ನು ಒತ್ತಿ ನೋಡಿ.',
  'Click on a region to discover its unique words, phrases, audio and culture.': 'ಪ್ರದೇಶವನ್ನು ಒತ್ತಿ, ಅದರ ವಿಶಿಷ್ಟ ಪದ, ವಾಕ್ಯ, ಧ್ವನಿ ಮತ್ತು ಸಂಸ್ಕೃತಿಯನ್ನು ತಿಳಿಯಿರಿ.', 'You': 'ನೀವು',
  'Featured Word': 'ವಿಶೇಷ ಪದ', 'Meaning: ': 'ಅರ್ಥ: ', 'Region: ': 'ಪ್ರದೇಶ: ', 'Salt': 'ಉಪ್ಪು', 'Coastal Karnataka': 'ಕರಾವಳಿ ಕರ್ನಾಟಕ', 'Add salt and taste it.': 'ಉಪ್ಪು ಹಾಕಿ ರುಚಿ ನೋಡಿ.', 'Learn more': 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',
  'Keep Kannada Alive': 'ಕನ್ನಡವನ್ನು ಜೀವಂತವಾಗಿಡಿ', 'Contribute. Preserve. Be a part of the journey.': 'ಕೊಡುಗೆ ನೀಡಿ. ಉಳಿಸಿ. ಈ ಪಯಣದ ಭಾಗವಾಗಿ.', 'Add a Word': 'ಪದ ಸೇರಿಸಿ',
  'Keep': 'ಉಳಿಸಿ', 'Kannada': 'ಕನ್ನಡ', 'Alive': 'ಜೀವಂತ',
  // shared UI
  'Verified': 'ಪರಿಶೀಲಿತ', 'Pending': 'ಬಾಕಿ', 'Rejected': 'ತಿರಸ್ಕೃತ', 'verified': 'ಪರಿಶೀಲಿತ', 'pending': 'ಬಾಕಿ', 'Everyday': 'ದೈನಂದಿನ', 'Community': 'ಸಮುದಾಯ',
  // map
  'Dialects are a continuum; regions are dialect areas, not hard borders.': 'ಉಪಭಾಷೆಗಳು ನಿರಂತರ ಹರಿವು; ಪ್ರದೇಶಗಳು ಉಪಭಾಷೆಯ ಪ್ರದೇಶಗಳೇ ಹೊರತು ಕಟ್ಟುನಿಟ್ಟಿನ ಗಡಿಗಳಲ್ಲ.',
  'Spoken mainly in: {note}': 'ಮುಖ್ಯವಾಗಿ ಮಾತನಾಡುವ ಪ್ರದೇಶ: {note}', 'No words yet. Be the first to contribute!': 'ಇನ್ನೂ ಪದಗಳಿಲ್ಲ. ಮೊದಲ ಕೊಡುಗೆ ನೀವೇ ನೀಡಿ!', 'Karnataka dialect regions': 'ಕರ್ನಾಟಕದ ಉಪಭಾಷೆ ಪ್ರದೇಶಗಳು', ' (your region)': ' (ನಿಮ್ಮ ಪ್ರದೇಶ)',
  // living
  'Darker saffron = more contributions.': 'ಗಾಢ ಕೇಸರಿ = ಹೆಚ್ಚು ಕೊಡುಗೆಗಳು.', 'Contribution density': 'ಕೊಡುಗೆಗಳ ಸಾಂದ್ರತೆ', 'Help needed in {name}.': '{name} ಪ್ರದೇಶದಲ್ಲಿ ಸಹಾಯ ಬೇಕಿದೆ.', 'Add contribution': 'ಕೊಡುಗೆ ಸೇರಿಸಿ',
  // voices
  'Same phrase, different voices. Tap play to hear each phrase; community recordings play when available.': 'ಕೇಳಲು ಪ್ಲೇ ಒತ್ತಿ; ಸಮುದಾಯದ ಧ್ವನಿಮುದ್ರಣ ಇದ್ದರೆ ಅದೇ ಕೇಳಿಸುತ್ತದೆ.',
  // speak
  'Listen, record, compare. Feedback is approximate, never pass/fail.': 'ಕೇಳಿ, ದಾಖಲಿಸಿ, ಹೋಲಿಸಿ. ಪ್ರತಿಕ್ರಿಯೆ ಅಂದಾಜು ಮಾತ್ರ, ಪಾಸ್/ಫೇಲ್ ಅಲ್ಲ.',
  'I consent to my recording being scored and, only if I press Share, played for the community.': 'ನನ್ನ ಧ್ವನಿಮುದ್ರಣಕ್ಕೆ ಅಂಕ ನೀಡಲು ಮತ್ತು ನಾನು ‘ಹಂಚಿಕೊಳ್ಳಿ’ ಒತ್ತಿದರೆ ಮಾತ್ರ ಸಮುದಾಯಕ್ಕೆ ಕೇಳಿಸಲು ನನ್ನ ಸಮ್ಮತಿ ಇದೆ.',
  'I consent to my recording being played here (stays on this device).': 'ನನ್ನ ಧ್ವನಿಮುದ್ರಣವನ್ನು ಇಲ್ಲಿ ಪ್ಲೇ ಮಾಡಲು ಸಮ್ಮತಿ ಇದೆ (ಈ ಸಾಧನದಲ್ಲೇ ಉಳಿಯುತ್ತದೆ).',
  'Record': 'ರೆಕಾರ್ಡ್', 'Stop': 'ನಿಲ್ಲಿಸಿ', 'Play both': 'ಎರಡನ್ನೂ ಕೇಳಿ', 'Try again': 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', 'Share': 'ಹಂಚಿಕೊಳ್ಳಿ', 'Next phrase': 'ಮುಂದಿನ ವಾಕ್ಯ', 'Upload audio': 'ಧ್ವನಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
  'Community recordings': 'ಸಮುದಾಯದ ಧ್ವನಿಮುದ್ರಣಗಳು', 'How close did it feel?': 'ಎಷ್ಟು ಹತ್ತಿರವಾಗಿತ್ತು?', 'Needs practice': 'ಅಭ್ಯಾಸ ಬೇಕು', 'Close match': 'ಹತ್ತಿರ', 'Nailed it': 'ಅದ್ಭುತ', 'Shabash!': 'ಶಭಾಷ್!',
  'Compare waveforms and rate yourself. Automatic scoring is approximate and only runs when switched on.': 'ತರಂಗಗಳನ್ನು ಹೋಲಿಸಿ, ನೀವೇ ಅಂಕ ನೀಡಿ. ಸ್ವಯಂಚಾಲಿತ ಅಂಕ ಅಂದಾಜು ಮಾತ್ರ, ಅದು ಆನ್ ಮಾಡಿದಾಗ ಮಾತ್ರ ಕೆಲಸ ಮಾಡುತ್ತದೆ.',
  'Microphone unavailable. Upload an audio file instead.': 'ಮೈಕ್ರೊಫೋನ್ ಲಭ್ಯವಿಲ್ಲ. ಬದಲಿಗೆ ಧ್ವನಿ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.', 'Thank you! Your recording was shared.': 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಧ್ವನಿಮುದ್ರಣ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ.',
  // talk
  'Shopping': 'ಶಾಪಿಂಗ್', 'Travelling': 'ಪ್ರಯಾಣ', 'Village': 'ಹಳ್ಳಿ', 'Elder': 'ಹಿರಿಯರು', ' (soon)': ' (ಶೀಘ್ರದಲ್ಲಿ)', 'Restart': 'ಮತ್ತೆ ಆರಂಭಿಸಿ', 'Ask the price': 'ಬೆಲೆ ಕೇಳಿ', 'Just looking': 'ಸುಮ್ಮನೆ ನೋಡುತ್ತಿದ್ದೇನೆ', 'To the bus stand': 'ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ',
  'Vendor (Mysuru)': 'ವ್ಯಾಪಾರಿ (ಮೈಸೂರು)', 'Local (North Karnataka)': 'ಸ್ಥಳೀಯರು (ಉತ್ತರ ಕರ್ನಾಟಕ)', 'What do you need?': 'ನಿಮಗೇನು ಬೇಕು?', 'Twenty rupees': 'ಇಪ್ಪತ್ತು ರೂಪಾಯಿ', 'Please look around': 'ದಯವಿಟ್ಟು ನೋಡಿ', 'Go this way': 'ಹೀಗೆ ಹೋಗಿ',
  // search
  'Kannada script, English or spelling variants like hogona / hogona.': 'ಕನ್ನಡ ಲಿಪಿ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕಾಗುಣಿತ ಬದಲಾವಣೆಗಳು (ಉದಾ: ಹೋಗೋಣ / ಹೋಗೊಣ).',
  'All': 'ಎಲ್ಲಾ', 'Words': 'ಪದಗಳು', 'Phrases': 'ವಾಕ್ಯಗಳು', 'Regions': 'ಪ್ರದೇಶಗಳು', 'No results. Try a different spelling or contribute this word.': 'ಫಲಿತಾಂಶಗಳಿಲ್ಲ. ಬೇರೆ ಕಾಗುಣಿತ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಈ ಪದವನ್ನು ಕೊಡುಗೆ ನೀಡಿ.',
  // battle
  'Same meaning, different regions. Never merged.': 'ಒಂದೇ ಅರ್ಥ, ಬೇರೆ ಬೇರೆ ಪ್ರದೇಶ. ಎಂದಿಗೂ ವಿಲೀನವಾಗುವುದಿಲ್ಲ.', 'Search a meaning…': 'ಅರ್ಥವನ್ನು ಹುಡುಕಿ…', 'Search meaning': 'ಅರ್ಥ ಹುಡುಕಿ', 'Region {n}': 'ಪ್ರದೇಶ {n}', 'Pick a concept with 2+ regions.': '2+ ಪ್ರದೇಶಗಳಿರುವ ಅರ್ಥವನ್ನು ಆರಿಸಿ.', 'VS': 'ವಿರುದ್ಧ', 'Morph focus: {a} ↔ {b}': 'ಗಮನ ಬದಲಾವಣೆ: {a} ↔ {b}',
  // detective
  'Guess the region. No login needed.': 'ಪ್ರದೇಶವನ್ನು ಊಹಿಸಿ. ಲಾಗಿನ್ ಬೇಕಿಲ್ಲ.', 'Score {score} · Best {best}': 'ಅಂಕ {score} · ಅತ್ಯುತ್ತಮ {best}', 'Round over! Final score {score}.': 'ಸುತ್ತು ಮುಗಿಯಿತು! ಅಂತಿಮ ಅಂಕ {score}.', 'Ready, detective?': 'ಸಿದ್ಧರೇ, ಪತ್ತೇದಾರರೇ?', 'Play again': 'ಮತ್ತೆ ಆಡಿ', 'Start': 'ಆರಂಭಿಸಿ', 'Next': 'ಮುಂದೆ',
  '“{en}” — which region?': '“{en}” — ಯಾವ ಪ್ರದೇಶ?', '🎉 Correct!': '🎉 ಸರಿಯಾಗಿದೆ!', 'Not quite — it was {name}.': 'ಸರಿಯಲ್ಲ — ಅದು {name} ಆಗಿತ್ತು.', '⏱ {n}s': '⏱ {n} ಸೆ',
  // contribute
  'Every contribution needs {n} approvals from speakers of the same dialect to become Verified.': 'ಪ್ರತಿ ಕೊಡುಗೆ ‘ಪರಿಶೀಲಿತ’ ಆಗಲು ಅದೇ ಉಪಭಾಷೆಯ {n} ಮಂದಿಯ ಅನುಮೋದನೆ ಬೇಕು.',
  'Kannada script': 'ಕನ್ನಡ ಲಿಪಿ', 'Romanized (e.g. hogona)': 'ರೋಮನ್ ಲಿಪಿಯಲ್ಲಿ (ಐಚ್ಛಿಕ)', 'English meaning': 'ಇಂಗ್ಲಿಷ್ ಅರ್ಥ', 'Meaning': 'ಅರ್ಥ', 'Example sentence (optional)': 'ಉದಾಹರಣೆ ವಾಕ್ಯ (ಐಚ್ಛಿಕ)', 'Example': 'ಉದಾಹರಣೆ', 'Romanized': 'ರೋಮನ್ ಲಿಪಿ', 'Region': 'ಪ್ರದೇಶ',
  'Similar entry exists ({kn}). Add it as a variant only if different.': 'ಇದೇ ರೀತಿಯ ಪದ ಇದೆ ({kn}). ಬೇರೆಯಾಗಿದ್ದರೆ ಮಾತ್ರ ರೂಪಾಂತರವಾಗಿ ಸೇರಿಸಿ.', 'I wrote this myself and agree to share it openly.': 'ಇದನ್ನು ನಾನೇ ಬರೆದಿದ್ದೇನೆ ಮತ್ತು ಮುಕ್ತವಾಗಿ ಹಂಚಲು ಒಪ್ಪುತ್ತೇನೆ.', 'Submit for Review': 'ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ',
  'Kannada word and meaning are required.': 'ಕನ್ನಡ ಪದ ಮತ್ತು ಅರ್ಥ ಅಗತ್ಯ.', 'Please keep it respectful.': 'ದಯವಿಟ್ಟು ಗೌರವಯುತವಾಗಿರಲಿ.', 'Please confirm the consent box.': 'ದಯವಿಟ್ಟು ಸಮ್ಮತಿ ಪೆಟ್ಟಿಗೆಯನ್ನು ಖಚಿತಪಡಿಸಿ.',
  'Thank you! It stays Pending until {n} speakers of {name} approve it, then it shows as Verified.': 'ಧನ್ಯವಾದಗಳು! {name} ಮಾತನಾಡುವ {n} ಮಂದಿ ಅನುಮೋದಿಸುವವರೆಗೆ ಇದು ‘ಬಾಕಿ’ ಇರುತ್ತದೆ, ನಂತರ ‘ಪರಿಶೀಲಿತ’ ಎಂದು ತೋರಿಸುತ್ತದೆ.',
  '{a}/{b} approvals from {name} speakers': '{name} ಮಾತನಾಡುವವರಿಂದ {a}/{b} ಅನುಮೋದನೆ', '🔒 Only {name} speakers can approve this': '🔒 {name} ಮಾತನಾಡುವವರು ಮಾತ್ರ ಇದನ್ನು ಅನುಮೋದಿಸಬಹುದು', 'You submitted this': 'ನೀವೇ ಸಲ್ಲಿಸಿದ್ದೀರಿ', 'Only {name} speakers can approve': '{name} ಮಾತನಾಡುವವರು ಮಾತ್ರ ಅನುಮೋದಿಸಬಹುದು',
  'You approved this': 'ನೀವು ಇದನ್ನು ಅನುಮೋದಿಸಿದ್ದೀರಿ', 'Approve': 'ಅನುಮೋದಿಸಿ', '✓ Approved': '✓ ಅನುಮೋದಿತ', 'Yours': 'ನಿಮ್ಮದು',
  'Please log in to approve.': 'ಅನುಮೋದಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ.', 'This entry is already verified.': 'ಈ ಪದ ಈಗಾಗಲೇ ಪರಿಶೀಲಿತವಾಗಿದೆ.', 'Only {name} speakers can approve this.': '{name} ಮಾತನಾಡುವವರು ಮಾತ್ರ ಇದನ್ನು ಅನುಮೋದಿಸಬಹುದು.',
  'Verified! {n} speakers approved it.': 'ಪರಿಶೀಲಿತ! {n} ಮಂದಿ ಅನುಮೋದಿಸಿದ್ದಾರೆ.', 'Approved. {a}/{b} approvals so far.': 'ಅನುಮೋದಿಸಲಾಗಿದೆ. ಇಲ್ಲಿಯವರೆಗೆ {a}/{b} ಅನುಮೋದನೆ.', "You can't approve your own contribution.": 'ನಿಮ್ಮ ಸ್ವಂತ ಕೊಡುಗೆಯನ್ನು ನೀವೇ ಅನುಮೋದಿಸಲು ಆಗುವುದಿಲ್ಲ.', 'You have already approved this.': 'ನೀವು ಇದನ್ನು ಈಗಾಗಲೇ ಅನುಮೋದಿಸಿದ್ದೀರಿ.',
  // about
  'Standard Kannada is well documented. Regional speech is fading with younger generations. Namma Kannada is a community platform to document, hear, compare and practise it.': 'ಪ್ರಮಾಣಿತ ಕನ್ನಡ ಚೆನ್ನಾಗಿ ದಾಖಲಾಗಿದೆ. ಪ್ರಾದೇಶಿಕ ಮಾತು ಯುವ ಪೀಳಿಗೆಯಲ್ಲಿ ಮಸುಕಾಗುತ್ತಿದೆ. ನಮ್ಮ ಕನ್ನಡ ಅದನ್ನು ದಾಖಲಿಸಲು, ಕೇಳಲು, ಹೋಲಿಸಲು ಮತ್ತು ಅಭ್ಯಾಸ ಮಾಡಲು ಇರುವ ಸಮುದಾಯ ವೇದಿಕೆ.',
  'Sample entries are placeholders until verified by native speakers. Recordings need consent and can be deleted.': 'ಮಾದರಿ ಪದಗಳನ್ನು ಸ್ಥಳೀಯ ಮಾತನಾಡುವವರು ಪರಿಶೀಲಿಸುವವರೆಗೆ ತಾತ್ಕಾಲಿಕ ಎಂದು ತಿಳಿಯಿರಿ. ಧ್ವನಿಮುದ್ರಣಕ್ಕೆ ಸಮ್ಮತಿ ಅಗತ್ಯ, ಅದನ್ನು ಅಳಿಸಬಹುದು.',
  '{a} verified words · {b} community submissions': '{a} ಪರಿಶೀಲಿತ ಪದಗಳು · {b} ಸಮುದಾಯ ಕೊಡುಗೆಗಳು', 'Download open dictionary': 'ಮುಕ್ತ ನಿಘಂಟು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ', 'Demo mode (seed progress)': 'ಡೆಮೊ ಮೋಡ್ (ಮಾದರಿ ಪ್ರಗತಿ)',
  // profile
  'Please choose your Kannada.': 'ನಿಮ್ಮ ಕನ್ನಡವನ್ನು ಆರಿಸಿ.', 'Please select your district.': 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ.', 'Profile updated.': 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ.',
  'Log in or create an account to save your progress and light up your home on the map.': 'ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಉಳಿಸಲು ಮತ್ತು ನಕ್ಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಊರನ್ನು ಬೆಳಗಿಸಲು ಲಾಗ್ ಇನ್ ಆಗಿ ಅಥವಾ ಖಾತೆ ರಚಿಸಿ.',
  'Beginner': 'ಹೊಸಬ', 'Explorer': 'ಅನ್ವೇಷಕ', 'Speaker': 'ಮಾತುಗಾರ', 'Dialect Expert': 'ಉಪಭಾಷೆ ತಜ್ಞ', 'Kannada Champion': 'ಕನ್ನಡ ಚಾಂಪಿಯನ್',
  'First Word': 'ಮೊದಲ ಪದ', 'Word Collector': 'ಪದ ಸಂಗ್ರಾಹಕ', 'Map Master': 'ನಕ್ಷೆ ಪ್ರವೀಣ', 'Contributor': 'ಕೊಡುಗೆದಾರ', 'Verified Voice': 'ಪರಿಶೀಲಿತ ಧ್ವನಿ', 'Sharp Mind': 'ಚುರುಕು ಮನಸ್ಸು', 'Champion': 'ಚಾಂಪಿಯನ್',
  'Learn your first word': 'ಮೊದಲ ಪದ ಕಲಿಯಿರಿ', 'Learn 10 words': '10 ಪದ ಕಲಿಯಿರಿ', 'Explore 3 regions': '3 ಪ್ರದೇಶ ನೋಡಿ', 'Explore all regions': 'ಎಲ್ಲಾ ಪ್ರದೇಶ ನೋಡಿ', 'Contribute a word': 'ಒಂದು ಪದ ನೀಡಿ', 'Get a word verified': 'ಪದ ಪರಿಶೀಲನೆಯಾಗಲಿ', 'Score 100+ in a game': 'ಆಟದಲ್ಲಿ 100+ ಅಂಕ', 'Reach the top level': 'ಅತ್ಯುನ್ನತ ಹಂತ ತಲುಪಿ',
  'Cancel': 'ರದ್ದು', 'Edit profile': 'ಪ್ರೊಫೈಲ್ ಎಡಿಟ್', 'Your dialect isn’t set yet. Choose the Kannada you speak to see your region on the map and to vote on words from your dialect.': 'ನಿಮ್ಮ ಉಪಭಾಷೆಯನ್ನು ಇನ್ನೂ ಆರಿಸಿಲ್ಲ. ನಕ್ಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಪ್ರದೇಶ ನೋಡಲು ಮತ್ತು ನಿಮ್ಮ ಉಪಭಾಷೆಯ ಪದಗಳಿಗೆ ಮತ ನೀಡಲು ನೀವು ಮಾತನಾಡುವ ಕನ್ನಡವನ್ನು ಆರಿಸಿ.',
  'Choose my dialect': 'ನನ್ನ ಉಪಭಾಷೆ ಆರಿಸಿ', 'Edit your details': 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಎಡಿಟ್ ಮಾಡಿ', 'Saving…': 'ಉಳಿಸಲಾಗುತ್ತಿದೆ…', 'Save changes': 'ಬದಲಾವಣೆ ಉಳಿಸಿ', 'Your level': 'ನಿಮ್ಮ ಹಂತ', '{n} XP to {name}': '{name} ಹಂತಕ್ಕೆ {n} XP',
  'Earn XP: 10 per word learned, 15 per region explored, plus points from games.': 'XP ಗಳಿಸಿ: ಕಲಿತ ಪ್ರತಿ ಪದಕ್ಕೆ 10, ನೋಡಿದ ಪ್ರತಿ ಪ್ರದೇಶಕ್ಕೆ 15, ಜೊತೆಗೆ ಆಟದ ಅಂಕಗಳು.', 'Words learned': 'ಕಲಿತ ಪದಗಳು', 'Regions explored': 'ನೋಡಿದ ಪ್ರದೇಶಗಳು', 'Points': 'ಅಂಕಗಳು', 'Best score': 'ಅತ್ಯುತ್ತಮ ಅಂಕ',
  'Your place on the map': 'ನಕ್ಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಸ್ಥಾನ', 'About your Kannada': 'ನಿಮ್ಮ ಕನ್ನಡದ ಬಗ್ಗೆ', 'Spoken in': 'ಮಾತನಾಡುವ ಪ್ರದೇಶ', 'Districts in your dialect area': 'ನಿಮ್ಮ ಉಪಭಾಷೆ ಪ್ರದೇಶದ ಜಿಲ್ಲೆಗಳು', 'Words from your dialect': 'ನಿಮ್ಮ ಉಪಭಾಷೆಯ ಪದಗಳು',
  'Set your dialect to see details about your Kannada.': 'ನಿಮ್ಮ ಕನ್ನಡದ ವಿವರಗಳನ್ನು ನೋಡಲು ಉಪಭಾಷೆ ಆರಿಸಿ.', 'Badges': 'ಬ್ಯಾಡ್ಜ್‌ಗಳು', 'earned': 'ಗಳಿಸಿದ', 'My contributions': 'ನನ್ನ ಕೊಡುಗೆಗಳು', 'Add a word': 'ಪದ ಸೇರಿಸಿ', 'approvals': 'ಅನುಮೋದನೆ',
  'You haven’t contributed yet. Share a word or phrase from your dialect!': 'ನೀವು ಇನ್ನೂ ಕೊಡುಗೆ ನೀಡಿಲ್ಲ. ನಿಮ್ಮ ಉಪಭಾಷೆಯ ಪದ ಅಥವಾ ವಾಕ್ಯವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ!', 'Keep going': 'ಮುಂದುವರಿಸಿ', 'Explore the map': 'ನಕ್ಷೆ ನೋಡಿ', 'Speak like a local': 'ಸ್ಥಳೀಯರಂತೆ ಮಾತು', 'Your Kannada, your district, your progress.': 'ನಿಮ್ಮ ಕನ್ನಡ, ನಿಮ್ಮ ಜಿಲ್ಲೆ, ನಿಮ್ಮ ಪ್ರಗತಿ.',
  'XP': 'XP',
  // contribute: voice recording
  'Record your voice (optional)': 'ನಿಮ್ಮ ಧ್ವನಿ ಮುದ್ರಿಸಿ (ಐಚ್ಛಿಕ)',
  'Say the word or sentence so others can hear how it sounds in your dialect.': 'ಈ ಪದ ಅಥವಾ ವಾಕ್ಯವನ್ನು ಹೇಳಿ, ನಿಮ್ಮ ಉಪಭಾಷೆಯಲ್ಲಿ ಹೇಗೆ ಕೇಳಿಸುತ್ತದೆ ಎಂದು ಇತರರು ಕೇಳಲಿ.',
  'Recording… tap Stop when done': 'ಮುದ್ರಣ ನಡೆಯುತ್ತಿದೆ… ಮುಗಿದ ಮೇಲೆ ನಿಲ್ಲಿಸಿ ಒತ್ತಿ',
  'Record again': 'ಮತ್ತೆ ಮುದ್ರಿಸಿ', 'Remove recording': 'ಮುದ್ರಣ ತೆಗೆಯಿರಿ', 'Your recording': 'ನಿಮ್ಮ ಮುದ್ರಣ',
  'Microphone unavailable. Please allow microphone access.': 'ಮೈಕ್ರೋಫೋನ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೈಕ್ ಅನುಮತಿ ನೀಡಿ.',
  'I recorded this myself and agree to share my voice openly.': 'ಇದನ್ನು ನಾನೇ ಮುದ್ರಿಸಿದ್ದೇನೆ; ನನ್ನ ಧ್ವನಿಯನ್ನು ಎಲ್ಲರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ಒಪ್ಪುತ್ತೇನೆ.',
  'Hear how it sounds': 'ಹೇಗೆ ಕೇಳಿಸುತ್ತದೆ ಎಂದು ಕೇಳಿ', '🎙 Community recording': '🎙 ಸಮುದಾಯದ ಧ್ವನಿ',
  'Recording is too long. Please keep it under 15 seconds.': 'ಮುದ್ರಣ ತುಂಬಾ ಉದ್ದವಾಗಿದೆ. 15 ಸೆಕೆಂಡ್ ಒಳಗೆ ಇರಲಿ.',
  'Audio could not be played. Check that your device is not muted, then try again.': 'ಧ್ವನಿ ಪ್ಲೇ ಆಗಲಿಲ್ಲ. ಸಾಧನ ಮ್ಯೂಟ್ ಆಗಿಲ್ಲವೆಂದು ಪರಿಶೀಲಿಸಿ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
}
