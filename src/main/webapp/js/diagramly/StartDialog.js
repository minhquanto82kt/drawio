/**
 * Copyright (c) 2006-2026, JGraph Ltd
 *
 * Full-page Word/Photoshop-style start screen for draw.io.
 * Existing editor, recent, template and storage APIs are reused.
 */

var StartDialog = function(editorUi)
{
	this.editorUi = editorUi;
	this.container = document.createElement('div');
	this.container.className = 'geStartDialog';
	this.keyHandler = null;
	this.build();
};

StartDialog.prototype.build = function()
{
	var ui = this.editorUi;
	var root = this.container;

	var top = document.createElement('header');
	top.className = 'geStartTopbar';

	var brand = document.createElement('div');
	brand.className = 'geStartBrand';
	var mark = document.createElement('span');
	mark.className = 'geStartBrandMark';
	mxUtils.write(mark, '◆');
	brand.appendChild(mark);
	var brandText = document.createElement('span');
	mxUtils.write(brandText, 'draw.io');
	brand.appendChild(brandText);
	top.appendChild(brand);

	var topSearch = document.createElement('span');
	topSearch.className = 'geStartTopSearch';
	mxUtils.write(topSearch, 'Start screen');
	top.appendChild(topSearch);

	var topActions = document.createElement('div');
	topActions.className = 'geStartTopActions';

	var help = document.createElement('button');
	help.className = 'geStartTopButton';
	help.type = 'button';
	help.title = 'draw.io documentation';
	mxUtils.write(help, '?');
	mxEvent.addListener(help, 'click', function()
	{
		ui.openLink('https://www.drawio.com/doc/');
	});
	topActions.appendChild(help);

	var close = document.createElement('button');
	close.className = 'geStartTopButton geStartCloseButton';
	close.type = 'button';
	close.title = 'Open blank diagram';
	mxUtils.write(close, '×');
	mxEvent.addListener(close, mxUtils.bind(this, function()
	{
		this.createBlank();
	}));
	topActions.appendChild(close);
	top.appendChild(topActions);
	root.appendChild(top);

	var body = document.createElement('div');
	body.className = 'geStartBody';

	var sidebar = document.createElement('aside');
	sidebar.className = 'geStartSidebar';

	var sideTitle = document.createElement('div');
	sideTitle.className = 'geStartSidebarTitle';
	mxUtils.write(sideTitle, 'Workspace');
	sidebar.appendChild(sideTitle);

	var addNav = mxUtils.bind(this, function(icon, label, fn, active)
	{
		var item = document.createElement('button');
		item.type = 'button';
		item.className = 'geStartNavItem' + (active ? ' geStartNavActive' : '');
		var iconElt = document.createElement('span');
		iconElt.className = 'geStartNavIcon';
		mxUtils.write(iconElt, icon);
		item.appendChild(iconElt);
		var labelElt = document.createElement('span');
		mxUtils.write(labelElt, label);
		item.appendChild(labelElt);
		mxEvent.addListener(item, 'click', fn);
		sidebar.appendChild(item);
	});

	addNav('⌂', 'Home', function()
	{
		var main = root.querySelector('.geStartMain');
		if (main != null) main.scrollTop = 0;
	}, true);

	addNav('◷', 'Recent', function()
	{
		var elt = document.getElementById('geStartRecentSection');
		if (elt != null) elt.scrollIntoView({behavior: 'smooth', block: 'start'});
	});

	addNav('◇', 'Templates', function()
	{
		var elt = document.getElementById('geStartTemplatesSection');
		if (elt != null) elt.scrollIntoView({behavior: 'smooth', block: 'start'});
	});

	var divider = document.createElement('div');
	divider.className = 'geStartSidebarDivider';
	sidebar.appendChild(divider);

	addNav('☁', 'Google Drive', mxUtils.bind(this, function()
	{
		this.openGoogle();
	}));

	addNav('▣', 'This device', mxUtils.bind(this, function()
	{
		this.openDevice();
	}));

	var footer = document.createElement('div');
	footer.className = 'geStartSidebarFooter';
	mxUtils.write(footer, 'Diagram workspace');
	sidebar.appendChild(footer);

	body.appendChild(sidebar);

	var main = document.createElement('main');
	main.className = 'geStartMain';

	var hero = document.createElement('section');
	hero.className = 'geStartHero';

	var title = document.createElement('h1');
	mxUtils.write(title, 'Welcome to draw.io');
	hero.appendChild(title);

	var subtitle = document.createElement('p');
	mxUtils.write(subtitle, 'Create a diagram, open an existing file, or start from a template.');
	hero.appendChild(subtitle);

	var search = document.createElement('div');
	search.className = 'geStartSearch';
	var searchIcon = document.createElement('span');
	searchIcon.className = 'geStartSearchIcon';
	mxUtils.write(searchIcon, '⌕');
	search.appendChild(searchIcon);
	var searchInput = document.createElement('input');
	searchInput.type = 'text';
	searchInput.placeholder = 'Search templates and recent diagrams';
	searchInput.setAttribute('aria-label', 'Search templates and recent diagrams');
	search.appendChild(searchInput);
	hero.appendChild(search);
	main.appendChild(hero);

	var newSection = this.createSection('Start creating');
	newSection.className += ' geStartNewSection';
	var newGrid = document.createElement('div');
	newGrid.className = 'geStartActionGrid';

	var actions = [
		['＋', 'Blank diagram', 'Start with an empty canvas', 'primary', mxUtils.bind(this, this.createBlank)],
		['▣', 'Open from device', 'Use a .drawio or supported file', '', mxUtils.bind(this, this.openDevice)],
		['☁', 'Open from Google Drive', 'Continue working with Drive files', '', mxUtils.bind(this, this.openGoogle)]
	];

	for (var i = 0; i < actions.length; i++)
	{
		var card = document.createElement('button');
		card.type = 'button';
		card.className = 'geStartActionCard' + (actions[i][3] ? ' ' + actions[i][3] : '');
		card.setAttribute('data-search', actions[i][1].toLowerCase());

		var icon = document.createElement('span');
		icon.className = 'geStartActionIcon';
		mxUtils.write(icon, actions[i][0]);
		card.appendChild(icon);

		var copy = document.createElement('span');
		copy.className = 'geStartActionCopy';
		var label = document.createElement('strong');
		mxUtils.write(label, actions[i][1]);
		copy.appendChild(label);
		var desc = document.createElement('span');
		mxUtils.write(desc, actions[i][2]);
		copy.appendChild(desc);
		card.appendChild(copy);

		mxEvent.addListener(card, 'click', actions[i][4]);
		newGrid.appendChild(card);
	}

	newSection.appendChild(newGrid);
	main.appendChild(newSection);

	var suggestion = document.createElement('section');
	suggestion.className = 'geStartSuggestion';
	var suggestionIcon = document.createElement('span');
	suggestionIcon.className = 'geStartSuggestionIcon';
	mxUtils.write(suggestionIcon, '✦');
	suggestion.appendChild(suggestionIcon);
	var suggestionText = document.createElement('span');
	suggestionText.className = 'geStartSuggestionText';
	var suggestionTitle = document.createElement('strong');
	mxUtils.write(suggestionTitle, 'Not sure where to start?');
	suggestionText.appendChild(suggestionTitle);
	var suggestionDesc = document.createElement('span');
	mxUtils.write(suggestionDesc, 'Browse ready-made diagram templates below.');
	suggestionText.appendChild(suggestionDesc);
	suggestion.appendChild(suggestionText);
	main.appendChild(suggestion);

	var recentSection = this.createSection('Recent');
	recentSection.id = 'geStartRecentSection';
	var recentGrid = document.createElement('div');
	recentGrid.className = 'geStartRecentGrid';
	this.renderRecent(recentGrid);
	recentSection.appendChild(recentGrid);
	main.appendChild(recentSection);

	var templateSection = this.createSection('Templates');
	templateSection.id = 'geStartTemplatesSection';
	var templateGrid = document.createElement('div');
	templateGrid.className = 'geStartTemplateGrid';

	var templates = [
		['Flowchart', ['flowchart'], 'flow'],
		['UML', ['uml'], 'uml'],
		['Entity Relationship', ['entity', 'relationship'], 'er'],
		['Network', ['network'], 'network'],
		['Business', ['business'], 'business'],
		['Software', ['software'], 'software']
	];

	for (var j = 0; j < templates.length; j++)
	{
		(function(template)
		{
			var card = document.createElement('button');
			card.type = 'button';
			card.className = 'geStartTemplateCard';
			card.setAttribute('data-search', template[0].toLowerCase());

			var preview = document.createElement('div');
			preview.className = 'geStartTemplatePreview geStartPreview-' + template[2];

			for (var k = 1; k <= 3; k++)
			{
				var shape = document.createElement('span');
				shape.className = 'geStartMiniShape geStartMiniShape' + k;
				preview.appendChild(shape);
			}

			card.appendChild(preview);

			var label = document.createElement('div');
			label.className = 'geStartTemplateLabel';
			mxUtils.write(label, template[0]);
			card.appendChild(label);

			mxEvent.addListener(card, 'click', mxUtils.bind(this, function()
			{
				this.openTemplate(template[1]);
			}));

			templateGrid.appendChild(card);
		}).call(this, templates[j]);
	}

	templateSection.appendChild(templateGrid);
	main.appendChild(templateSection);

	body.appendChild(main);
	root.appendChild(body);

	this.keyHandler = mxUtils.bind(this, function(evt)
	{
		if (evt.keyCode == 27)
		{
			this.createBlank();
		}
	});
	mxEvent.addListener(document, 'keydown', this.keyHandler);

	mxEvent.addListener(searchInput, 'input', mxUtils.bind(this, function()
	{
		var query = String(searchInput.value || '').toLowerCase().trim();
		var cards = root.querySelectorAll('[data-search]');

		for (var n = 0; n < cards.length; n++)
		{
			var match = query.length == 0 ||
				cards[n].getAttribute('data-search').indexOf(query) >= 0;
			cards[n].style.display = match ? '' : 'none';
		}
	}));
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

StartDialog.prototype.renderRecent = function(grid)
{
	var recent = [];

	try
	{
		recent = this.editorUi.getRecent() || [];
	}
	catch (e)
	{
		recent = [];
	}

	if (recent.length == 0)
	{
		var empty = document.createElement('div');
		empty.className = 'geStartEmpty';
		mxUtils.write(empty, 'No recent diagrams yet. Open a diagram and it will appear here.');
		grid.appendChild(empty);
		return;
	}

	for (var i = 0; i < Math.min(recent.length, 6); i++)
	{
		(function(entry)
		{
			var card = document.createElement('button');
			card.type = 'button';
			card.className = 'geStartRecentCard';
			card.setAttribute('data-search', (entry.title || entry.name || 'Untitled diagram').toLowerCase());

			var preview = document.createElement('div');
			preview.className = 'geStartRecentPreview';
			for (var n = 1; n <= 3; n++)
			{
				var line = document.createElement('span');
				line.className = 'geStartPreviewLine line' + n;
				preview.appendChild(line);
			}
			card.appendChild(preview);

			var label = document.createElement('div');
			label.className = 'geStartRecentLabel';
			mxUtils.write(label, entry.title || entry.name || 'Untitled diagram');
			card.appendChild(label);

			mxEvent.addListener(card, 'click', mxUtils.bind(this, function()
			{
				this.openRecent(entry);
			}));
			grid.appendChild(card);
		}).call(this, recent[i]);
	}
};

StartDialog.prototype.openGoogle = function()
{
	this.close();
	this.editorUi.pickFile(App.MODE_GOOGLE);
};

StartDialog.prototype.openDevice = function()
{
	this.close();
	this.editorUi.pickFile(App.MODE_DEVICE);
};

StartDialog.prototype.openTemplate = function(categories)
{
	this.close();
	this.editorUi.openTemplateDialog(null, categories);
};

StartDialog.prototype.createBlank = function()
{
	var ui = this.editorUi;
	this.close();

	var prev = Editor.useLocalStorage;

	try
	{
		ui.createFile(ui.defaultFilename, null, null, null, null, null, null,
			urlParams['local'] != '1');
	}
	finally
	{
		Editor.useLocalStorage = prev;
	}
};

StartDialog.prototype.openRecent = function(entry)
{
	var ui = this.editorUi;
	this.close();

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
		ui.handleError(e);
	}
};

