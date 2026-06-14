// This is the core intelligence for geographic diversity

export const CITY_DISTRICTS: Record<string, string[]> = {
  // Nigeria
  'lagos': [
    'Victoria Island', 'Lekki', 'Ikeja', 'Surulere',
    'Yaba', 'Ajah', 'Maryland', 'Ikoyi', 'Apapa',
    'Festac', 'Agege', 'Mushin', 'Oshodi', 'Ojota',
    'Gbagada', 'Magodo', 'Ojodu', 'Isale Eko', 'Lagos Island',
    'Oregun', 'Palmgrove', 'Ketu', 'Mile 12', 'Berger',
  ],
  'abuja': [
    'Wuse', 'Garki', 'Maitama', 'Asokoro', 'Gwarinpa',
    'Kubwa', 'Lugbe', 'Nyanya', 'Karu', 'Dutse',
    'Jabi', 'Utako', 'Gudu', 'Apo', 'Lokogoma',
  ],
  'london': [
    'Camden', 'Hackney', 'Southwark', 'Lambeth', 'Tower Hamlets',
    'Islington', 'Haringey', 'Lewisham', 'Greenwich', 'Newham',
    'Wandsworth', 'Hammersmith', 'Fulham', 'Kensington', 'Chelsea',
    'Westminster', 'City of London', 'Croydon', 'Bromley', 'Ealing',
    'Brent', 'Barnet', 'Enfield', 'Waltham Forest', 'Redbridge',
  ],
  'dubai': [
    'Downtown Dubai', 'Dubai Marina', 'Jumeirah', 'Deira', 'Bur Dubai',
    'Business Bay', 'DIFC', 'Jumeirah Lake Towers', 'Al Barsha',
    'Dubai Silicon Oasis', 'Al Quoz', 'Karama', 'Oud Metha',
    'Mirdif', 'Al Rashidiya', 'Festival City', 'Dubai Hills',
  ],
  'mumbai': [
    'Bandra', 'Andheri', 'Powai', 'Worli', 'Lower Parel',
    'Dadar', 'Kurla', 'Ghatkopar', 'Vikhroli', 'Mulund',
    'Thane', 'Navi Mumbai', 'Borivali', 'Malad', 'Goregaon',
    'Santacruz', 'Vile Parle', 'Juhu', 'Fort', 'Colaba',
  ],
  'nairobi': [
    'Westlands', 'Kilimani', 'Karen', 'Lavington', 'Kileleshwa',
    'Parklands', 'Upperhill', 'CBD', 'Industrial Area', 'Eastleigh',
    'South B', 'South C', 'Langata', 'Ngong Road', 'Ruaka',
  ],
  'accra': [
    'Osu', 'Labone', 'Airport Residential', 'East Legon', 'Cantonments',
    'Adabraka', 'Accra Central', 'Dzorwulu', 'Tesano', 'Achimota',
    'Dansoman', 'Madina', 'Tema', 'Kasoa', 'Spintex',
  ],
  'johannesburg': [
    'Sandton', 'Rosebank', 'Melville', 'Soweto', 'Alexandra',
    'Midrand', 'Fourways', 'Randburg', 'Roodepoort', 'CBD',
    'Parktown', 'Braamfontein', 'Maboneng', 'Norwood', 'Illovo',
  ],
  'new-york': [
    'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island',
    'Harlem', 'Midtown', 'Lower East Side', 'Upper West Side',
    'Williamsburg', 'Astoria', 'Flushing', 'Bushwick', 'Park Slope',
  ],
  'toronto': [
    'Downtown', 'North York', 'Scarborough', 'Etobicoke', 'York',
    'Midtown', 'Annex', 'Kensington', 'Little Portugal', 'Leslieville',
    'Rosedale', 'Forest Hill', 'Liberty Village', 'Distillery District',
  ],
}

// Default: split city name itself into search areas
export const getSearchDistricts = (city: string): string[] => {
  const cityKey = city.toLowerCase().replace(/\s+/g, '-')
  return CITY_DISTRICTS[cityKey] || [city] // fallback to city itself
}
