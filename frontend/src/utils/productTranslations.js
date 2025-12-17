// Mapping product categories to translation keys
export const categoryTranslationMap = {
  'Nước pha chế': 'category.beverage',
  'Nước đóng chai': 'category.bottled',
  'Bánh ngọt': 'category.pastry',
};

// Mapping Vietnamese product names to product IDs (for order items)
export const productNameToIdMap = {
  'Cà phê sữa': 1,
  'Trà đào': 2,
  'Bánh ngọt': 3,
  'Nước suối': 4,
  'Cà phê đen': 5,
  'Trà sữa': 6,
  'Nước cam ép': 7,
  'Sinh tố dâu': 8,
  'Coca': 9,
  'Nước tăng lực': 10,
  'Nước trái cây': 11,
  'Sting': 12,
  'Bánh kem': 13,
  'Sandwich': 14,
  'Croissant': 15,
};

// Helper function to get translated product name
export const getTranslatedProductName = (translate, productId, originalName) => {
  if (!translate || !originalName) return originalName;
  
  try {
    if (productId) {
      let translated;
      try {
        translated = translate(`products.${productId}`);
      } catch (translateError) {
        return originalName;
      }
      // If translation exists and is different from key, use it
      if (translated && 
          translated !== `products.${productId}` && 
          translated !== undefined && 
          translated !== null &&
          typeof translated === 'string') {
        return translated;
      }
    }
    // If no productId, try to find it from name
    if (!productId && originalName) {
      const mappedId = productNameToIdMap[originalName];
      if (mappedId) {
        let translated;
        try {
          translated = translate(`products.${mappedId}`);
        } catch (translateError) {
          return originalName;
        }
        if (translated && 
            translated !== `products.${mappedId}` && 
            translated !== undefined && 
            translated !== null &&
            typeof translated === 'string') {
          return translated;
        }
      }
    }
  } catch (error) {
    // Silently return original name on any error
    return originalName;
  }
  // Otherwise, return original name
  return originalName;
};

// Helper function to get translated category
export const getTranslatedCategory = (translate, category) => {
  if (!category || !translate) return category || '';
  
  // If category is not in our map, return as-is
  if (!categoryTranslationMap[category]) {
    return category;
  }
  
  try {
    const translationKey = categoryTranslationMap[category];
    // Use try-catch to safely call translate
    let translated;
    try {
      translated = translate(`products.${translationKey}`);
    } catch (translateError) {
      // If translate throws error, return original category
      return category;
    }
    
    // Check if translation is valid (not the key itself and not undefined/null)
    if (translated && 
        translated !== `products.${translationKey}` && 
        translated !== undefined && 
        translated !== null &&
        typeof translated === 'string') {
      return translated;
    }
  } catch (error) {
    // Silently return original category on any error
    return category;
  }
  return category;
};

