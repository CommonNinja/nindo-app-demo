import React from 'react';
import { usePluginData, usePluginState } from '@commonninja/nindo';

import { IPluginData } from './plugin.types';
import { IPluginState } from './plugin.state';

import './plugin.scss';

export const Plugin = () => {
	const [pluginData] = usePluginData<IPluginData>();
	const { styles, settings, content } = pluginData.data;
	const [pluginState, updatePluginState] = usePluginState<IPluginState>();

	return (
		<>
			{/* Title & Plugin content */}
			{settings.showTitle && <h2 style={styles.title}>{pluginData.name}</h2>}

			<div
				onClick={() => {
					updatePluginState({
						isSomethingGoingOn: !pluginState.isSomethingGoingOn,
					});
				}}
			>
				<p>
					{pluginState.isSomethingGoingOn
						? 'Something is definitely going on '
						: 'Nothing is going on '}
					with the plugin state
				</p>
			</div>

			<div className={`items-wrapper ${styles.layoutId}`}>
				{content.items.map((item) => (
					<div
						className="item"
						style={{
							flexBasis: `${styles.maxItemWidth}px`,
						}}
						key={`item_${item.id}`}
					>
						{settings.showItemImage && item.image && (
							<img style={styles.itemImage} src={item.image} alt={item.title} />
						)}
						{settings.showItemTitle && (
							<h4 style={styles.item}>{item.title}</h4>
						)}
						{settings.showItemDescription && item.description && (
							<div dangerouslySetInnerHTML={{ __html: item.description }}></div>
						)}
					</div>
				))}
			</div>
		</>
	);
};
