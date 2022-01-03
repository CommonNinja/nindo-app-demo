import React, { useEffect } from 'react';
import {
	premiumHelper,
	Toggler,
	FormRow,
	PremiumOpener,
	ContextMenuWrapper,
	ContextMenuSection,
	NameFieldEditor,
	PrivacySelector,
	FormLabel,
	notificationHelper,
	usePluginData,
	Tooltip,
} from '@commonninja/nindo';

import { IPluginData } from '../../plugin/plugin.types';

import './pluginSettings.scss';

export const PluginSettingsComp = () => {
	const [pluginData, updateData] = usePluginData<IPluginData>();
	const { settings } = pluginData.data;
	let firstInput: HTMLInputElement | null = null;

	function setSettingField(settingName: string, value: any) {
		if (
			typeof premiumHelper.planFeatures[settingName] !== 'undefined' &&
			!premiumHelper.getFeatureValue(settingName)
		) {
			notificationHelper.removeAll();
			notificationHelper.warning({
				title: '✭ Premium Feature',
				message: "Your current plan doesn't support this premium feature. ",
				children: <PremiumOpener> Upgrade your account now!</PremiumOpener>,
				position: 'tc',
				autoDismiss: 4,
			});
			return;
		}

		updateData({
			settings: {
				...settings,
				[settingName]: value,
			},
		});
	}

	useEffect(() => {
		if (firstInput) {
			firstInput.focus();
			firstInput.selectionStart = firstInput.value.length;
			firstInput.selectionEnd = firstInput.value.length;
		}
	}, [firstInput]);

	return (
		<ContextMenuWrapper className="plugin-settings">
			<ContextMenuSection title="General Settings">
				<NameFieldEditor currentValue={pluginData.name} />
				<PrivacySelector currentValue={pluginData.privacy} />
			</ContextMenuSection>
			<ContextMenuSection title="Visibility">
				<FormRow>
					<FormLabel>
						Show Title
						<Tooltip
							content="Use tooltips to elaborate more on specific features"
							direction="right"
						/>
					</FormLabel>
					<Toggler
						isChecked={settings.showTitle}
						onChange={(e: any, value: boolean) =>
							setSettingField('showTitle', value)
						}
					/>
				</FormRow>
				<FormRow>
					<FormLabel>Show Item Title</FormLabel>
					<Toggler
						isChecked={settings.showItemTitle}
						onChange={(e: any, value: boolean) =>
							setSettingField('showItemTitle', value)
						}
					/>
				</FormRow>
				<FormRow>
					<FormLabel>Show Item Description</FormLabel>
					<Toggler
						isChecked={settings.showItemDescription}
						onChange={(e: any, value: boolean) =>
							setSettingField('showItemDescription', value)
						}
					/>
				</FormRow>
				<FormRow>
					<FormLabel>Show Item Image</FormLabel>
					<Toggler
						isChecked={settings.showItemImage}
						onChange={(e: any, value: boolean) =>
							setSettingField('showItemImage', value)
						}
					/>
				</FormRow>
			</ContextMenuSection>
		</ContextMenuWrapper>
	);
};
