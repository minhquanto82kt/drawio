/**
 * Copyright (c) 2006-2026, JGraph Ltd
 *
 * Start screen shown before the editor.
 *
 * This first version intentionally does not modify the existing
 * Google Drive HomeDialog flow. It provides a safe entry point for
 * blank diagrams, recent diagrams and templates.
 */

var StartDialog = function(editorUi)
{
	this.editorUi = editorUi;
	this.container = document.createElement('div');
	this.container.className = 'geStartDialog';

	this.build();
};

StartDialog.prototype.build = function()
{
	var ui = this.editorUi;
	var container = this.container;

	var header = document.createElement('div');
	header.className = 'geStartHeader';

	var title = document.createElement('div');
	title.className = 'geStartTitle';
	mxUtils.write(title, 'draw.io');
	header.appendChild(title);

	var subtitle = document.createElement('div');
	subtitle.className = 'geStartSubtitle';
	mxUtils.write(subtitle, mxResources.get('newDiagram', null, 'Start a new diagram'));
	header.appendChild(subtitle);

	container.appendChild(header);

	var content = document.createElement('div');
	content.className = 'geStartContent';

	// New
	var newSection = this.createSection(
		mxResources.get('newDiagram', null, 'New')
	);

	var blank = this.createCard(
		'+',
		mxResources.get('blankDiagram', null, 'Blank diagram'),
		mxUtils.bind(this, function()
		{
			this.createBlank();
		})
	);

	blank.className += ' geStartBlankCard';
	newSection.appendChild(blank);
	content.appendChild(newSection);

	// Open
	var openSection = this.createSection(
		mxResources.get('open', null, 'Open')
	);

	var openGrid = document.createElement('div');
	openGrid.className = 'geStartGrid';

	var googleCard = this.createCard(
		'☁',
		mxResources.get('googleDrive', null, 'Google Drive'),
		mxUtils.bind(this, function()
		{
			ui.hideDialog();
			ui.pickFile(App.MODE_GOOGLE);
		})
	);
	openGrid.appendChild(googleCard);

	var deviceCard = this.createCard(
		'▣',
		mxResources.get('device', null, 'This device'),
		mxUtils.bind(this, function()
		{
			ui.hideDialog();
			ui.pickFile(App.MODE_DEVICE);
		})
	);
	openGrid.appendChild(deviceCard);

	openSection.appendChild(openGrid);
	content.appendChild(openSection);

	// Recent
	var recentSection = this.createSection(
		mxResources.get('recent', null, 'Recent')
	);

	var recent = [];

	try
	{
		recent = ui.getRecent() || [];
	}
	catch (e)
	{
		recent = [];
	}

	if (recent.length == 0)
	{
		var empty = document.createElement('div');
		empty.className = 'geStartEmpty';
		mxUtils.write(empty, 'No recent diagrams');
		recentSection.appendChild(empty);
	}
	else
	{
		var recentGrid = document.createElement('div');
		recentGrid.className = 'geStartGrid';

		for (var i = 0; i < Math.min(recent.length, 6); i++)
		{
			(function(entry)
			{
				var title = entry.title || entry.name || 'Untitled diagram';

				var card = this.createCard(
					'▱',
					title,
					mxUtils.bind(this, function()
					{
						this.openRecent(entry);
					})
				);

				recentGrid.appendChild(card);
			}).call(this, recent[i]);
		}

		recentSection.appendChild(recentGrid);
	}

	content.appendChild(recentSection);

	// Templates
	var templateSection = this.createSection(
		mxResources.get('templates', null, 'Templates')
	);

	var templateGrid = document.createElement('div');
	templateGrid.className = 'geStartGrid';

	var templates = [
		['Flowchart', ['flowchart']],
		['UML', ['uml']],
		['Entity Relationship', ['entity', 'relationship']],
		['Network', ['network']],
		['Business', ['business']],
		['Software', ['software']]
	];

	for (var j = 0; j < templates.length; j++)
	{
		(function(template)
		{
			var card = this.createCard(
				'◇',
				template[0],
				mxUtils.bind(this, function()
				{
					ui.openTemplateDialog(null, template[1]);
				})
			);

			templateGrid.appendChild(card);
		}).call(this, templates[j]);
	}

	templateSection.appendChild(templateGrid);
	content.appendChild(templateSection);

	container.appendChild(content);
};

StartDialog.prototype.createSection = function(title)
{
	var section = document.createElement('section');
	section.className = 'geStartSection';

	var heading = document.createElement('h2');
	heading.className = 'geStartSectionTitle';
	mxUtils.write(heading, title);
	section.appendChild(heading);

	return section;
};

StartDialog.prototype.createCard = function(icon, title, fn)
{
	var card = document.createElement('button');
	card.type = 'button';
	card.className = 'geStartCard';

	var preview = document.createElement('div');
	preview.className = 'geStartCardPreview';

	var iconElt = document.createElement('div');
	iconElt.className = 'geStartCardIcon';
	mxUtils.write(iconElt, icon);
	preview.appendChild(iconElt);

	card.appendChild(preview);

	var label = document.createElement('div');
	label.className = 'geStartCardLabel';
	mxUtils.write(label, title);
	card.appendChild(label);

	mxEvent.addListener(card, 'click', fn);

	return card;
};

StartDialog.prototype.createBlank = function()
{
	var ui = this.editorUi;

	ui.hideDialog();

	var prev = Editor.useLocalStorage;

	ui.createFile(
		ui.defaultFilename,
		null,
		null,
		null,
		null,
		null,
		null,
		urlParams['local'] != '1'
	);

	Editor.useLocalStorage = prev;
};

StartDialog.prototype.openRecent = function(entry)
{
	var ui = this.editorUi;

	ui.hideDialog();

	try
	{
		if (entry != null && entry.id != null)
		{
			ui.loadFile(entry.id);
		}
		else if (entry != null && entry.file != null)
		{
			ui.loadFile(entry.file);
		}
	}
	catch (e)
	{
		// Keep the existing editor error handling.
	}
};

StartDialog.prototype.init = function()
{
	// UI is built in the constructor.
};

StartDialog.prototype.destroy = function()
{
	if (this.container != null && this.container.parentNode != null)
	{
		this.container.parentNode.removeChild(this.container);
	}

	this.container = null;
	this.editorUi = null;
};
