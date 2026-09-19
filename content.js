// EDIT YOUR WEBSITE HERE. Keep quotation marks and commas in place.
// Images: put files in assets/ and use a path such as "assets/president.jpg".
// Empty photo fields show a friendly placeholder. Quotes below start empty
// because no real member quotes were supplied. Replace draft copy as needed.
window.AASA_CONTENT = {
  heroTitle: "Welcome to AASA",
  heroDescription: "Asian American Student Association at The University of Alabama.",
  // Put your logo in assets/ and enter its path, e.g. "assets/logo.png".
  logo: "",
  mission: "We bring students together to celebrate Asian and Asian American cultures, build meaningful friendships, and create a sense of belonging on campus.",
  welcome: "Join us for games, creative nights, food, and conversation. Everyone is welcome.",
  semester: "FALL 2026",
  eventsNote: "Fall dates from our event schedule. Check Instagram for updates and location confirmations. All times are Central.",
  // Dates use YYYY-MM-DD. The site calculates weekdays automatically.
  // October 13 and November 5 weekday labels in the supplied poster conflict
  // with the 2026 calendar; these entries retain the poster's numeric dates.
  events: [
    {date: "2026-09-03", title: "Trivia & Bingo", time: "6–8 PM", location: "Bevill 1000"},
    {date: "2026-09-15", title: "Olympic Games", time: "6–8 PM", location: "Location to be confirmed"},
    {date: "2026-10-01", title: "Art Night", time: "6–8 PM", location: "Bevill 1000"},
    {date: "2026-10-13", title: "Cookies & Cooking", time: "6–8 PM", location: "East Edge lobby · date to be confirmed"},
    {date: "2026-11-05", title: "Movie Night", time: "6–8 PM", location: "Bevill 1000 · date to be confirmed"},
    {date: "2026-11-15", title: "Friendsgiving", time: "6–8 PM", location: "Bevill 1000"}
  ],
  announcements: [
    {label: "FALL 2026", title: "A semester of getting together", text: "From art night to Friendsgiving, explore this semester’s events and make room for a little AASA in your week."},
    {label: "STAY IN THE LOOP", title: "The latest, straight from AASA", text: "Follow @ua.aasa on Instagram for event reminders, photos, and any last-minute changes."}
  ],
  officerNote: "Your 2026–2027 executive board.",
  // Add photo paths and optional short bios for each officer.
  officers: [
    {name: "Meredith Dai", role: "President", photo: "", bio: ""},
    {name: "Nolan Reddoch", role: "Vice President", photo: "", bio: ""},
    {name: "Evan Chen", role: "Treasurer", photo: "", bio: ""},
    {name: "Ivy Allen", role: "Secretary", photo: "", bio: ""},
    {name: "Katie Nguyen", role: "Co-director of Communications", photo: "", bio: ""},
    {name: "Amanda Koshak", role: "Co-director of Communications", photo: "", bio: ""},
    {name: "Daniel Le", role: "Co-director of Recruitment", photo: "", bio: ""},
    {name: "Jordyn Chang", role: "Co-director of Recruitment", photo: "", bio: ""}
  ],
  // For full-resolution photos, change src and delete the crop property.
  gallery: [
    {src: "assets/instagram-reference.png", crop: "olympics", alt: "Students at the AASA Olympics", caption: "A little friendly competition", label: "AASA OLYMPICS"},
    {src: "assets/instagram-reference.png", crop: "bingo", alt: "AASA bingo and trivia night game board", caption: "A full card. A good night.", label: "TRIVIA & BINGO"},
    {src: "assets/instagram-reference.png", crop: "poster", alt: "Blue and white AASA Trivia and Bingo event flyer", caption: "There’s always a reason to meet up.", label: "AROUND THE CLUB"}
  ],
  // Add real quotes with permission, for example:
  // {text: "Paste a member’s actual quote here.", name: "Their name", detail: "AASA member"}
  quotes: [],
  quotesEmpty: "Member stories are on their way. Have an AASA memory to share? Send us a message — we’d love to hear it.",
  contactMessage: "Curious about AASA or an upcoming event? Message us on Instagram. We’d love to hear from you.",
  instagram: "https://www.instagram.com/ua.aasa/",
  // Add a club email to display an email link. Leave blank to hide it.
  email: ""
};
