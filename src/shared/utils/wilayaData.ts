export interface Wilaya {
  id: number;
  name: string;
  nameAr: string;
  homeFee: number;
  officeFee: number;
}

export const wilayas: Wilaya[] = [
  { id: 1, name: "Adrar", nameAr: "أدرار", homeFee: 1400, officeFee: 900 },
  { id: 2, name: "Chlef", nameAr: "الشلف", homeFee: 750, officeFee: 450 },
  { id: 3, name: "Laghouat", nameAr: "الأغواط", homeFee: 950, officeFee: 600 },
  { id: 4, name: "Oum El Bouaghi", nameAr: "أم البواقي", homeFee: 800, officeFee: 450 },
  { id: 5, name: "Batna", nameAr: "باتنة", homeFee: 800, officeFee: 450 },
  { id: 6, name: "Bejaia", nameAr: "بجاية", homeFee: 800, officeFee: 450 },
  { id: 7, name: "Biskra", nameAr: "بسكرة", homeFee: 950, officeFee: 600 },
  { id: 8, name: "Bechar", nameAr: "بشار", homeFee: 1100, officeFee: 650 },
  { id: 9, name: "Blida", nameAr: "البليدة", homeFee: 750, officeFee: 450 },
  { id: 10, name: "Bouira", nameAr: "البويرة", homeFee: 750, officeFee: 450 },
  { id: 11, name: "Tamanrasset", nameAr: "تمنراست", homeFee: 1600, officeFee: 1050 },
  { id: 12, name: "Tebessa", nameAr: "تبسة", homeFee: 850, officeFee: 450 },
  { id: 13, name: "Tlemcen", nameAr: "تلمسان", homeFee: 850, officeFee: 500 },
  { id: 14, name: "Tiaret", nameAr: "تيارت", homeFee: 800, officeFee: 450 },
  { id: 15, name: "Tizi Ouzou", nameAr: "تيزي وزو", homeFee: 750, officeFee: 450 },
  { id: 16, name: "Alger", nameAr: "الجزائر", homeFee: 500, officeFee: 350 },
  { id: 17, name: "Djelfa", nameAr: "الجلفة", homeFee: 950, officeFee: 600 },
  { id: 18, name: "Jijel", nameAr: "جيجل", homeFee: 800, officeFee: 450 },
  { id: 19, name: "Setif", nameAr: "سطيف", homeFee: 750, officeFee: 450 },
  { id: 20, name: "Saida", nameAr: "سعيدة", homeFee: 800, officeFee: 500 },
  { id: 21, name: "Skikda", nameAr: "سكيكدة", homeFee: 800, officeFee: 450 },
  { id: 22, name: "Sidi Bel Abbes", nameAr: "سيدي بلعباس", homeFee: 800, officeFee: 450 },
  { id: 23, name: "Annaba", nameAr: "عنابة", homeFee: 800, officeFee: 450 },
  { id: 24, name: "Guelma", nameAr: "قالمة", homeFee: 800, officeFee: 450 },
  { id: 25, name: "Constantine", nameAr: "قسنطينة", homeFee: 800, officeFee: 450 },
  { id: 26, name: "Medea", nameAr: "المدية", homeFee: 750, officeFee: 450 },
  { id: 27, name: "Mostaganem", nameAr: "مستغانم", homeFee: 800, officeFee: 450 },
  { id: 28, name: "MSila", nameAr: "المسيلة", homeFee: 850, officeFee: 500 },
  { id: 29, name: "Mascara", nameAr: "معسكر", homeFee: 800, officeFee: 450 },
  { id: 30, name: "Ouargla", nameAr: "ورقلة", homeFee: 950, officeFee: 600 },
  { id: 31, name: "Oran", nameAr: "وهران", homeFee: 800, officeFee: 450 },
  { id: 32, name: "El Bayadh", nameAr: "البيض", homeFee: 1100, officeFee: 600 },
  { id: 33, name: "Illizi", nameAr: "إليزي", homeFee: 1600, officeFee: 1120 }, // Based on Salah trend
  { id: 34, name: "Bordj Bou Arreridj", nameAr: "برج بوعريريج", homeFee: 750, officeFee: 450 },
  { id: 35, name: "Boumerdes", nameAr: "بومرداس", homeFee: 750, officeFee: 450 },
  { id: 36, name: "El Tarf", nameAr: "الطارف", homeFee: 800, officeFee: 450 },
  { id: 37, name: "Tindouf", nameAr: "تندوف", homeFee: 1600, officeFee: 1120 },
  { id: 38, name: "Tissemsilt", nameAr: "تيسمسيلت", homeFee: 800, officeFee: 520 },
  { id: 39, name: "El Oued", nameAr: "الوادي", homeFee: 950, officeFee: 600 },
  { id: 40, name: "Khenchela", nameAr: "خنشلة", homeFee: 800, officeFee: 450 },
  { id: 41, name: "Souk Ahras", nameAr: "سوق أهراس", homeFee: 800, officeFee: 450 },
  { id: 42, name: "Tipaza", nameAr: "تيبازة", homeFee: 500, officeFee: 350 }, // Based on Alger proximity or user hint
  { id: 43, name: "Mila", nameAr: "ميلة", homeFee: 800, officeFee: 450 },
  { id: 44, name: "Ain Defla", nameAr: "عين الدفلى", homeFee: 750, officeFee: 450 },
  { id: 45, name: "Naama", nameAr: "النعامة", homeFee: 1100, officeFee: 600 },
  { id: 46, name: "Ain Temouchent", nameAr: "عين تموشنت", homeFee: 800, officeFee: 450 },
  { id: 47, name: "Ghardaia", nameAr: "غرداية", homeFee: 950, officeFee: 600 },
  { id: 48, name: "Relizane", nameAr: "غليزان", homeFee: 800, officeFee: 450 },
  { id: 49, name: "Timimoun", nameAr: "تيميمون", homeFee: 1400, officeFee: 900 },
  { id: 50, name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار", homeFee: 1600, officeFee: 1120 },
  { id: 51, name: "Oueled Djellal", nameAr: "أولاد جلال", homeFee: 950, officeFee: 600 },
  { id: 52, name: "Beni Abbes", nameAr: "بني عباس", homeFee: 1200, officeFee: 900 },
  { id: 53, name: "In Salah", nameAr: "عين صالح", homeFee: 1600, officeFee: 1120 },
  { id: 54, name: "In Guezzam", nameAr: "عين قزام", homeFee: 1600, officeFee: 0 },
  { id: 55, name: "Touggourt", nameAr: "توقرت", homeFee: 950, officeFee: 600 },
  { id: 56, name: "Djanet", nameAr: "جانت", homeFee: 1600, officeFee: 1120 },
  { id: 57, name: "El Meghiaer", nameAr: "المغير", homeFee: 950, officeFee: 0 },
  { id: 58, name: "El Menia", nameAr: "المنيعة", homeFee: 1000, officeFee: 670 }
];
