import { PanelConfiguration } from '@/types';

// Sample panel configurations for different product types
export const PANEL_CONFIGURATIONS: Record<string, PanelConfiguration> = {
	// Bifold - 4 equal panels
	bifold: {
		totalPanels: 4,
		orientation: 'landscape',
		panels: [
			{
				panelNumber: 1,
				width: 800,
				height: 300,
				label: 'Front Cover',
				printSpecs: {
					marginSize: 150,
					gutterSize: 150,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 2,
				width: 800,
				height: 300,
				label: 'Inside Left',
				printSpecs: {
					marginSize: 150,
					gutterSize: 150,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 3,
				width: 800,
				height: 300,
				label: 'Inside Right',
				printSpecs: {
					marginSize: 150,
					gutterSize: 150,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 4,
				width: 800,
				height: 300,
				label: 'Back Cover',
				printSpecs: {
					marginSize: 150,
					gutterSize: 150,
					bleedSize: 75,
					safeZone: 50,
				},
			},
		],
	},

	// Trifold - 6 panels with varying widths
	trifold: {
		totalPanels: 6,
		orientation: 'landscape',
		panels: [
			{
				panelNumber: 1,
				width: 600,
				height: 400,
				label: 'Front Cover',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 2,
				width: 500,
				height: 400,
				label: 'Inside Left',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 3,
				width: 700,
				height: 400,
				label: 'Center Panel',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 4,
				width: 500,
				height: 400,
				label: 'Inside Right',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 5,
				width: 600,
				height: 400,
				label: 'Back Left',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 6,
				width: 600,
				height: 400,
				label: 'Back Right',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
		],
	},
    

	// Single panel (default)
	single: {
		totalPanels: 1,
		orientation: 'portrait',
		panels: [
			{
				panelNumber: 1,
				width: 800,
				height: 1200,
				label: 'Single Panel',
				printSpecs: {
					marginSize: 150,
					gutterSize: 0,
					bleedSize: 75,
					safeZone: 50,
				},
			},
		],
	},

	// Booklet - 8 panels (4 pages, 2 sides each)
	booklet: {
		totalPanels: 8,
		orientation: 'portrait',
		panels: [
			{
				panelNumber: 1,
				width: 600,
				height: 800,
				label: 'Cover',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 2,
				width: 600,
				height: 800,
				label: 'Page 1',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 3,
				width: 600,
				height: 800,
				label: 'Page 2',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 4,
				width: 600,
				height: 800,
				label: 'Page 3',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 5,
				width: 600,
				height: 800,
				label: 'Page 4',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 6,
				width: 600,
				height: 800,
				label: 'Page 5',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 7,
				width: 600,
				height: 800,
				label: 'Page 6',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
			{
				panelNumber: 8,
				width: 600,
				height: 800,
				label: 'Back Cover',
				printSpecs: {
					marginSize: 150,
					gutterSize: 100,
					bleedSize: 75,
					safeZone: 50,
				},
			},
		],
	},
};

// Helper function to get panel configuration by name
export function getPanelConfiguration(type: string): PanelConfiguration {
	return PANEL_CONFIGURATIONS[type] || PANEL_CONFIGURATIONS.single;
}

// Helper function to get all available panel types
export function getAvailablePanelTypes(): string[] {
	return Object.keys(PANEL_CONFIGURATIONS);
}
