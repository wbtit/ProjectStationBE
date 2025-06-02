import fs from 'fs';
import {SubTasks} from '../data/data.js';
import {WBSActivity} from '../data/newWbsActivityData.js';

function mapTemplateKey(SubTasks, WBSActivity) {
  return SubTasks.map((sub) => {
    const matchingWBS = WBSActivity.find((wbs) => wbs.id === sub.wbsactivityID);
    if (matchingWBS) {
      return {
        ...sub,
        parentTemplateKey: matchingWBS.templateKey,
      };
    }
    return sub;
  });
}

const updatedSubTasks = mapTemplateKey(SubTasks, WBSActivity);

// Create JS export string
const output = `const newSubTasks = ${JSON.stringify(updatedSubTasks, null, 2)};\n\nexport default newSubTasks;\n`;

// Write to newsubtaskdata.js
fs.writeFileSync('./newsubtaskdata.js', output, 'utf-8');

console.log('✅ newsubtaskdata.js file created with updated subtasks');
