import React from 'react';
import {
	FormRow,
	ContextMenuWrapper,
	FormLabel,
	usePluginData,
	AssetsGalleryOpener,
	ItemsManager,
	premiumHelper,
	RichEditor,
} from '@commonninja/nindo';

import { IPluginData, IPluginItem } from '../../plugin/plugin.types';

import './contentSettings.scss';

export const ContentSettingsComp = () => {
	const [pluginData, updateData] = usePluginData<IPluginData>();
	const { content } = pluginData.data;
	const { items } = content;

	function updateItem(itemId: string, fieldName: string, value: any) {
		const nextItems = items.map((a) => {
			if (a.id === itemId) {
				(a as any)[fieldName] = value;
			}
			return a;
		});
		updateItems(nextItems);
	}

	function updateItems(nextItems: IPluginItem[]) {
		updateData({
			content: {
				...content,
				items: nextItems,
			},
		});
	}

	function renderItemTitle(item: IPluginItem) {
		return (
			<>
				{item.image && (
					<span
						className="item-thumb"
						style={{
							backgroundImage: item.image ? `url(${item.image})` : '',
						}}
					></span>
				)}
				<span className="item-text">{item.title}</span>
			</>
		);
	}

	function renderItem(item: IPluginItem) {
		return (
			<>
				<FormRow>
					<FormLabel>Title</FormLabel>
					<input
						type="text"
						value={item.title}
						placeholder="Enter text..."
						onChange={(e) => updateItem(item.id, 'title', e.target.value)}
					/>
				</FormRow>
				<FormRow>
					<FormLabel>Image</FormLabel>
					<AssetsGalleryOpener
						enabled={premiumHelper.getFeatureValue('imageUploads') as boolean}
						submitCallback={(url: string) => {
							updateItem(item.id, 'image', url);
						}}
					/>
					<input
						type="url"
						maxLength={400}
						placeholder="Enter image URL"
						value={item.image}
						onChange={(e: any) =>
							updateItem(item.id, 'image', e.target.value)
						}
					/>
				</FormRow>
				<FormRow flow="column">
					<FormLabel>Description</FormLabel>
					<RichEditor
						html={item.description}
						onChange={(html) => {
							updateItem(item.id, 'description', html);
						}}
					/>
				</FormRow>
			</>
		);
	}

	return (
		<ContextMenuWrapper className="content-settings">
			<ItemsManager
				items={items}
				itemRenderer={renderItem}
				titleRenderer={renderItemTitle}
				addItemText={'Add Item'}
				itemsText={'items'}
				newItemGenerator={() => ({
					title: `Item ${items.length + 1}`,
					description: '',
					image: '',
				})}
				onUpdate={updateItems}
				maxItems={premiumHelper.getFeatureValue('numberOfItems') as number}
				minItems={1}
				searchFilter={(item: IPluginItem, query: string) => {
					return (
						item.title.toLowerCase().includes(query.toLowerCase()) ||
						item.description.toLowerCase().includes(query.toLowerCase())
					);
				}}
			/>
		</ContextMenuWrapper>
	);
};
