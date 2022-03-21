import { nindoApp, getDefaultPlugin } from '@commonninja/nindo';

import userStateMock from './mocks/userState.mocks';
import { getEditorConfig } from './components/editor/editor.config';
import { Plugin } from './components/plugin/plugin.comp';
import { defaultPluginData } from './components/plugin/plugin.default';
import { IPluginData } from './components/plugin/plugin.types';
import { IGlobalState } from './components/plugin/plugin.state';

// Initialize Nindo app
nindoApp<IPluginData, IGlobalState>({
	editor: {
		config: getEditorConfig(),
	},
	plugin: {
		defaultData: getDefaultPlugin(defaultPluginData(), 'My App'),
		pluginComponent: Plugin,
	},
	globalState: {
		isSomethingGoingOn: true,
	},
	mocks: {
		userState: userStateMock,
	},
});
