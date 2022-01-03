import { CSSProperties } from 'react';

export interface IPluginData {
	content: IPluginContent;
	settings: IPluginSettings;
	styles: IPluginStyles;
}

export interface IPluginContent {
	items: IPluginItem[];
}

export interface IPluginItem {
	id: string;
	title: string;
	description: string;
	image: string;
}

export interface IPluginSettings {
	showTitle: boolean;
	showDescription: boolean;
	showItemTitle: boolean;
	showItemDescription: boolean;
	showItemImage: boolean;
}

export interface IPluginStyles {
	background: CSSProperties;
	title: CSSProperties;
	description: CSSProperties;
	item: CSSProperties;
	itemTitle: CSSProperties;
	itemImage: CSSProperties;
	maxItemWidth: number;
	layoutId: 'default';
	fontId: string;
	customCSS: string;
}
