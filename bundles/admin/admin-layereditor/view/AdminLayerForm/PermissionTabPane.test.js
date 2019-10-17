import React from 'react';
import { mount } from 'enzyme';
import { PermissionTabPane } from './PermissionsTabPane';
import { PermissionRow } from './PermissionTabPane/PermissionRow';

//import '../../../../../src/global';
//import '../../../layerselector2/resources/locale/en.js';

const Oskari = window.Oskari;
const locale = Oskari.getMsg.bind(null, 'PermissionTabPane')('filter');
const rolesAndPermissionTypes = {
    permissionTypes: [
        { 'name': 'VIEW_LAYER', 'id': 'VIEW_LAYER' },
        { 'name': 'VIEW_PUBLISHED','id': 'VIEW_PUBLISHED' },
        { 'name': 'PUBLISH', 'id': 'PUBLISH' },
        { 'name': 'DOWNLOAD', 'id': 'DOWNLOAD' }
    ],
    roles: [
        { 'id': 1, 'name': 'Guest' },
        { 'id': 2, 'name': 'User' },
        { 'id': 3, 'name': 'Admin' }
    ]
};
const getMessage = () => 'Not tested';

describe('<PermissionTabPane/> renders', () => {
    test('<PermissionRow/> count one greater than count of roles (First row is header)', () => {
        expect.assertions(1);
        const wrapper = mount(<PermissionTabPane getMessage={getMessage} rolesAndPermissionTypes={rolesAndPermissionTypes}/>);
        expect(wrapper.find(PermissionRow).length).toEqual(Object.keys(rolesAndPermissionTypes.roles).length + 1);
    });
});
