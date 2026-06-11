// src/data/geography.ts

// US States with major cities
export const US_STATES = [
  { state: 'Alabama', slug: 'alabama', abbr: 'AL', cities: ['birmingham', 'montgomery', 'huntsville', 'mobile', 'tuscaloosa'] },
  { state: 'Alaska', slug: 'alaska', abbr: 'AK', cities: ['anchorage', 'juneau', 'fairbanks', 'sitka', 'ketchikan'] },
  { state: 'Arizona', slug: 'arizona', abbr: 'AZ', cities: ['phoenix', 'tucson', 'scottsdale', 'mesa', 'chandler'] },
  { state: 'Arkansas', slug: 'arkansas', abbr: 'AR', cities: ['little-rock', 'fort-smith', 'fayetteville', 'springdale', 'jonesboro'] },
  { state: 'California', slug: 'california', abbr: 'CA', cities: ['los-angeles', 'san-francisco', 'san-diego', 'sacramento', 'san-jose', 'fresno', 'oakland', 'long-beach'] },
  { state: 'Colorado', slug: 'colorado', abbr: 'CO', cities: ['denver', 'colorado-springs', 'aurora', 'fort-collins', 'boulder'] },
  { state: 'Connecticut', slug: 'connecticut', abbr: 'CT', cities: ['bridgeport', 'new-haven', 'stamford', 'hartford', 'waterbury'] },
  { state: 'Delaware', slug: 'delaware', abbr: 'DE', cities: ['wilmington', 'dover', 'newark', 'middletown', 'smyrna'] },
  { state: 'Florida', slug: 'florida', abbr: 'FL', cities: ['miami', 'orlando', 'tampa', 'jacksonville', 'fort-lauderdale', 'tallahassee', 'st-petersburg', 'hialeah'] },
  { state: 'Georgia', slug: 'georgia', abbr: 'GA', cities: ['atlanta', 'savannah', 'augusta', 'columbus', 'macon'] },
  { state: 'Hawaii', slug: 'hawaii', abbr: 'HI', cities: ['honolulu', 'hilo', 'kailua', 'pearl-city', 'waipahu'] },
  { state: 'Idaho', slug: 'idaho', abbr: 'ID', cities: ['boise', 'nampa', 'meridian', 'idaho-falls', 'pocatello'] },
  { state: 'Illinois', slug: 'illinois', abbr: 'IL', cities: ['chicago', 'aurora', 'naperville', 'joliet', 'rockford', 'springfield'] },
  { state: 'Indiana', slug: 'indiana', abbr: 'IN', cities: ['indianapolis', 'fort-wayne', 'evansville', 'south-bend', 'carmel'] },
  { state: 'Iowa', slug: 'iowa', abbr: 'IA', cities: ['des-moines', 'cedar-rapids', 'davenport', 'sioux-city', 'iowa-city'] },
  { state: 'Kansas', slug: 'kansas', abbr: 'KS', cities: ['wichita', 'overland-park', 'kansas-city', 'topeka', 'olathe'] },
  { state: 'Kentucky', slug: 'kentucky', abbr: 'KY', cities: ['louisville', 'lexington', 'bowling-green', 'owensboro', 'covington'] },
  { state: 'Louisiana', slug: 'louisiana', abbr: 'LA', cities: ['new-orleans', 'baton-rouge', 'shreveport', 'lafayette', 'lake-charles'] },
  { state: 'Maine', slug: 'maine', abbr: 'ME', cities: ['portland', 'lewiston', 'bangor', 'south-portland', 'auburn'] },
  { state: 'Maryland', slug: 'maryland', abbr: 'MD', cities: ['baltimore', 'frederick', 'rockville', 'gaithersburg', 'bowie'] },
  { state: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', cities: ['boston', 'worcester', 'springfield', 'cambridge', 'lowell'] },
  { state: 'Michigan', slug: 'michigan', abbr: 'MI', cities: ['detroit', 'grand-rapids', 'warren', 'sterling-heights', 'lansing', 'ann-arbor'] },
  { state: 'Minnesota', slug: 'minnesota', abbr: 'MN', cities: ['minneapolis', 'saint-paul', 'rochester', 'duluth', 'bloomington'] },
  { state: 'Mississippi', slug: 'mississippi', abbr: 'MS', cities: ['jackson', 'gulfport', 'southaven', 'hattiesburg', 'biloxi'] },
  { state: 'Missouri', slug: 'missouri', abbr: 'MO', cities: ['kansas-city', 'saint-louis', 'springfield', 'columbia', 'independence'] },
  { state: 'Montana', slug: 'montana', abbr: 'MT', cities: ['billings', 'missoula', 'great-falls', 'bozeman', 'butte'] },
  { state: 'Nebraska', slug: 'nebraska', abbr: 'NE', cities: ['omaha', 'lincoln', 'bellevue', 'grand-island', 'kearney'] },
  { state: 'Nevada', slug: 'nevada', abbr: 'NV', cities: ['las-vegas', 'henderson', 'reno', 'north-las-vegas', 'sparks'] },
  { state: 'New Hampshire', slug: 'new-hampshire', abbr: 'NH', cities: ['manchester', 'nashua', 'concord', 'dover', 'rochester'] },
  { state: 'New Jersey', slug: 'new-jersey', abbr: 'NJ', cities: ['newark', 'jersey-city', 'paterson', 'elizabeth', 'edison', 'trenton'] },
  { state: 'New Mexico', slug: 'new-mexico', abbr: 'NM', cities: ['albuquerque', 'las-cruces', 'rio-rancho', 'santa-fe', 'roswell'] },
  { state: 'New York', slug: 'new-york', abbr: 'NY', cities: ['new-york', 'buffalo', 'rochester', 'yonkers', 'syracuse', 'albany', 'brooklyn', 'queens'] },
  { state: 'North Carolina', slug: 'north-carolina', abbr: 'NC', cities: ['charlotte', 'raleigh', 'greensboro', 'durham', 'winston-salem', 'fayetteville'] },
  { state: 'North Dakota', slug: 'north-dakota', abbr: 'ND', cities: ['fargo', 'bismarck', 'grand-forks', 'minot', 'west-fargo'] },
  { state: 'Ohio', slug: 'ohio', abbr: 'OH', cities: ['columbus', 'cleveland', 'cincinnati', 'toledo', 'akron', 'dayton'] },
  { state: 'Oklahoma', slug: 'oklahoma', abbr: 'OK', cities: ['oklahoma-city', 'tulsa', 'norman', 'broken-arrow', 'lawton'] },
  { state: 'Oregon', slug: 'oregon', abbr: 'OR', cities: ['portland', 'salem', 'eugene', 'gresham', 'hillsboro'] },
  { state: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA', cities: ['philadelphia', 'pittsburgh', 'allentown', 'erie', 'reading', 'scranton'] },
  { state: 'Rhode Island', slug: 'rhode-island', abbr: 'RI', cities: ['providence', 'cranston', 'warwick', 'pawtucket', 'east-providence'] },
  { state: 'South Carolina', slug: 'south-carolina', abbr: 'SC', cities: ['columbia', 'charleston', 'north-charleston', 'mount-pleasant', 'greenville'] },
  { state: 'South Dakota', slug: 'south-dakota', abbr: 'SD', cities: ['sioux-falls', 'rapid-city', 'aberdeen', 'brookings', 'watertown'] },
  { state: 'Tennessee', slug: 'tennessee', abbr: 'TN', cities: ['nashville', 'memphis', 'knoxville', 'chattanooga', 'clarksville'] },
  { state: 'Texas', slug: 'texas', abbr: 'TX', cities: ['houston', 'san-antonio', 'dallas', 'austin', 'fort-worth', 'el-paso', 'arlington', 'corpus-christi'] },
  { state: 'Utah', slug: 'utah', abbr: 'UT', cities: ['salt-lake-city', 'west-valley-city', 'provo', 'west-jordan', 'orem'] },
  { state: 'Vermont', slug: 'vermont', abbr: 'VT', cities: ['burlington', 'south-burlington', 'rutland', 'barre', 'montpelier'] },
  { state: 'Virginia', slug: 'virginia', abbr: 'VA', cities: ['virginia-beach', 'norfolk', 'chesapeake', 'richmond', 'newport-news', 'alexandria'] },
  { state: 'Washington', slug: 'washington', abbr: 'WA', cities: ['seattle', 'spokane', 'tacoma', 'vancouver', 'bellevue', 'kent'] },
  { state: 'West Virginia', slug: 'west-virginia', abbr: 'WV', cities: ['charleston', 'huntington', 'morgantown', 'parkersburg', 'wheeling'] },
  { state: 'Wisconsin', slug: 'wisconsin', abbr: 'WI', cities: ['milwaukee', 'madison', 'green-bay', 'kenosha', 'racine'] },
  { state: 'Wyoming', slug: 'wyoming', abbr: 'WY', cities: ['cheyenne', 'casper', 'laramie', 'gillette', 'rock-springs'] },
];

// Global regions with countries and cities
export const GLOBAL_REGIONS = [
  {
    region: 'Africa',
    emoji: '🌍',
    countries: [
      { country: 'Nigeria', slug: 'nigeria', cities: ['lagos', 'abuja', 'kano', 'ibadan', 'port-harcourt', 'enugu', 'kaduna'] },
      { country: 'Ghana', slug: 'ghana', cities: ['accra', 'kumasi', 'cape-coast', 'tamale', 'sekondi'] },
      { country: 'Kenya', slug: 'kenya', cities: ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret'] },
      { country: 'South Africa', slug: 'south-africa', cities: ['johannesburg', 'cape-town', 'durban', 'pretoria', 'port-elizabeth'] },
      { country: 'Ethiopia', slug: 'ethiopia', cities: ['addis-ababa', 'dire-dawa', 'mekelle', 'gondar', 'hawassa'] },
      { country: 'Tanzania', slug: 'tanzania', cities: ['dar-es-salaam', 'dodoma', 'arusha', 'mwanza', 'zanzibar'] },
      { country: 'Uganda', slug: 'uganda', cities: ['kampala', 'gulu', 'entebbe', 'jinja', 'mbarara'] },
      { country: 'Rwanda', slug: 'rwanda', cities: ['kigali', 'butare', 'gitarama', 'musanze', 'gisenyi'] },
      { country: 'Senegal', slug: 'senegal', cities: ['dakar', 'thies', 'saint-louis', 'ziguinchor', 'kaolack'] },
      { country: 'Ivory Coast', slug: 'ivory-coast', cities: ['abidjan', 'bouake', 'daloa', 'yamoussoukro', 'korhogo'] },
    ]
  },
  {
    region: 'Americas',
    emoji: '🌎',
    countries: [
      { country: 'United States', slug: 'united-states', cities: [] }, // handled by US States page
      { country: 'Canada', slug: 'canada', cities: ['toronto', 'vancouver', 'montreal', 'calgary', 'ottawa', 'edmonton'] },
      { country: 'Brazil', slug: 'brazil', cities: ['sao-paulo', 'rio-de-janeiro', 'brasilia', 'salvador', 'fortaleza', 'belo-horizonte'] },
      { country: 'Mexico', slug: 'mexico', cities: ['mexico-city', 'guadalajara', 'monterrey', 'puebla', 'tijuana'] },
      { country: 'Colombia', slug: 'colombia', cities: ['bogota', 'medellin', 'cali', 'barranquilla', 'cartagena'] },
      { country: 'Argentina', slug: 'argentina', cities: ['buenos-aires', 'cordoba', 'rosario', 'mendoza', 'la-plata'] },
      { country: 'Peru', slug: 'peru', cities: ['lima', 'arequipa', 'trujillo', 'chiclayo', 'cusco'] },
    ]
  },
  {
    region: 'Asia & Pacific',
    emoji: '🌏',
    countries: [
      { country: 'India', slug: 'india', cities: ['mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'kolkata', 'pune', 'ahmedabad'] },
      { country: 'Pakistan', slug: 'pakistan', cities: ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad'] },
      { country: 'Bangladesh', slug: 'bangladesh', cities: ['dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna'] },
      { country: 'Philippines', slug: 'philippines', cities: ['manila', 'quezon-city', 'cebu', 'davao', 'makati'] },
      { country: 'Indonesia', slug: 'indonesia', cities: ['jakarta', 'surabaya', 'bandung', 'medan', 'bekasi'] },
      { country: 'Malaysia', slug: 'malaysia', cities: ['kuala-lumpur', 'george-town', 'johor-bahru', 'ipoh', 'shah-alam'] },
      { country: 'Japan', slug: 'japan', cities: ['tokyo', 'osaka', 'yokohama', 'nagoya', 'sapporo', 'fukuoka'] },
      { country: 'South Korea', slug: 'south-korea', cities: ['seoul', 'busan', 'incheon', 'daegu', 'daejeon'] },
      { country: 'Australia', slug: 'australia', cities: ['sydney', 'melbourne', 'brisbane', 'perth', 'adelaide'] },
    ]
  },
  {
    region: 'Europe',
    emoji: '🇪🇺',
    countries: [
      { country: 'United Kingdom', slug: 'united-kingdom', cities: ['london', 'manchester', 'birmingham', 'leeds', 'glasgow', 'liverpool', 'bristol', 'edinburgh'] },
      { country: 'Germany', slug: 'germany', cities: ['berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'dusseldorf'] },
      { country: 'France', slug: 'france', cities: ['paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes'] },
      { country: 'Spain', slug: 'spain', cities: ['madrid', 'barcelona', 'valencia', 'seville', 'zaragoza'] },
      { country: 'Italy', slug: 'italy', cities: ['rome', 'milan', 'naples', 'turin', 'palermo', 'florence'] },
      { country: 'Netherlands', slug: 'netherlands', cities: ['amsterdam', 'rotterdam', 'the-hague', 'utrecht', 'eindhoven'] },
      { country: 'Portugal', slug: 'portugal', cities: ['lisbon', 'porto', 'braga', 'coimbra', 'setubal'] },
      { country: 'Ireland', slug: 'ireland', cities: ['dublin', 'cork', 'limerick', 'galway', 'waterford'] },
    ]
  },
  {
    region: 'Middle East',
    emoji: '🌐',
    countries: [
      { country: 'UAE', slug: 'uae', cities: ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'ras-al-khaimah'] },
      { country: 'Saudi Arabia', slug: 'saudi-arabia', cities: ['riyadh', 'jeddah', 'mecca', 'medina', 'dammam'] },
      { country: 'Qatar', slug: 'qatar', cities: ['doha', 'al-wakrah', 'al-khor', 'umm-salal', 'al-rayyan'] },
      { country: 'Kuwait', slug: 'kuwait', cities: ['kuwait-city', 'salmiya', 'hawalli', 'ahmadi', 'farwaniya'] },
      { country: 'Bahrain', slug: 'bahrain', cities: ['manama', 'riffa', 'muharraq', 'hamad', 'isa-town'] },
    ]
  },
];
