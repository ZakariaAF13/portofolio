/**
 * A utility function to conditionally join class names together.
 * @param {...string} classes - Class names to be joined.
 * @returns {string} - Combined class names.
 */
export function classNames(...classes: (string | undefined | boolean | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * A utility function to merge Tailwind CSS class names with proper handling of conflicts.
 * @param {...string} classLists - Class name strings to be merged.
 * @returns {string} - Merged class names with conflicts resolved.
 */
export function mergeClasses(...classLists: (string | undefined)[]): string {
  const classSet = new Set<string>();
  const classGroups: Record<string, string> = {};
  
  // Process each class list
  classLists.forEach(classes => {
    if (!classes) return;
    
    // Split by whitespace and process each class
    classes.split(/\s+/).forEach(className => {
      if (!className) return;
      
      // Handle responsive and pseudo-class variants (e.g., 'md:text-red-500', 'hover:bg-blue-500')
      const variantMatch = className.match(/^(.*?):(.*)/);
      
      if (variantMatch) {
        const [, variant, baseClass] = variantMatch;
        // Group classes by their base class to handle conflicts
        if (!classGroups[baseClass]) {
          classGroups[baseClass] = '';
        }
        // Only keep the most specific variant for each base class
        classGroups[baseClass] = `${variant}:${baseClass}`;
      } else {
        // For non-variant classes, just add them directly
        classSet.add(className);
      }
    });
  });
  
  // Add the processed variant classes
  Object.values(classGroups).forEach(className => {
    classSet.add(className);
  });
  
  return Array.from(classSet).join(' ');
}

/**
 * A utility function to conditionally apply class names based on conditions.
 * @param {Record<string, boolean>} classMap - An object where keys are class names and values are conditions.
 * @returns {string} - Space-separated class names where the condition was true.
 */
export function classIf(classMap: Record<string, boolean>): string {
  return Object.entries(classMap)
    .filter(([_, condition]) => condition)
    .map(([className]) => className)
    .join(' ');
}
