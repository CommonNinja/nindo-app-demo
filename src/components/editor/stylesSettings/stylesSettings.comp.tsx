import React, { ChangeEvent, useState, CSSProperties } from 'react';
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
	AssetsGalleryOpener,
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
	const [activeStylesProp, setActiveStylesProp] = useState<string | null>(null);
	const { styles } = pluginData.data;

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

	function fontChanged(id: string) {
		stylePropChanged('fontId', id);
	}

	function renderAdvancedTab() {
		return (
			<>
				<ContextMenuSection title="Custom Styles">
					<FormRow>
						<FormLabel>Title</FormLabel>
						<Button
							className="customize-btn"
							color="transparent"
							onClick={() => setActiveStylesProp('title')}
						>
							Customize
						</Button>
					</FormRow>
					<FormRow>
						<FormLabel>Item</FormLabel>
						<Button
							className="customize-btn"
							color="transparent"
							onClick={() => setActiveStylesProp('item')}
						>
							Customize
						</Button>
					</FormRow>
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

	function renderCSSPropertiesEditor() {
		let availablePropertiesGroups: TAvailablePropertiesGroups = [];

		switch (activeStylesProp) {
			case 'background':
				availablePropertiesGroups = [
					{
						name: 'background',
						openedByDefault: true,
						displayName: 'Background Styles',
						cssProperties: [
							'backgroundColor',
							'backgroundSize',
							'backgroundPosition',
							'backgroundRepeat',
						],
					},
				];
				break;
			case 'title':
			case 'item':
				availablePropertiesGroups = [
					{
						name: 'typography',
						cssProperties: [
							'color',
							'fontSize',
							'textAlign',
							'fontWeight',
							'fontStyle',
							'lineHeight',
							'letterSpacing',
						],
					},
					{
						name: 'spacing',
						cssProperties: ['margin', 'padding'],
					},
				];
				break;
		}

		if (!activeStylesProp || !availablePropertiesGroups.length) {
			return <></>;
		}

		return (
			<div className="css-props-editor-wrapper">
				<Button
					className="close-css-props-editor"
					onClick={() => setActiveStylesProp(null)}
				>
					<SystemIcon size={20} type="arrow-left" />
					<span>Back</span>
				</Button>
				<CSSPropertiesEditor
					currentProperties={(styles as any)[activeStylesProp]}
					onChange={(nextProperties: CSSProperties) =>
						stylePropChanged(activeStylesProp, nextProperties)
					}
					availablePropertiesGroups={availablePropertiesGroups}
				/>
			</div>
		);
	}

	function renderBackgroundTab() {
		return (
			<>
				<ContextMenuSection
					title="Background Settings"
					className="background-settings"
				>
					<FormRow>
						<FormLabel>Image URL</FormLabel>
						<AssetsGalleryOpener
							enabled={premiumHelper.getFeatureValue('imageUploads') as boolean}
							pluginId={pluginData.guid || ''}
							submitCallback={(url) =>
								cssPropChanged(
									'background',
									'backgroundImage',
									url ? `url(${url})` : ''
								)
							}
						/>
						<input
							type="url"
							maxLength={400}
							placeholder="Enter image URL"
							value={
								styles.background.backgroundImage
									?.replace('url(', '')
									.replace(')', '') || ''
							}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								cssPropChanged(
									'background',
									'backgroundImage',
									e.target.value ? `url(${e.target.value})` : ''
								)
							}
						/>
						<Button
							className="customize-btn"
							color="transparent"
							onClick={() => setActiveStylesProp('background')}
						>
							Customize
						</Button>
					</FormRow>
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
						selectedFontId={pluginData.data.styles.fontId || 'font_open_sans'}
						updateFont={fontChanged}
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
					{
						id: 'background',
						name: 'Background',
					},
				]}
				resolveTabComp={(id) => {
					if (id === 'basic') {
						return renderBasicTab();
					}

					if (id === 'advanced') {
						return renderAdvancedTab();
					}

					return renderBackgroundTab();
				}}
			/>
			{activeStylesProp && renderCSSPropertiesEditor()}
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
