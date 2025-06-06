// This script assumes your newSubTasks.js looks something like this:
// export const newSubTasks = [ { wbsactivityID: "...", parentTemplateKey: "...", ... }, ... ];

// Replace this path with the actual path to your newSubTasks.js file
import newSubTasks  from '../data/newsubtaskdata.js'; // Adjust path as needed

function findDuplicateSubtaskTemplateKeys(subTasksData) {
    const seenCombinations = new Map(); // Key: `${wbsactivityID}-${parentTemplateKey}`, Value: Array of original indices
    const duplicatesFound = [];

    subTasksData.forEach((subtask, index) => {
        const { wbsactivityID, parentTemplateKey } = subtask;
        const uniqueKey = `${wbsactivityID}-${parentTemplateKey}`;

        if (seenCombinations.has(uniqueKey)) {
            // This combination has been seen before
            const existingIndices = seenCombinations.get(uniqueKey);
            // If this is the first time we detect a duplicate for this key,
            // add the original entry's index to the duplicates list.
            if (existingIndices.length === 1) {
                duplicatesFound.push({
                    wbsactivityID: wbsactivityID,
                    parentTemplateKey: parentTemplateKey,
                    description: subtask.description,
                    originalIndex: existingIndices[0],
                    message: `Duplicate combination found: ${uniqueKey}. Original entry at index ${existingIndices[0]}.`,
                    // Add the actual subtask data for easier debugging
                    details: subTasksData[existingIndices[0]]
                });
            }
            // Add the current duplicate entry's index
            duplicatesFound.push({
                wbsactivityID: wbsactivityID,
                parentTemplateKey: parentTemplateKey,
                description: subtask.description,
                originalIndex: index,
                message: `Duplicate combination found: ${uniqueKey}. This entry is at index ${index}.`,
                details: subtask
            });
            existingIndices.push(index); // Add current index to the list
        } else {
            seenCombinations.set(uniqueKey, [index]);
        }
    });

    return duplicatesFound;
}

// Run the check
const duplicateEntries = findDuplicateSubtaskTemplateKeys(newSubTasks);

if (duplicateEntries.length > 0) {
    console.warn('--- DUPLICATE PARENT_TEMPLATE_KEY COMBINATIONS FOUND ---');
    console.warn('These entries will cause Prisma unique constraint (P2002) errors if inserted for the same stage.');
    console.warn('You need to modify the `parentTemplateKey` for these subtasks to be unique within their `wbsactivityID` group.');
    console.warn('---------------------------------------------------------');
    duplicateEntries.forEach((duplicate, idx) => {
        console.log(`\nDuplicate Entry ${idx + 1}:`);
        console.log(`  WBS Activity ID: ${duplicate.wbsactivityID}`);
        console.log(`  Parent Template Key: ${duplicate.parentTemplateKey}`);
        console.log(`  Description: "${duplicate.description}"`);
        console.log(`  Occurred at original array index: ${duplicate.originalIndex}`);
        console.log('  Details:', JSON.stringify(duplicate.details, null, 2));
    });
    console.warn('---------------------------------------------------------');
    console.warn(`Total unique combinations with duplicates: ${new Set(duplicateEntries.map(d => `${d.wbsactivityID}-${d.parentTemplateKey}`)).size}`);
    console.warn(`Total duplicate entries reported: ${duplicateEntries.length}`);

} else {
    console.log('No duplicate `wbsactivityID`-`parentTemplateKey` combinations found in your `newSubTasks` template.');
    console.log('Your template data is consistent with the unique constraint.');
}
