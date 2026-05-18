export const communes: Record<number, string[]> = {
  16: [ // Alger
    "Alger Centre", "Sidi M'Hamed", "El Madania", "Belouizdad", "Bab El Oued", "Bologhine", "Casbah", "Oued Koriche", 
    "Bir Mourad Raïs", "El Biar", "Bouzareah", "Birkhadem", "El Harrach", "Baraki", "Oued Smar", "Bachdjerrah", 
    "Hussein Dey", "Kouba", "Bordj El Kiffan", "Bab Ezzouar", "Dar El Beïda", "Reghaïa", "Aïn Taya", "Bordj El Bahri", 
    "El Marsa", "Zeralda", "Staoueli", "Draria", "Baba Hassen", "Douera", "Cheraga", "Dely Ibrahim", "Hydra"
  ],
  42: [ // Tipaza
    "Tipaza", "Kolea", "Ahmer El Ain", "Ain Tagourait", "Attatba", "Beni Mileuk", "Bou Haroun", "Bou Ismail", 
    "Bourkika", "Chaiba", "Cherchell", "Damous", "Douaouda", "Fouka", "Gouraya", "Hadjout", "Hadjret Ennous", 
    "Khemisti", "Larhat", "Menaceur", "Messelmoun", "Nador", "Sidi Amar", "Sidi Ghiles", "Sidi Rached"
  ],
  31: [ // Oran
    "Oran", "Arzew", "Bir El Djir", "Es Senia", "Gdyel", "Hassi Bounif", "Hassi Mameche", "Mers El Kebir", "Oued Tlelat", "Sidi Chami"
  ],
  25: [ // Constantine
    "Constantine", "El Khroub", "Hamma Bouziane", "Didouche Mourad", "Zighoud Youcef", "Ibn Ziad", "Beni Hamidene"
  ],
  9: [ // Blida
    "Blida", "Boufarik", "Beni Mered", "Ouled Yaich", "Chréa", "El Affroun", "Wadi Djer", "Mouzaia", "Hammami", "Bouinan", "Chebli", "Bougara"
  ]
};

// Function to get communes for a wilaya ID
export const getCommunesForWilaya = (wilayaId: number): string[] => {
  return communes[wilayaId] || ["Autre / أخرى"];
};
