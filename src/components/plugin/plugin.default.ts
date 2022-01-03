import { v4 as uuidv4 } from 'uuid';

import { IPluginData } from './plugin.types';

export const defaultPluginData = (): IPluginData => ({
	settings: {
		showTitle: true,
		showDescription: true,
		showItemImage: true,
		showItemTitle: true,
		showItemDescription: true,
	},
	styles: {
		maxItemWidth: 200,
		background: {},
		title: {},
		description: {},
		item: {},
		itemImage: {},
		itemTitle: {},
		fontId: 'default',
		layoutId: 'default',
		customCSS: '',
	},
	content: {
		items: [
			{
				id: uuidv4(),
				title: 'Item 1',
				description: '',
				image:
					'https://uploads.commoninja.com/others/1621417802723_IMG_2236.jpg',
			},
			{
				id: uuidv4(),
				title: 'Item 2',
				description: '',
				image:
					'https://uploads.commoninja.com/others/1615115540814_store.png',
			},
			{
				id: uuidv4(),
				title: 'Item 3',
				description: '',
				image:
					'https://uploads.commoninja.com/others/1621412224873_pexels-castorly-stock-3682293.jpg',
			},
		],
	},
});
