import React, { useState, CSSProperties } from 'react';
import loadable from '@loadable/component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import {
	premiumHelper,
	PremiumOpener,
	Tabs,
	Button,
	SystemIcon,
	Popup,
	FormRow,
	ContextMenuWrapper,
	ContextMenuSection,
	Loader,
	CSSPropertiesEditor,
	TAvailablePropertiesGroups,
	FormLabel,
	FontFamilySelector,
	usePluginData,
	ColorPicker,
	SkinPicker,
	NinjaSlider,
	ISkin,
	NoCodeCSSProps,
} from '@commonninja/nindo';

import { IPluginData } from '../../plugin/plugin.types';
import { Plugin } from '../../plugin/plugin.comp';

import './stylesSettings.scss';

const skins: ISkin<{
	item: CSSProperties;
	itemTitle: CSSProperties;
	itemImage?: CSSProperties;
}>[] = [
	{
		name: 'Default',
		skinStyles: {
			item: {
				color: '',
			},
			itemTitle: {
				color: '',
			},
			itemImage: {},
		},
	},
	{
		name: 'Blue',
		color: 'blue',
		skinStyles: {
			item: {
				color: 'blue',
			},
			itemTitle: {
				color: 'blue',
				backgroundColor: '#f000f0',
			},
			itemImage: {
				padding: '5px',
				borderRadius: '20px',
			},
		},
	},
	{
		name: 'Red',
		color: '#cb0303',
		isPremium: true,
		skinStyles: {
			item: {
				color: '#cb0303',
				backgroundColor: 'yellow',
			},
			itemTitle: {
				color: '#cb0303',
				backgroundColor: 'yellow',
				fontSize: '20px',
			},
			itemImage: {
				padding: '20px',
			},
		},
	},
];

const CustomCSSEditor = loadable(() => import('@commonninja/nindo'), {
	resolveComponent: (module) => module['CustomCSSEditor'],
	fallback: <Loader />,
});

const defaultCSS = `#plugin-wrapper {

}`;

export const StylesSettingsComp = () => {
	const [pluginData, updateData] = usePluginData<IPluginData>();
	const [cssPopupOpened, setCssPopupOpened] = useState<boolean>(false);
	const { styles } = pluginData;

	function stylePropChanged(propName: string, value: any) {
		updateData({
			styles: {
				...styles,
				[propName]: value,
			},
		});
	}

	function cssPropChanged(stylesProp: string, cssPropName: string, value: any) {
		stylePropChanged(stylesProp, {
			...(styles as any)[stylesProp],
			[cssPropName]: value,
		});
	}

	function onCustomCSSChange(newValue: string) {
		stylePropChanged('customCSS', newValue);
	}

	function renderAdvancedTab() {
		return (
			<>
				<ContextMenuSection title="Custom Styles">
					<NoCodeCSSProps
						items={[
							{
								propName: 'mainWrapper',
								label: 'Main Box',
								value: styles.mainWrapper,
							},
							{
								propName: 'title',
								label: 'Main Title',
								value: styles.title,
							},
							{
								propName: 'item',
								label: 'Item Box',
								value: styles.item,
							},
						]}
						onChange={(propName, value) => stylePropChanged(propName, value)}
					/>
				</ContextMenuSection>
				<ContextMenuSection title="Custom CSS" className="center">
					{premiumHelper.getFeatureValue('customCSS') ? (
						<div className="custom-css-button">
							<button
								className="button major"
								onClick={() => setCssPopupOpened(true)}
							>
								Click to Edit
							</button>
						</div>
					) : (
						<p style={{ margin: 0 }}>
							<FontAwesomeIcon
								icon={faStar}
								title="Premium Feature"
								style={{ marginRight: 5 }}
							/>
							This feature is available for premium members only.{' '}
							<PremiumOpener>Upgrade Now!</PremiumOpener>
						</p>
					)}
				</ContextMenuSection>
			</>
		);
	}

	function renderBasicTab() {
		return (
			<>
				<ContextMenuSection title="Layout">
					<FormRow>
						<FormLabel>Layout</FormLabel>
						<select
							value={styles.layoutId || 'default'}
							onChange={(e) => {
								stylePropChanged('layoutId', e.target.value);
							}}
						>
							<option value="default">Default</option>
							<option value="circles">Circles</option>
						</select>
					</FormRow>
					<FormRow>
						<FormLabel>Item Width</FormLabel>
						<NinjaSlider
							max={450}
							min={10}
							onChange={(num) => {
								stylePropChanged('maxItemWidth', num);
							}}
							step={5}
							theme="dark"
							value={styles.maxItemWidth}
						/>
						<span>px</span>
					</FormRow>
				</ContextMenuSection>
				<ContextMenuSection title="Skin">
					<SkinPicker
						premiumSkinsAvailable={true}
						skins={skins}
						onSelect={(skinStyles: any) => {
							updateData({
								styles: {
									...styles,
									...skinStyles,
								},
							});
						}}
					/>
				</ContextMenuSection>
				<ContextMenuSection title="Colors">
					<FormRow>
						<FormLabel>Item Background</FormLabel>
						<ColorPicker
							onChange={(color: any) => {
								cssPropChanged('item', 'backgroundColor', color || '');
							}}
							showUndo={true}
							selectedColor={styles.item.backgroundColor || ''}
							colorFormat="hex"
						/>
					</FormRow>
					<FormRow>
						<FormLabel>Item Text</FormLabel>
						<ColorPicker
							onChange={(color: any) => {
								cssPropChanged('item', 'color', color?.hex || '');
							}}
							showUndo={true}
							selectedColor={styles.item.color || ''}
							colorFormat="hex"
						/>
					</FormRow>
				</ContextMenuSection>
				<ContextMenuSection title="Font">
					<FontFamilySelector
						selectedFontId={styles.fontId || 'font_open_sans'}
						updateFont={(fontId: string) => stylePropChanged('fontId', fontId)}
					/>
				</ContextMenuSection>
			</>
		);
	}

	return (
		<ContextMenuWrapper className="styles-settings">
			<Tabs
				items={[
					{
						id: 'basic',
						name: 'Basic',
					},
					{
						id: 'advanced',
						name: 'Advanced',
					},
				]}
				resolveTabComp={(id) => {
					if (id === 'advanced') {
						return renderAdvancedTab();
					}

					return renderBasicTab();
				}}
			/>
			{cssPopupOpened && (
				<Popup
					show={cssPopupOpened}
					closeCallback={() => setCssPopupOpened(false)}
					className="custom-css-popup"
				>
					<CustomCSSEditor
						css={styles.customCSS}
						defaultStyles={defaultCSS}
						onUpdate={(newStyles) => {
							onCustomCSSChange(newStyles);
							setCssPopupOpened(false);
						}}
						pluginComp={Plugin}
					/>
				</Popup>
			)}
		</ContextMenuWrapper>
	);
};