StartDialog.prototype.close = function()
{
	if (this.keyHandler != null)
	{
		mxEvent.removeListener(document, 'keydown', this.keyHandler);
		this.keyHandler = null;
	}

	if (this.container != null && this.container.parentNode != null)
	{
		this.container.parentNode.removeChild(this.container);
	}

	if (document.body != null)
	{
		document.body.classList.remove('geStartScreenOpen');
	}

	if (this.editorUi != null)
	{
		this.editorUi.startDialog = null;
	}
};

StartDialog.prototype.init = function()
{
	// Standalone overlay; no EditorUi dialog wrapper is required.
};

StartDialog.prototype.destroy = function()
{
	this.close();
	this.container = null;
	this.editorUi = null;
};

/**
 * Production hook: bootstrap loads this file after app.min.js.
 * This avoids rebuilding the large editor bundle just for the start screen.
 */
(function()
{
	if (typeof App !== 'function' || App.prototype == null)
	{
		return;
	}

	App.prototype.isStartScreenEnabled = function()
	{
		var hasHash = window.location.hash != null && window.location.hash.length > 1;

		return urlParams['start'] != '0' &&
			urlParams['splash'] != '0' &&
			!this.editor.chromeless &&
			urlParams['embed'] != '1' &&
			urlParams['noFileMenu'] != '1' &&
			!mxClient.IS_CHROMEAPP &&
			!EditorUi.isElectronApp &&
			!hasHash &&
			urlParams['open'] == null &&
			urlParams['create'] == null &&
			urlParams['state'] == null &&
			this.getCurrentFile() == null;
	};

	App.prototype.showStartScreen = function()
	{
		if (!this.isStartScreenEnabled())
		{
			return;
		}

		if (this.startDialog != null && this.startDialog.container != null)
		{
			return;
		}

		this.startDialog = new StartDialog(this);
		document.body.classList.add('geStartScreenOpen');
		document.body.appendChild(this.startDialog.container);
		this.startDialog.init();
	};

	var oldShowSplash = App.prototype.showSplash;

	if (oldShowSplash != null && !oldShowSplash.__startScreenWrapped)
	{
		var wrappedShowSplash = function(force)
		{
			if (this.isStartScreenEnabled())
			{
				this.showStartScreen();
				return;
			}

			return oldShowSplash.apply(this, arguments);
		};

		wrappedShowSplash.__startScreenWrapped = true;
		App.prototype.showSplash = wrappedShowSplash;
	}
})();
