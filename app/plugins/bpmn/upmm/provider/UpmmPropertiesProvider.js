import upmmId from './UpmmId';
import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500;

export default function UpmmPropertiesProvider(propertiesPanel, translate) {

    this.getGroups = function(element) {
        return function(groups) {
            if(!is(element, 'bpmn:Process')) {
                groups.push(createUpmmGroup(element, translate));
            }

            return groups;
        }
    };

    propertiesPanel.registerProvider(HIGH_PRIORITY, this);
}

UpmmPropertiesProvider.$inject = [ 'propertiesPanel', 'translate' ];

function createUpmmGroup(element, translate) {
    return {
        id: 'upmm',
        label: translate('UPMM Mapping'),
        entries: [upmmId(element)]
    }
}
