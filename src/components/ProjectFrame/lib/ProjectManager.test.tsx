import React from 'react';

import ProjectManager from './ProjectManager'

// JSON parse error
// import img_JSON from './TestData/vw_projects/img.json'
// import incomplete1_JSON from './TestData/vw_projects/incomplete1.json'
import incomplete2_JSON from './Test_Data/vw_projects/incomplete2.json'
import other_JSON from './Test_Data/vw_projects/other.json'
import project_1_JSON from './Test_Data/vw_projects/project_1.json'
import test_JSON from './Test_Data/vw_projects/test.json'


describe("open local project", () => {
    test('Test file incomplete2_JSON is a VW_Project file?', () => {
        const result = ProjectManager.isVWProjectInfo(incomplete2_JSON)
        // expect(result).toBe(false);
    });
})