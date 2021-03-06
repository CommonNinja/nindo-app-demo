import React from 'react';
import { usePlugin, usePluginData, useGlobalState } from '@commonninja/nindo';

import { IPluginData } from './plugin.types';
import { IGlobalState } from './plugin.state';

import './plugin.scss';

export const Plugin = () => {
	const plugin = usePlugin<IPluginData>();
	const [pluginData] = usePluginData<IPluginData>();
	const { styles, settings, content } = pluginData;
	const [globalState, updateGlobalState] = useGlobalState<IGlobalState>();

	return (
		<>
			{/* Title & Plugin content */}
			{settings.showTitle && <h2 style={styles.title}>{plugin.name}</h2>}

			<div
				onClick={() => {
					updateGlobalState({
						isSomethingGoingOn: !globalState.isSomethingGoingOn,
					});
				}}
			>
				<p>
					{globalState.isSomethingGoingOn
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
