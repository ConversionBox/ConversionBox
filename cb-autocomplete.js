// Define the interval ID
let cbAutoCompleteIntervalId, autoCompleteDebounceTimer, searchConfigAutoComplete, channelId;
const generateUUID = window.uuidv4;

const cbMobileRendered = new CustomEvent('cbMobileRendered')

var searchThree = {
	container: null,
	outerDiv: document.createElement("div"),
	formObj: document.createElement("form"),
	inputWrapperPrefix: document.createElement("div"),
	submitButton: document.createElement("button"),
	searchLabel: document.createElement("label"),
	loadingIndicator: document.createElement("div"),
	inputWrapper: document.createElement("div"),
	inputObj: document.createElement("input"),
	inputWrapperSuffix: document.createElement("div"),
	clearButton: document.createElement("button"),
	searchResultPanel: document.createElement("div"),
	searchResultPanelLayout: document.createElement("div"),
	searchResultPanelSections: document.createElement("div"),
	searchResultPanelSectionLeft: document.createElement("div"),
	searchResultPanelSectionRight: document.createElement("div"),
	collectionSectionWrapper: document.createElement("section"),
	productSectionWrapper: document.createElement("section"),
	collectionsList: document.createElement("ul"),
	productsList: document.createElement("ul"),
	querySuggesstionList: document.createElement("ul"),
	pagesList: document.createElement("ul"),
	blogList: document.createElement("ul"),
	viewAllItemsList: document.createElement("ul"),
	formMobileObj: document.createElement("form"),
	inputWrapperMobilePrefix: document.createElement("div"),
	submitMobileButton: document.createElement("button"),
	searchMobileLabel: document.createElement("label"),
	loadingMobileIndicator: document.createElement("div"),
	inputMobileWrapper: document.createElement("div"),
	inputMobileObj: document.createElement("input"),
	inputWrapperMobileSuffix: document.createElement("div"),
	searchMobileFromWrapper: document.createElement("div"),
	searchMobileFormCloseBtn: document.createElement("button"),
	clearMobileButton: document.createElement("button"),
	currentContainer: null,
	previousValue: null,
	typeSenseClient: null,
	currentQueryId: null,
	sessionID: null,
	uniqueId: null,
	analyticsURL: null, //"https://backend.conversionbox.io",
	autoCompleteDebounceTimer: null,
	analyticsAutoCompleteDebounceTime: null,
	currencyObj: null,
	searchQueryIndex: [],
	fullWidth: true,

	init: async () => {
		let autoCompleteConfig = searchConfigAutoComplete,
			indexConfig = window.conversionBoxSearch.config.indexConfig
		searchThree.uniqueId = window.conversionBoxSearch.config.unique_id
		searchThree.analyticsURL	= window.conversionBoxSearch.config.analyticsURL
		searchThree.getSessionID()
		let currencyId					= typeof window.conversionBoxSearch.currency_id !== "undefined" ? parseInt(window.conversionBoxSearch.currency_id) : null,
			defaultCurrencyConfig	=	{
													isDefault: true,
													rate: 1,
													decimals: 0,
													decimalSeparator: ".",
													thousandsSeparator: ",",
													symbol: "$",
													location: "left"
												},
			currencies					= typeof window.conversionBoxSearch.config.currencies !== "undefined" ? window.conversionBoxSearch.config.currencies : null
		if( currencyId !== null && currencies !== null && typeof currencies[currencyId] !== "undefined" ){
			searchThree.currencyObj	= currencies[currencyId]
		}else{
			searchThree.currencyObj	= defaultCurrencyConfig
		}
		if (autoCompleteConfig.status && (indexConfig.index_collections == "true" || indexConfig.index_products == "true")) {
			let data = await searchThree.createTypeSenseClient()
			if (data) {
				if (window.conversionBoxSearch.config.CSSURL) {
					await searchThree.addLinkToHead(window.conversionBoxSearch.config.CSSURL)
					if( window.conversionBoxSearch.config.APPURL ){
						searchThree.addLinkToHead(window.conversionBoxSearch.config.APPURL+"/api/css/autocomplete/"+searchThree.uniqueId)
					}
				}
				searchThree.replaceSearchBar()
			}
		}
	},

	// Function to retrieve the session ID
	getSessionID: async () => {
		let cookieID = await searchThree.getCookie('_conversion_box_track_id'),
			storageId = localStorage.getItem('_conversion_box_track_id');
		if (!cookieID && storageId) {
			searchThree.sessionID = storageId
			searchThree.setCookie("_conversion_box_track_id", storageId)
		} else if (!storageId && cookieID) {
			searchThree.sessionID = cookieID
			searchThree.setLocalStorage("_conversion_box_track_id", cookieID)
		} else if (!cookieID && !storageId) {
			searchThree.sessionID = generateUUID()
			searchThree.setCookie("_conversion_box_track_id", searchThree.sessionID)
			searchThree.setLocalStorage("_conversion_box_track_id", searchThree.sessionID)
		} else {
			searchThree.sessionID = cookieID
		}
	},

	setCookie: async (cookieKey, cookieValue) => {
		// Set the session ID in a cookie with a longer expiration time (e.g., 30 days)
		document.cookie = `${cookieKey}=${cookieValue}; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
	},

	setLocalStorage: async (storageKey, storageValue) => {
		// Store the session ID in local storage for persistence
		localStorage.setItem(storageKey, storageValue);
	},

	getCookie: async (name) => {
		const cookies = document.cookie.split('; ');
		for (const cookie of cookies) {
			const [cookieName, cookieValue] = cookie.split('=');
			if (cookieName === name) {
				return cookieValue;
			}
		}
		return null;
	},

	createTypeSenseClient: async () => {
		let config = window.conversionBoxSearch.config.searchConfig
		searchThree.typeSenseClient = new Typesense.Client({
			nodes: [
				{
					host: config.host,
					port: config.port,
					protocol: config.protocol,
				},
			],
			apiKey: config.searchAPIKey,
			connectionTimeoutSeconds: 60000
		});
		return true
	},

	replaceSearchBar: async () => {
		let querySelector = "#quickSearch";
		if (searchConfigAutoComplete.desktopCssSelector) {
			querySelector = searchConfigAutoComplete.desktopCssSelector
		}
		searchThree.container = document.querySelectorAll(querySelector)
		if (searchThree.container) {
			for (let i = 0; i < searchThree.container.length; i++) {
				let currentContainer = searchThree.container[i];
				if (currentContainer.parentNode.classList.contains("search-modal__form")) {
					currentContainer.parentNode.classList.add("searchThreePredictiveSearch")
				}
				currentContainer.classList.add("searchMainContainer")
				currentContainer.innerHTML = '';
				let outerDiv = document.createElement("div"),
					formObj = document.createElement("form"),
					inputWrapperPrefix = document.createElement("div"),
					submitButton = document.createElement("button"),
					searchLabel = document.createElement("label"),
					loadingIndicator = document.createElement("div"),
					inputWrapper = document.createElement("div"),
					inputObj = document.createElement("input"),
					inputWrapperSuffix = document.createElement("div"),
					clearButton = document.createElement("button")
				outerDiv.classList.add("searchAutoComplete")
				formObj.classList.add("searchForm")
				inputWrapperPrefix.classList.add("searchInputWrapperPrefix")
				submitButton.classList.add("searchSubmitButton")
				submitButton.setAttribute("type", "submit")
				submitButton.setAttribute("title", "Submit")
				searchLabel.classList.add("searchLabel")
				searchLabel.setAttribute("for", "searchInput")
				searchLabel.setAttribute("id", "searchInputLabel")
				loadingIndicator.classList.add("searchLoadingIndicator")
				loadingIndicator.setAttribute("hidden", "")
				inputWrapper.classList.add("searchInputWrapper")
				inputObj.classList.add("searchInput")
				inputObj.setAttribute("id", "searchInput")
				inputObj.setAttribute("autocomplete", "off")
				inputObj.setAttribute("autocorrect", "off")
				inputObj.setAttribute("autocapitalize", "off")
				inputObj.setAttribute("enterkeyhint", "search")
				inputObj.setAttribute("spellcheck", "false")
				inputObj.setAttribute("placeholder", "")
				inputObj.setAttribute("maxlength", "512")
				inputObj.setAttribute("placeholder", "Search")
				inputObj.setAttribute("type", "text")
				inputWrapperSuffix.classList.add("searchInputWrapperSuffix")
				clearButton.classList.add("searchClearButton")
				clearButton.setAttribute("hidden", "")
				clearButton.setAttribute("title", "Clear")
				clearButton.setAttribute("type", "reset")
				inputWrapperSuffix.appendChild(clearButton)
				inputWrapper.appendChild(inputObj)
				searchLabel.appendChild(submitButton)
				inputWrapperPrefix.appendChild(searchLabel)
				inputWrapperPrefix.appendChild(loadingIndicator)
				formObj.append(inputWrapperPrefix)
				formObj.append(inputWrapper)
				formObj.append(inputWrapperSuffix)
				outerDiv.appendChild(formObj)
				clearButton.innerHTML = `<svg class="searchClearIcon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>`
				submitButton.innerHTML = `<svg class="searchSubmitIcon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>`
				loadingIndicator.innerHTML = `<svg class="searchLoadingIcon" viewBox="0 0 100 100" width="20" height="20"><circle cx="50" cy="50" fill="none" r="35" stroke="currentColor" stroke-dasharray="164.93361431346415 56.97787143782138" stroke-width="6"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;90 50 50;180 50 50;360 50 50" keyTimes="0;0.40;0.65;1"></animateTransform></circle></svg>`
				currentContainer.appendChild(outerDiv)
				inputObj.addEventListener("keyup", searchThree.searchElement)
				//inputObj.addEventListener("blur", searchThree.inputBlurEvent)
				inputObj.addEventListener("focus", searchThree.inputFocusEvent)
				clearButton.addEventListener("click", searchThree.resetSearchValue)
				formObj.addEventListener("submit", searchThree.searchFormSubmit)
			}
		}
		if (searchConfigAutoComplete.mobileCssSelector) {
			querySelector = searchConfigAutoComplete.mobileCssSelector
			searchThree.container = document.querySelectorAll(querySelector)
			if (searchThree.container) {
				for (let i = 0; i < searchThree.container.length; i++) {
					let currentContainer = searchThree.container[i];
					currentContainer.classList.add("searchMainContainer")
					currentContainer.innerHTML = '';
					let outerDiv = document.createElement("div"),
						formObj = document.createElement("form"),
						inputWrapperPrefix = document.createElement("div"),
						submitButton = document.createElement("button"),
						searchLabel = document.createElement("label"),
						loadingIndicator = document.createElement("div"),
						inputWrapper = document.createElement("div"),
						inputObj = document.createElement("input"),
						inputWrapperSuffix = document.createElement("div"),
						clearButton = document.createElement("button")
					outerDiv.classList.add("searchAutoComplete")
					formObj.classList.add("searchForm")
					inputWrapperPrefix.classList.add("searchInputWrapperPrefix")
					submitButton.classList.add("searchSubmitButton")
					submitButton.setAttribute("type", "submit")
					submitButton.setAttribute("title", "Submit")
					searchLabel.classList.add("searchLabel")
					searchLabel.setAttribute("for", "searchInput")
					searchLabel.setAttribute("id", "searchInputLabel")
					loadingIndicator.classList.add("searchLoadingIndicator")
					loadingIndicator.setAttribute("hidden", "")
					inputWrapper.classList.add("searchInputWrapper")
					inputObj.classList.add("searchInput")
					inputObj.setAttribute("id", "searchInput")
					inputObj.setAttribute("autocomplete", "off")
					inputObj.setAttribute("autocorrect", "off")
					inputObj.setAttribute("autocapitalize", "off")
					inputObj.setAttribute("enterkeyhint", "search")
					inputObj.setAttribute("spellcheck", "false")
					inputObj.setAttribute("placeholder", "")
					inputObj.setAttribute("maxlength", "512")
					inputObj.setAttribute("type", "text")
					inputObj.setAttribute("placeholder", "Search")
					inputWrapperSuffix.classList.add("searchInputWrapperSuffix")
					clearButton.classList.add("searchClearButton")
					clearButton.setAttribute("hidden", "")
					clearButton.setAttribute("title", "Clear")
					clearButton.setAttribute("type", "reset")
					inputWrapperSuffix.appendChild(clearButton)
					inputWrapper.appendChild(inputObj)
					searchLabel.appendChild(submitButton)
					inputWrapperPrefix.appendChild(searchLabel)
					inputWrapperPrefix.appendChild(loadingIndicator)
					formObj.append(inputWrapperPrefix)
					formObj.append(inputWrapper)
					formObj.append(inputWrapperSuffix)
					outerDiv.appendChild(formObj)
					clearButton.innerHTML = `<svg class="searchClearIcon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>`
					submitButton.innerHTML = `<svg class="searchSubmitIcon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>`
					loadingIndicator.innerHTML = `<svg class="searchLoadingIcon" viewBox="0 0 100 100" width="20" height="20"><circle cx="50" cy="50" fill="none" r="35" stroke="currentColor" stroke-dasharray="164.93361431346415 56.97787143782138" stroke-width="6"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;90 50 50;180 50 50;360 50 50" keyTimes="0;0.40;0.65;1"></animateTransform></circle></svg>`
					currentContainer.appendChild(outerDiv)
					inputObj.addEventListener("keyup", searchThree.searchElement)
					//inputObj.addEventListener("blur", searchThree.inputBlurEvent)
					inputObj.addEventListener("focus", searchThree.inputFocusEvent)
					clearButton.addEventListener("click", searchThree.resetSearchValue)
					formObj.addEventListener("submit", searchThree.searchFormSubmit)
				}
			}
		}
	},

	addLinkToHead: async (href) => {
		console.log(href)
		return new Promise((resolve, reject) => {
			const linkElement = document.createElement('link')
			linkElement.rel = 'stylesheet'
			linkElement.href = href
			linkElement.crossOrigin = 'anonymous'
			linkElement.onload = resolve
			linkElement.onerror = reject
			document.head.appendChild(linkElement)
		})
	},

	generateUniqueId: () => {
		const timestamp = new Date().getTime();
		const randomNum = Math.floor(Math.random() * 1000000);
		return `${timestamp}_${randomNum}`;
	},

	searchElement: async (e) => {
		if (e.key === 'Escape' || searchThree.previousValue === e.target.value) {
			return
		}
		let value = e.target.value
		searchThree.previousValue = value
		if (value === "") {
			searchThree.currentQueryId = searchThree.generateUniqueId();
			let querySelector = "#quickSearch";
			if (searchConfigAutoComplete.desktopCssSelector) {
				querySelector = searchConfigAutoComplete.desktopCssSelector
			}
			searchThree.currentContainer = e.target.closest(querySelector)
			if (searchThree.currentContainer && searchThree.currentContainer.querySelector('.searchClearButton')) {
				searchThree.currentContainer.querySelector('.searchClearButton').setAttribute("hidden", "")
			}
			searchThree.removeSearchPanelItemEvent()
			return
		} else {
			let querySelector = "#quickSearch";
			if (searchConfigAutoComplete.desktopCssSelector) {
				querySelector = searchConfigAutoComplete.desktopCssSelector
			}
			searchThree.currentContainer = e.target.closest(querySelector)
			if (searchThree.currentContainer && searchThree.currentContainer.querySelector('.searchClearButton')) {
				searchThree.currentContainer.querySelector('.searchClearButton').removeAttribute("hidden")
			}
		}
		let querySelector = "#quickSearch";
		if (searchConfigAutoComplete.desktopCssSelector) {
			querySelector = searchConfigAutoComplete.desktopCssSelector
		}
		searchThree.currentContainer = e.target.closest(querySelector)
		clearTimeout(searchThree.autoCompleteDebounceTimer);
		searchThree.autoCompleteDebounceTimer = setTimeout(async () => {
			searchThree.currentQueryId = searchThree.generateUniqueId();
			let searchLabel = searchThree.currentContainer.querySelector("#searchInputLabel"),
				loadingIndicator = searchThree.currentContainer.querySelector('.searchLoadingIndicator');
			searchLabel.setAttribute("hidden", "")
			loadingIndicator.removeAttribute("hidden", "")
			let { searchResult, uniqueKey } = await searchThree.multiSearchPerform(value, searchThree.currentQueryId);
			searchLabel.removeAttribute("hidden", "")
			loadingIndicator.setAttribute("hidden", "")
			if (searchResult && uniqueKey === searchThree.currentQueryId) {
				searchThree.hitSearchAnalytics(value, searchResult)
				if( document.querySelector(".searchResultPanelMobileSections") ){
					document.querySelector(".searchResultPanelMobileSections").remove();
				}
				if (!document.querySelector(".searchResultPanel")) {
					await searchThree.createSearchPanel(e)
				}
				if (!document.querySelector(".searchResultPanelSectionLeft")) {
					searchThree.searchResultPanelSectionLeft.classList.add("searchResultPanelSectionLeft")
					searchThree.searchResultPanelSections.appendChild(searchThree.searchResultPanelSectionLeft)
				}
				if (!document.querySelector(".searchResultPanelSectionRight")) {
					searchThree.searchResultPanelSectionRight.classList.add("searchResultPanelSectionRight")
					searchThree.searchResultPanelSections.appendChild(searchThree.searchResultPanelSectionRight)
				}
				if (!document.querySelector(".searchSource.collectionsWrapper")) {
					searchThree.collectionSectionWrapper = document.createElement("section")
					searchThree.collectionSectionWrapper.classList.add("searchSource")
					searchThree.collectionSectionWrapper.classList.add("collectionsWrapper")
					searchThree.searchResultPanelSectionLeft.appendChild(searchThree.collectionSectionWrapper)
				}else{
					searchThree.collectionSectionWrapper.innerHTML	= ''
				}
				if (!document.querySelector(".searchSource.productWrapper")) {
					searchThree.productSectionWrapper = document.createElement("section")
					searchThree.productSectionWrapper.classList.add("searchSource")
					searchThree.productSectionWrapper.classList.add("productWrapper")
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("productSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("productSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Products for ${value}`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.productSectionWrapper.appendChild(sourceHeader)
					searchThree.searchResultPanelSectionRight.appendChild(searchThree.productSectionWrapper)
				} else {
					document.querySelector('.productSourceHeaderTitle').innerHTML = `Products for ${value}`
				}
				if (!document.querySelector('.productSearchList')) {
					searchThree.productsList = document.createElement("ul")
					searchThree.productsList.classList.add("searchList")
					searchThree.productsList.classList.add("productSearchList")
					searchThree.productSectionWrapper.appendChild(searchThree.productsList)
				}
				let productResult = ( searchThree.searchQueryIndex.indexOf("products") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("products")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("products")] : [],
					categoryResult = ( searchThree.searchQueryIndex.indexOf("category") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("category")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("category")] : [],
					pageResult	= ( searchThree.searchQueryIndex.indexOf("pages") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("pages")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("pages")] : [],
					blogResult	= ( searchThree.searchQueryIndex.indexOf("blogs") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("blogs")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("blogs")] : [],
					queriesResult	= ( searchThree.searchQueryIndex.indexOf("queries") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("queries")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("queries")] : [];
				searchThree.collectionsList.innerHTML = ''
				let html = '';
				searchThree.fullWidth	= false
				if (queriesResult.hits && queriesResult.hits.length > 0) {
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("collectionSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("collectionSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Popular Searches`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.collectionSectionWrapper.appendChild(sourceHeader)
					if (!document.querySelector('.queriesSearchList')) {
						searchThree.querySuggesstionList = document.createElement("ul")
						searchThree.querySuggesstionList.classList.add("searchList")
						searchThree.querySuggesstionList.classList.add("queriesSearchList")
						searchThree.collectionSectionWrapper.appendChild(searchThree.querySuggesstionList)
					}
					searchThree.fullWidth	= true
					html	= searchThree.generateQueryHtml(queriesResult)					
				}
				searchThree.querySuggesstionList.innerHTML = html
				if (categoryResult.hits && categoryResult.hits.length > 0) {
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("collectionSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("collectionSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Categories`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.collectionSectionWrapper.appendChild(sourceHeader)
					if (!document.querySelector('.collectionSearchList')) {
						searchThree.collectionsList = document.createElement("ul")
						searchThree.collectionsList.classList.add("searchList")
						searchThree.collectionsList.classList.add("collectionSearchList")
						searchThree.collectionSectionWrapper.appendChild(searchThree.collectionsList)
					}
					searchThree.fullWidth	= true
					html	= searchThree.generateCategoryHtml(categoryResult)					
				}
				searchThree.collectionsList.innerHTML = html
				if (blogResult.hits && blogResult.hits.length > 0) {
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("collectionSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("collectionSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Blogs`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.collectionSectionWrapper.appendChild(sourceHeader)
					if (!document.querySelector('.blogSearchList')) {
						searchThree.blogList = document.createElement("ul")
						searchThree.blogList.classList.add("searchList")
						searchThree.blogList.classList.add("blogSearchList")
						searchThree.collectionSectionWrapper.appendChild(searchThree.blogList)
					}
					searchThree.fullWidth	= true
					html	= searchThree.generateBlogHtml(blogResult)					
				}
				searchThree.blogList.innerHTML = html
				if (pageResult.hits && pageResult.hits.length > 0) {
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("collectionSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("collectionSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Pages`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.collectionSectionWrapper.appendChild(sourceHeader)
					if (!document.querySelector('.pageSearchList')) {
						searchThree.pagesList = document.createElement("ul")
						searchThree.pagesList.classList.add("searchList")
						searchThree.pagesList.classList.add("pageSearchList")
						searchThree.collectionSectionWrapper.appendChild(searchThree.pagesList)
					}
					searchThree.fullWidth	= true
					html	= searchThree.generatePageHtml(pageResult)					
				}
				searchThree.pagesList.innerHTML = html
				if (productResult.hits && productResult.hits.length > 0) {
					html	= searchThree.generateProductHtml(productResult)
				} else {
					html = `
									<li class="searchProductItem productNotFound" id="autocompleteItem010" role="option">
										<span>No product found</span>
									</li>
								`
				}
				searchThree.productsList.innerHTML = html
				if (!searchThree.fullWidth) {
					document.querySelector(".searchResultPanelSectionLeft").style.display = "none"
					document.querySelector(".searchResultPanelSectionRight").style.width = "100%"
				}else{
					if (document.querySelector(".searchResultPanelSectionLeft")) {
						document.querySelector(".searchResultPanelSectionLeft").style.display = "block"
						if (window.innerWidth >= 768) {
							document.querySelector(".searchResultPanelSectionRight").style.width = "calc( 70% - 8px )"
						} else {
							document.querySelector(".searchResultPanelSectionRight").style.width = "100%"
						}
					}
					if (document.querySelector(".searchResultPanelSectionRight + .viewAllItemsList")) {
						searchResult.viewAllItemsList = null
						document.querySelector(".searchResultPanelSectionRight + .viewAllItemsList").remove()
					}
				}

				if (searchConfigAutoComplete.seeAllButton) {
					if (!document.querySelector(".viewAllItemsList")) {
						searchThree.viewAllItemsList = document.createElement("ul")
						searchThree.viewAllItemsList.classList.add("viewAllItemsList")
						searchThree.viewAllItemsList.classList.add("searchList")
					}
					if (searchThree.fullWidth) {
						searchThree.collectionSectionWrapper.appendChild(searchThree.viewAllItemsList)
					} else {
						searchThree.searchResultPanelSections.appendChild(searchThree.viewAllItemsList)
					}
					searchThree.viewAllItemsList.innerHTML = ''
					let totalProducts = productResult.hits.length > 0 ? "View all " + productResult.found + " items" : " See All products"
					searchThree.viewAllItemsList.innerHTML = `
						<li class="viewAllItemsListItem">
							<a class="searchNoResultsLink" href="/search-results-page?q=${productResult.hits.length > 0 ? searchThree.previousValue : ""}">
								${totalProducts}
								<i class="searchThreeArrowList"></i>
							</a>
						</li>
					`
				}
				if( document.querySelector(".searchResultPanelSectionRight") ){
					let offsetWidth	= document.querySelector(".searchResultPanelSectionRight").offsetWidth
					let gridColumn		= Math.floor(offsetWidth / 178)
					searchThree.productsList.style.gridTemplateColumns	= `repeat(${gridColumn}, 1fr)`
				}
			}
		}, 100, value)
	},

	generateCategoryHtml: (categoryResult) => {
		let html	= "";
		categoryResult.hits.forEach(function (val, key) {
			let name = val.document.name;
			if ( searchConfigAutoComplete.highlightSearchTerm && typeof val.highlights[0] !== 'undefined') {
				var highlight = val.highlights[0].field || false;
				if (highlight == 'name') {
					name = val.highlight.name.snippet;
				}
			}
			html += `
							<li class="searchCollectionItem" id="autocompleteItem${key}" role="option">
								<a href="${val.document.url}" class="searchItemLink">
									<div class="searchItemWrapper">
										<div class="searchItemContent">
											<div class="searchItemContentBody">
												<div class="searchItemContentTitle">${name}</div>
											</div>
										</div>
									</div>
								</a>
							</li>
						`;
		})
		return html;
	},

	generateQueryHtml: (queriesResult) => {
		let html	= "";
		queriesResult.hits.forEach(function (val, key) {
			let q = val.document.q;
			if (searchConfigAutoComplete.highlightSearchTerm && typeof val.highlights[0] !== 'undefined') {
				var highlight = val.highlights[0].field || false;
				if (highlight == 'q') {
					q = val.highlight.q.snippet;
				}
			}
			html += `
							<li class="searchCollectionItem" id="autocompleteItem${key}" role="option">
								<a href="/search-results-page?q=${val.document.q}" class="searchItemLink">
									<div class="searchItemWrapper">
										<div class="searchItemContent">
											<div class="searchItemIcon searchItemIconNoBorder">
												<svg width='24' height='24' viewBox='0 0 24 24' fill='currentcolor' xmlns='http://www.w3.org/2000/svg'>
													<path fill-rule='evenodd' clip-rule='evenodd' d='M10.6 3.75C6.76295 3.75 3.75 6.77915 3.75 10.5409C3.75 14.3001 6.76045 17.3318 10.5 17.3318C11.9854 17.3318 13.3777 16.8561 14.5821 15.9089L18.6227 19.975C18.7663 20.1195 19.0288 20.25 19.3 20.25C19.5712 20.25 19.8337 20.1195 19.9773 19.975C20.1209 19.8305 20.25 19.567 20.25 19.2956C20.25 19.185 20.2027 19.0662 20.1614 18.9831C20.1162 18.8922 20.052 18.792 19.9773 18.7169L15.9348 14.6489C16.8771 13.4366 17.35 12.0355 17.35 10.5409C17.35 6.78165 14.3395 3.75 10.6 3.75ZM5.65 10.5409C5.65 7.85986 7.83955 5.65881 10.5 5.65881C13.1605 5.65881 15.35 7.85986 15.35 10.5409C15.35 13.3225 13.2605 15.423 10.5 15.423C7.83955 15.423 5.65 13.2219 5.65 10.5409Z' fill='currentcolor'/>
												</svg>
											</div>
											<div class="searchItemContentBody">
												<div class="searchItemContentTitle searchItemSuggestionText">${q}</div>
											</div>
										</div>
									</div>
								</a>
							</li>
						`;
		})
		return html;
	},

	generateBlogHtml: (blogResult) => {
		let html	= "";
		blogResult.hits.forEach(function (val, key) {
			let name = val.document.name;
			if (searchConfigAutoComplete.highlightSearchTerm && typeof val.highlights[0] !== 'undefined') {
				var highlight = val.highlights[0].field || false;
				if (highlight == 'name') {
					name = val.highlight.name.snippet;
				}
			}
			html += `
							<li class="searchCollectionItem" id="autocompleteItem${key}" role="option">
								<a href="${val.document.url}" class="searchItemLink">
									<div class="searchItemWrapper">
										<div class="searchItemContent">
											<div class="searchItemIcon searchItemIconNoBorder">
												<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<path d='M10 0C4.489 0 0 4.489 0 10C0 15.511 4.489 20 10 20C15.511 20 20 15.511 20 10C20 4.489 15.511 0 10 0ZM10 2C14.4301 2 18 5.56988 18 10C18 14.4301 14.4301 18 10 18C5.56988 18 2 14.4301 2 10C2 5.56988 5.56988 2 10 2ZM10 5C9.44771 5 9 5.44772 9 6C9 6.55228 9.44771 7 10 7C10.5523 7 11 6.55228 11 6C11 5.44772 10.5523 5 10 5ZM10 8.5C9.44771 8.5 9 8.94772 9 9.5V14C9 14.5523 9.44771 15 10 15C10.5523 15 11 14.5523 11 14V9.5C11 8.94771 10.5523 8.5 10 8.5Z' fill='currentcolor'/>
												</svg>
											</div>
											<div class="searchItemContentBody">
												<div class="searchItemContentTitle">${name}</div>
											</div>
										</div>
									</div>
								</a>
							</li>
						`;
		})
		if( blogResult.hits.length < blogResult.found ){
			html += `
							<li class="searchCollectionItem" id="autocompleteItem${blogResult.found}" role="option">
								<a href="/search-results-page?q=${blogResult.request_params.q}&tab=Blogs" class="searchItemLink">
									<div class="searchItemWrapper">
										<div class="searchItemContent">
											<div class="searchItemContentBody">
												<div class="searchItemContentTitle">More</div>
											</div>
											<div class="searchItemIcon searchItemIconNoBorder">
												<svg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
													<path d='M0.999532 6.99973H12.1695L7.28953 2.11973C6.89953 1.72973 6.89953 1.08973 7.28953 0.699727C7.67953 0.309727 8.30953 0.309727 8.69953 0.699727L15.2895 7.28973C15.6795 7.67973 15.6795 8.30973 15.2895 8.69973L8.69953 15.2897C8.30953 15.6797 7.67953 15.6797 7.28953 15.2897C6.89953 14.8997 6.89953 14.2697 7.28953 13.8797L12.1695 8.99973H0.999532C0.449532 8.99973 -0.000468254 8.54973 -0.000468254 7.99973C-0.000468254 7.44973 0.449532 6.99973 0.999532 6.99973Z' fill='currentcolor'/>
												</svg>
											</div>
										</div>
									</div>
								</a>
							</li>
						`;
		}
		return html;
	},

	generatePageHtml: (pageResult) => {
		let html	= "";
		pageResult.hits.forEach(function (val, key) {
			let name = val.document.name;
			if (searchConfigAutoComplete.highlightSearchTerm && typeof val.highlights[0] !== 'undefined') {
				var highlight = val.highlights[0].field || false;
				if (highlight == 'name') {
					name = val.highlight.name.snippet;
				}
			}
			html += `
							<li class="searchCollectionItem" id="autocompleteItem${key}" role="option">
								<a href="${val.document.url}" class="searchItemLink">
									<div class="searchItemWrapper">
										<div class="searchItemContent">
											<div class="searchItemIcon searchItemIconNoBorder">
												<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<path d='M10 0C4.489 0 0 4.489 0 10C0 15.511 4.489 20 10 20C15.511 20 20 15.511 20 10C20 4.489 15.511 0 10 0ZM10 2C14.4301 2 18 5.56988 18 10C18 14.4301 14.4301 18 10 18C5.56988 18 2 14.4301 2 10C2 5.56988 5.56988 2 10 2ZM10 5C9.44771 5 9 5.44772 9 6C9 6.55228 9.44771 7 10 7C10.5523 7 11 6.55228 11 6C11 5.44772 10.5523 5 10 5ZM10 8.5C9.44771 8.5 9 8.94772 9 9.5V14C9 14.5523 9.44771 15 10 15C10.5523 15 11 14.5523 11 14V9.5C11 8.94771 10.5523 8.5 10 8.5Z' fill='currentcolor'/>
												</svg>
											</div>
											<div class="searchItemContentBody">
												<div class="searchItemContentTitle">${name}</div>
											</div>
										</div>
									</div>
								</a>
							</li>
						`;
		})
		if( pageResult.hits.length < pageResult.found ){
			html += `
							<li class="searchCollectionItem" id="autocompleteItem${pageResult.found}" role="option">
								<a href="/search-results-page?q=${pageResult.request_params.q}&tab=Pages" class="searchItemLink">
									<div class="searchItemWrapper">
										<div class="searchItemContent">
											<div class="searchItemContentBody">
												<div class="searchItemContentTitle">More</div>
											</div>
											<div class="searchItemIcon searchItemIconNoBorder">
												<svg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
													<path d='M0.999532 6.99973H12.1695L7.28953 2.11973C6.89953 1.72973 6.89953 1.08973 7.28953 0.699727C7.67953 0.309727 8.30953 0.309727 8.69953 0.699727L15.2895 7.28973C15.6795 7.67973 15.6795 8.30973 15.2895 8.69973L8.69953 15.2897C8.30953 15.6797 7.67953 15.6797 7.28953 15.2897C6.89953 14.8997 6.89953 14.2697 7.28953 13.8797L12.1695 8.99973H0.999532C0.449532 8.99973 -0.000468254 8.54973 -0.000468254 7.99973C-0.000468254 7.44973 0.449532 6.99973 0.999532 6.99973Z' fill='currentcolor'/>
												</svg>
											</div>
										</div>
									</div>
								</a>
							</li>
						`;
		}
		return html;
	},

	productClickEvent: (event, product) => {
		event.preventDefault()
		const isModifiedClick = event.ctrlKey || event.metaKey;
		let { min, max }	= searchThree.getPriceRange(product);
		product["minPrice"]	= min
		product["maxPrice"]	= max
		searchThree.productClickTracking(product)
		if( isModifiedClick ){
			let a= document.createElement('a');
			a.target= '_blank';
			a.href= product.url;
			a.click();
			
		}else{
			window.location.href = product.url
		}
	},

	productClickTracking: async (product) => {
		try {
			const postData = {
				uniqueId: searchThree.uniqueId,
				searchKey: searchThree.previousValue,
				product: product,
				searchType: "autocomplete",
				sessionId: searchThree.sessionID
			},
				response = await fetch(`${searchThree.analyticsURL}/api/v1/analytics/productClickLog`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
					body: JSON.stringify(postData)
				});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
		} catch (error) {
			console.error('Error:', error);
		}
	},

	generateProductHtml: (productResult) => {
		let html = "";
		productResult.hits.forEach(function (val, key) {
			let name = val.document.name;
			if ( searchConfigAutoComplete.highlightSearchTerm && typeof val.highlights[0] !== 'undefined') {
				var highlight = val.highlights[0].field || false;
				if (highlight == 'name') {
					name = val.highlight.name.snippet;
				}
			}
			let image = null;
			if (val.document.image) {
				image = val.document.image;
			} else {
				image = "https://storage.googleapis.com/roundclicksview/No%20Product%20Image%20Available.png";
			}
			html += `
							<li class="searchProductItem" id="autocompleteItem01${key}" role="option">
								<a href="#" class="searchItemLink searchProductItemLink" onclick="window.searchThree.productClickEvent(event, ${JSON.stringify(val.document).replace(/"/g, '&quot;')})">
									<div class="searchItemContent">
										<div class="searchItemPicture searchItemPictureloaded">
											<img src="${image}" alt="${val.document.name}">
										</div>
										<div class="searchItemContentBody">
											<div class="searchItemContentTitle">
												${name}
											</div>
											${(searchConfigAutoComplete.showVendor && val.document.brand ) ? `<div class="searchItemContentBrand"><span> by </span>${val.document.brand}</div>` : "" }
											${(searchConfigAutoComplete.showDescription && val.document.description ) ? `<div class="searchItemContentDescripition" style="-webkit-line-clamp: ${searchConfigAutoComplete.descriptionMaxLines};">${val.document.description}</div>` : ""}
											${(searchConfigAutoComplete.showSKU && val.document.sku ) ? `<div class="searchItemContentSku">${val.document.sku}</div>`: ""}
											${( typeof searchConfigAutoComplete.showPrice === "undefined" || searchConfigAutoComplete.showPrice ) ? `<div class="searchItemContentPrice">`+searchThree.formatPrice(val.document)+`</div>` : ""}
										</div>
									</div>
								</a>
							</li>
						`;
		})
		return html;
	},

	createSearchPanel: async (e) => {
		searchThree.searchResultPanel.classList.add("searchResultPanel")
		searchThree.searchResultPanelLayout.classList.add("searchResultPanelLayout")
		searchThree.searchResultPanelLayout.classList.add("searchResultPanelScrollable")
		searchThree.searchResultPanelSections.classList.add("searchResultPanelSections")
		searchThree.searchResultPanelSectionLeft.classList.add("searchResultPanelSectionLeft")
		searchThree.searchResultPanelSectionRight.classList.add("searchResultPanelSectionRight")
		// searchThree.searchResultPanelSections.appendChild(searchThree.searchResultPanelSectionLeft)
		// searchThree.searchResultPanelSections.appendChild(searchThree.searchResultPanelSectionRight)
		searchThree.searchResultPanelLayout.appendChild(searchThree.searchResultPanelSections)
		searchThree.searchResultPanel.appendChild(searchThree.searchResultPanelLayout)
		document.querySelector("body").appendChild(searchThree.searchResultPanel)
		let querySelector = "#quickSearch";
		if (searchConfigAutoComplete.desktopCssSelector) {
			querySelector = searchConfigAutoComplete.desktopCssSelector
		}
		searchThree.currentContainer = e.target.closest(querySelector)
		searchThree.updateSearchPanel()
		setTimeout(() => {
			document.body.addEventListener("click", searchThree.removeSearchPanel)
			document.addEventListener('keydown', searchThree.escapeKeyTrack)
			window.addEventListener('resize', searchThree.updateSearchPanel)
			window.addEventListener('scroll', searchThree.updateSearchPanel)
		}, 500)
	},

	updateSearchPanel: async () => {
		if (searchThree.currentContainer) {
			let currentContainer = searchThree.currentContainer
			searchThree.searchResultPanel.style.width = null
			var containerOuterHeight = currentContainer.offsetHeight + parseInt(window.getComputedStyle(currentContainer).marginTop) + parseInt(window.getComputedStyle(currentContainer).marginBottom),
				containerWidth = parseFloat(window.getComputedStyle(currentContainer).width.replace("px", "")),
				searchPanelWidth = parseFloat(window.getComputedStyle(searchThree.searchResultPanel).width.replace("px", "")),
				leftDifference = 0;
			if ( document.querySelector(".searchResultPanelSectionRight") ) {
				if (window.innerWidth >= 768) {
					if(  document.querySelector(".searchResultPanelSectionLeft").style.display !== "none" ){
						document.querySelector(".searchResultPanelSectionRight").style.width = "calc( 70% - 8px )"
					}
				} else {
					document.querySelector(".searchResultPanelSectionRight").style.width = "100%"
				}
			}
			if (searchPanelWidth > containerWidth) {
				leftDifference = (searchPanelWidth - containerWidth) / 2
			} else {
				searchThree.searchResultPanel.style.width = containerWidth - (parseInt(window.getComputedStyle(currentContainer).paddingLeft) + parseInt(window.getComputedStyle(currentContainer).paddingRight)) + 'px'
			}
			// var targetOffset = Math.round(searchThree.container.offsetTop + containerOuterHeight);
			// var currentOffset = Math.round(searchThree.searchResultPanel.offsetTop);
			let searchBoxRect = currentContainer.getBoundingClientRect(),
				searchBoxTop = (searchBoxRect.top + window.scrollY + containerOuterHeight) - (parseInt(window.getComputedStyle(currentContainer).paddingTop)),
				searchBoxLeft = ((searchBoxRect.left + window.scrollX) - leftDifference) + (parseInt(window.getComputedStyle(currentContainer).paddingLeft)),
				maxHeight = window.innerHeight - searchBoxRect.top,
				documentWidth = document.documentElement.clientWidth;
				console.log(searchBoxRect.top, "Search Box Top")

			if ((searchBoxLeft + searchPanelWidth) > documentWidth) {
				let newLeft = searchBoxLeft - ((searchBoxLeft + searchPanelWidth) - documentWidth) - (documentWidth - searchBoxRect.right)
				searchBoxLeft = newLeft
				if (searchBoxLeft < (documentWidth - searchBoxRect.right)) {
					searchBoxLeft = (documentWidth - searchBoxRect.right)
					let newWidth = documentWidth - (searchBoxLeft * 2)
					searchThree.searchResultPanel.style.width = newWidth + "px"
					console.log(newWidth)
				}
			}else if( searchBoxLeft < 0 ){
				let newLeft	= searchBoxRect.left > 250 ? 100 : searchBoxRect.left
				//let newLeft = searchBoxLeft - ((searchBoxLeft + searchPanelWidth) - documentWidth) - (documentWidth - searchBoxRect.right)
				searchBoxLeft = newLeft
				if ( ( searchBoxLeft + searchPanelWidth ) > documentWidth ) {	
					let newWidth = searchPanelWidth  - searchBoxLeft
					searchThree.searchResultPanel.style.width = newWidth + "px"
					console.log(newWidth)
				}
			}

			searchThree.searchResultPanel.style.top = searchBoxTop + 'px'
			searchThree.searchResultPanel.style.left = searchBoxLeft + "px"
			searchThree.searchResultPanel.style.maxHeight = ( maxHeight > 150 ? maxHeight : "150" ) + "px"
			searchThree.searchResultPanelLayout.style.maxHeight = ( maxHeight > 150 ? maxHeight : "150" ) + "px"
		}
	},

	getPriceRange: (product)	=> {
		let min	= product.price,
			max	= product.price;
		if( typeof product.variants !== "undefined" && product.variants.length > 0 ){
			for( let i = 0; i < product.variants.length; i++ ){
				let currentVariant	= product.variants[i]
				if( currentVariant.price > 0 ){
					if( min > currentVariant.price ){
						if( currentVariant.sale_price > 0 ){
							min	= currentVariant.sale_price
						}else{
							min	= currentVariant.price
						}
					}
					if( max < currentVariant.price ){
						if( currentVariant.sale_price > 0 && max < currentVariant.sale_price ){
							max	= currentVariant.sale_price
						}else{
							max	= currentVariant.price
						}
					}
				}
			}
		}
		return {min, max}
	},

	formPriceText: (price) => {
		let config				= searchThree.currencyObj,
			convertedPrice		= parseFloat(price);
		if( !config.isDefault ){
			convertedPrice = parseFloat(price) * parseFloat(config.rate);
		}
		let parsedPrice = convertedPrice.toFixed(config.decimals),
			parts = parsedPrice.split(config.decimalSeparator);
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);

		let formattedPrice = parts.join(config.decimalSeparator);
		if (config.location === 'left') {
			 formattedPrice = config.symbol + ' ' + formattedPrice;
		} else if (config.location === 'right') {
			 formattedPrice = formattedPrice + ' ' + config.symbol;
		}
		return formattedPrice;
	},

	formatPrice: (product) => {
		let { min, max }	= searchThree.getPriceRange(product)
		if( min === max ){
			if( product.sale_price > 0 ){
				return `<span class="cbPriceList">${searchThree.formPriceText(product.sale_price)}</span><span class="cbPriceList cbOriginalPrice">${searchThree.formPriceText(product.price)}</span>`
			}else{
				return `<span class="cbPriceList">${searchThree.formPriceText(product.price)}</span>`
			}
		}else{
			let minPrice	= searchThree.formPriceText(min),
				maxPrice	= searchThree.formPriceText(max);
			return `<span class="cbPriceList">${minPrice} - ${maxPrice}</span>`
		}
	},

	multiSearchPerform: async (searchKeyword, uniqueKey) => {
		let config = window.conversionBoxSearch.config.searchConfig,
			autoCompleteConfig = searchConfigAutoComplete,
			indexConfig = window.conversionBoxSearch.config.indexConfig,
			tablePrefix = config.tablePrefix,
			productTable = tablePrefix + "products",
			categoryTable = tablePrefix + "category",
			pageTable	= tablePrefix + "pages",
			blogTable	= tablePrefix + "blogs",
			querySuggestionTable	= tablePrefix + "queries",
			searchProductParameters = null,
			searchCategoryParameters = null,
			searchPageParameters	= null,
			searchBlogParameters	= null,
			searchQueryParameters	= null,
			searchRequests = {
				'searches': []
			},
			commonSearchParams = {
				'typo_tokens_threshold': 1,
				'num_typos': 2,
				'min_len_1typo': 4,
				'min_len_2typo': 4,
			};
		searchThree.searchQueryIndex	= []
		if (indexConfig.index_products == "true") {
			searchProductParameters = {
				collection: productTable,
				q: searchKeyword,
				query_by: "name,description,categories,sku,brand",
				per_page: autoCompleteConfig.noOfProducts,
				filter_by: `channel_ids:=[${channelId}] && is_visible:=1`,
				sort_by: "_text_match:desc"
			}
			if( typeof autoCompleteConfig.outOfStock !== "undefined" && !autoCompleteConfig.outOfStock ){
				searchProductParameters["filter_by"]	+=	` && in_stock:=1`
			}
			searchRequests.searches.push(searchProductParameters)
			searchThree.searchQueryIndex.push("products")
		}
		if (indexConfig.index_collections == "true") {
			searchCategoryParameters = {
				collection: categoryTable,
				q: searchKeyword,
				query_by: "name",
				per_page: autoCompleteConfig.noOfCollections,
				filter_by: `channel_id:=[${channelId}] && is_visible:=1`,
				sort_by: '_text_match:desc'
			}
			searchRequests.searches.push(searchCategoryParameters)
			searchThree.searchQueryIndex.push("category")
		}
		if ( indexConfig.index_pages === "true" ){
			searchPageParameters	= {
												collection: pageTable,
												q: searchKeyword,
												query_by: "name, description",
												per_page: autoCompleteConfig.noOfPages,
												filter_by: `channel_id:[${channelId}] && is_visible:=1`,
												sort_by: '_text_match:desc'
											}
			searchRequests.searches.push(searchPageParameters)
			searchThree.searchQueryIndex.push("pages")
		}
		if( indexConfig.index_blogs === "true" ){
			searchBlogParameters	= {
												collection: blogTable,
												q: searchKeyword,
												query_by: "name,description,tags,author",
												per_page: autoCompleteConfig.noOfBlogs,
												filter_by: `is_published:=1`,
												sort_by: '_text_match:desc'
											}
			searchRequests.searches.push(searchBlogParameters)
			searchThree.searchQueryIndex.push("blogs")
		}
		if( autoCompleteConfig.enableQuerySuggestion ){
			searchQueryParameters	= {
													collection: querySuggestionTable,
													q: searchKeyword,
													query_by: 'q',
													per_page: autoCompleteConfig.noOfQuerySuggestion,
													sort_by: '_text_match:desc'
												}
			searchRequests.searches.push(searchQueryParameters)
			searchThree.searchQueryIndex.push("queries")
		}

		try {
			let searchResult = await searchThree.typeSenseClient.multiSearch.perform(searchRequests, commonSearchParams)
			return { searchResult, uniqueKey }
		} catch (e) {
			console.log("Error in fetching documents")
			return null
		}
	},

	inputBlurEvent: async () => {
		//searchThree.removeSearchPanel()
	},

	removeSearchPanel: async (event) => {
		let searchPanel = document.querySelector(".searchResultPanel"),
			inputHtmlObj = document.querySelector("#searchInput")
		if (searchPanel && inputHtmlObj) {
			const isClickInsideDiv = searchPanel.contains(event.target),
				isClickInsideInput = inputHtmlObj.contains(event.target)
			if (!isClickInsideDiv && !isClickInsideInput) {
				searchThree.removeSearchPanelItemEvent()
			}
		}
	},

	removeSearchPanelItemEvent: async () => {
		if (document.querySelector(".searchResultPanel")) {
			if (searchThree.previousValue === "") {
				searchThree.searchResultPanel = document.createElement("div")
				searchThree.searchResultPanelLayout = document.createElement("div")
				searchThree.searchResultPanelSections = document.createElement("div")
				searchThree.searchResultPanelSectionLeft = document.createElement("div")
				searchThree.searchResultPanelSectionRight = document.createElement("div")
				searchThree.collectionSectionWrapper = document.createElement("section")
				searchThree.productSectionWrapper = document.createElement("section")
				searchThree.collectionsList = document.createElement("ul")
				searchThree.productsList = document.createElement("ul")
			}
			document.querySelector(".searchResultPanel").remove()
			document.body.removeEventListener("click", searchThree.removeSearchPanel)
			document.removeEventListener("keyup", searchThree.escapeKeyTrack)
			window.removeEventListener('resize', searchThree.updateSearchPanel);
			window.removeEventListener('scroll', searchThree.updateSearchPanel)
		}
	},

	createResponsiveSearchPanel: async () => {
		document.dispatchEvent(cbMobileRendered)
		let searchResultPanel = document.querySelector(".searchResultPanel");
		if (searchResultPanel && !searchResultPanel.classList.contains(".searchMobileResultPanel")) {
			await searchThree.removeSearchPanelItemEvent()
		}
		searchThree.searchResultPanel = document.createElement("div")
		searchThree.searchResultPanel.classList.add("searchResultPanel")
		searchThree.searchResultPanel.classList.add("searchMobileResultPanel")
		searchThree.searchResultPanelLayout = document.createElement("div")
		searchThree.searchResultPanelLayout.classList.add("searchResultPanelLayout")
		searchThree.searchResultPanelLayout.classList.add("searchResultPanelScrollable")
		searchThree.searchResultPanel.appendChild(searchThree.searchResultPanelLayout)
		document.body.appendChild(searchThree.searchResultPanel)
		searchThree.searchResultPanel.style.top = 0
		searchThree.searchResultPanel.style.left = 0
		searchThree.searchResultPanel.style.right = 0
		searchThree.searchResultPanel.style.bottom = 0
		searchThree.searchResultPanel.style.width = "100%"
		searchThree.searchResultPanel.style.marginTop = 0
		searchThree.searchResultPanel.style.zIndex = 999999
		searchThree.searchMobileFromWrapper.classList.add("searchMobileFormWrapper")
		searchThree.formMobileObj.classList.add("searchMobileForm")
		searchThree.inputWrapperMobilePrefix.classList.add("searchInputWrapperMobilePrefix")
		searchThree.submitMobileButton.classList.add("searchSubmitMobileButton")
		searchThree.submitMobileButton.setAttribute("type", "submit")
		searchThree.submitMobileButton.setAttribute("title", "Submit")
		searchThree.searchMobileLabel.classList.add("searchMobileLabel")
		searchThree.searchMobileLabel.setAttribute("for", "searchInput")
		searchThree.searchMobileLabel.setAttribute("id", "searchInputLabel")
		searchThree.loadingMobileIndicator.classList.add("searchLoadingMobileIndicator")
		searchThree.loadingMobileIndicator.setAttribute("hidden", "")
		searchThree.inputMobileWrapper.classList.add("searchInputMobileWrapper")
		searchThree.inputMobileObj.classList.add("searchMobileInput")
		searchThree.inputMobileObj.setAttribute("id", "searchMobileInput")
		searchThree.inputMobileObj.setAttribute("autocomplete", "off")
		searchThree.inputMobileObj.setAttribute("autocorrect", "off")
		searchThree.inputMobileObj.setAttribute("autocapitalize", "off")
		searchThree.inputMobileObj.setAttribute("enterkeyhint", "search")
		searchThree.inputMobileObj.setAttribute("spellcheck", "false")
		searchThree.inputMobileObj.setAttribute("placeholder", "")
		searchThree.inputMobileObj.setAttribute("maxlength", "512")
		searchThree.inputMobileObj.setAttribute("type", "text")
		searchThree.inputMobileObj.setAttribute("placeholder", "Search")
		searchThree.inputWrapperMobileSuffix.classList.add("searchInputWrapperMobileSuffix")
		searchThree.clearMobileButton.classList.add("searchClearMobileButton")
		searchThree.clearMobileButton.setAttribute("hidden", "")
		searchThree.clearMobileButton.setAttribute("title", "Clear")
		searchThree.clearMobileButton.setAttribute("type", "reset")
		searchThree.inputWrapperMobileSuffix.appendChild(searchThree.clearMobileButton)
		searchThree.inputMobileWrapper.appendChild(searchThree.inputMobileObj)
		searchThree.searchMobileLabel.appendChild(searchThree.submitMobileButton)
		searchThree.inputWrapperMobilePrefix.appendChild(searchThree.searchMobileLabel)
		searchThree.inputWrapperMobilePrefix.appendChild(searchThree.loadingMobileIndicator)
		searchThree.formMobileObj.append(searchThree.inputWrapperMobilePrefix)
		searchThree.formMobileObj.append(searchThree.inputMobileWrapper)
		searchThree.formMobileObj.append(searchThree.inputWrapperMobileSuffix)
		searchThree.searchMobileFromWrapper.appendChild(searchThree.formMobileObj)
		searchThree.searchResultPanelLayout.appendChild(searchThree.searchMobileFromWrapper)
		searchThree.clearMobileButton.innerHTML = `<svg class="searchClearIcon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>`
		searchThree.submitMobileButton.innerHTML = `<svg class="searchSubmitIcon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>`
		searchThree.loadingMobileIndicator.innerHTML = `<svg class="searchLoadingIcon" viewBox="0 0 100 100" width="20" height="20"><circle cx="50" cy="50" fill="none" r="35" stroke="currentColor" stroke-dasharray="164.93361431346415 56.97787143782138" stroke-width="6"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;90 50 50;180 50 50;360 50 50" keyTimes="0;0.40;0.65;1"></animateTransform></circle></svg>`
		searchThree.searchMobileFormCloseBtn.classList.add("closeSearchThreeOverlay")
		searchThree.searchMobileFormCloseBtn.innerHTML = "Cancel"
		searchThree.searchMobileFromWrapper.appendChild(searchThree.searchMobileFormCloseBtn)
		searchThree.searchResultPanelSections.classList.add("searchResultPanelSections")
		searchThree.searchResultPanelSections.classList.add("searchResultPanelMobileSections")
		searchThree.searchResultPanelLayout.appendChild(searchThree.searchResultPanelSections)
		searchThree.inputMobileObj.addEventListener("keyup", searchThree.searchMobileElement)
		searchThree.clearMobileButton.addEventListener("click", searchThree.resetSearchMoblieValue)
		searchThree.formMobileObj.addEventListener("submit", searchThree.searchFormMobileSubmit)
		searchThree.searchMobileFormCloseBtn.addEventListener("click", searchThree.removeMobileSearchPanel)
		searchThree.inputMobileObj.focus();
	},

	inputFocusEvent: async (e) => {
		let maxMobileWidth = searchConfigAutoComplete.maxMobileWidth;
		if (window.innerWidth <= maxMobileWidth) {
			searchThree.createResponsiveSearchPanel()
		} else if (e.target.value !== "") {
			searchThree.previousValue = ""
			searchThree.searchElement(e)
		}
	},

	removeMobileSearchPanel: async (e) => {
		searchThree.removeSearchPanelItemEvent()
	},

	escapeKeyTrack: async (e) => {
		if (e.key === 'Escape' && document.querySelector(".searchResultPanel")) {
			searchThree.removeSearchPanelItemEvent()
		}
	},

	resetSearchValue: async (e) => {
		let querySelector = "#quickSearch";
		if (searchConfigAutoComplete.desktopCssSelector) {
			querySelector = searchConfigAutoComplete.desktopCssSelector
		}
		searchThree.currentContainer = e.target.closest(querySelector)
		if (searchThree.currentContainer && searchThree.currentContainer.querySelector('#searchInput')) {
			searchThree.currentContainer.querySelector('#searchInput').value = ""
		}
		searchThree.previousValue = ""
		if (searchThree.currentContainer && searchThree.currentContainer.querySelector('.searchClearButton')) {
			searchThree.currentContainer.querySelector('.searchClearButton').setAttribute("hidden", "")
		}
		searchThree.removeSearchPanelItemEvent()
	},

	resetSearchMoblieValue: async (e) => {
		searchThree.inputMobileObj.value = ""
		searchThree.previousValue = ""
		searchThree.clearMobileButton.setAttribute("hidden", "")
		searchThree.searchResultPanelSections.innerHTML = ""
	},

	searchFormSubmit: async (e) => {
		e.preventDefault()
		let querySelector = "#quickSearch";
		if (searchConfigAutoComplete.desktopCssSelector) {
			querySelector = searchConfigAutoComplete.desktopCssSelector
		}
		searchThree.currentContainer = e.target.closest(querySelector)
		if (searchThree.currentContainer && searchThree.currentContainer.querySelector('#searchInput')) {
			window.location.href = `/search-results-page?q=${searchThree.currentContainer.querySelector('#searchInput').value}`
		}
	},

	searchFormMobileSubmit: async (e) => {
		e.preventDefault()
		window.location.href = `/search-results-page?q=${searchThree.inputMobileObj.value}`
	},

	searchMobileElement: async (e) => {
		if (e.key === 'Escape' || searchThree.previousValue === e.target.value) {
			return
		}
		// if( !document.querySelector(".searchResultPanel") ){
		// 	await searchThree.createSearchPanel()
		// }
		let value = e.target.value
		searchThree.previousValue = value
		if (value === "") {
			searchThree.clearMobileButton.setAttribute("hidden", "")
			searchThree.searchResultPanelSections.innerHTML = ""
			return
		} else {
			searchThree.clearMobileButton.removeAttribute("hidden")
		}
		clearTimeout(autoCompleteDebounceTimer);
		autoCompleteDebounceTimer = setTimeout(async () => {
			searchThree.currentQueryId = searchThree.generateUniqueId();
			searchThree.searchMobileLabel.setAttribute("hidden", "")
			searchThree.loadingMobileIndicator.removeAttribute("hidden", "")
			let { searchResult, uniqueKey } = await searchThree.multiSearchPerform(value, searchThree.currentQueryId);
			searchThree.searchMobileLabel.removeAttribute("hidden", "")
			searchThree.loadingMobileIndicator.setAttribute("hidden", "")
			searchThree.fullWidth	= false
			if (searchResult && uniqueKey === searchThree.currentQueryId) {
				if (!document.querySelector(".searchSource.collectionsWrapper")) {
					searchThree.collectionSectionWrapper = document.createElement("section")
					searchThree.collectionSectionWrapper.classList.add("searchSource")
					searchThree.collectionSectionWrapper.classList.add("collectionsWrapper")
					searchThree.searchResultPanelSections.appendChild(searchThree.collectionSectionWrapper)
				}
				if (!document.querySelector(".searchSource.productWrapper")) {
					searchThree.productSectionWrapper = document.createElement("section")
					searchThree.productSectionWrapper.classList.add("searchSource")
					searchThree.productSectionWrapper.classList.add("productWrapper")
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("productSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("productSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Products for ${value}`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.productSectionWrapper.appendChild(sourceHeader)
					searchThree.searchResultPanelSections.appendChild(searchThree.productSectionWrapper)
				} else {
					document.querySelector('.productSourceHeaderTitle').innerHTML = `Products for ${value}`
				}
				if (!document.querySelector('.productSearchList')) {
					searchThree.productsList = document.createElement("ul")
					searchThree.productsList.classList.add("searchList")
					searchThree.productsList.classList.add("productSearchList")
					searchThree.productSectionWrapper.appendChild(searchThree.productsList)
				}
				let productResult = ( searchThree.searchQueryIndex.indexOf("products") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("products")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("products")] : [],
					categoryResult = ( searchThree.searchQueryIndex.indexOf("category") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("category")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("category")] : [],
					pageResult	= ( searchThree.searchQueryIndex.indexOf("pages") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("pages")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("pages")] : [],
					blogResult	= ( searchThree.searchQueryIndex.indexOf("blogs") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("blogs")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("blogs")] : [],
					queriesResult	= ( searchThree.searchQueryIndex.indexOf("queries") !== -1 &&  searchResult.results[searchThree.searchQueryIndex.indexOf("queries")] ) ? searchResult.results[searchThree.searchQueryIndex.indexOf("queries")] : [];
				searchThree.collectionSectionWrapper.innerHTML = ''
				let html = '';

				if (queriesResult.hits && queriesResult.hits.length > 0) {
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("collectionSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("collectionSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Popular Searches`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.collectionSectionWrapper.appendChild(sourceHeader)
					if (!document.querySelector('.queriesSearchList')) {
						searchThree.querySuggesstionList = document.createElement("ul")
						searchThree.querySuggesstionList.classList.add("searchList")
						searchThree.querySuggesstionList.classList.add("queriesSearchList")
						searchThree.collectionSectionWrapper.appendChild(searchThree.querySuggesstionList)
					}
					searchThree.fullWidth	= true
					html	= searchThree.generateQueryHtml(queriesResult)					
				}
				searchThree.querySuggesstionList.innerHTML = html
				if (categoryResult.hits && categoryResult.hits.length > 0) {
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("collectionSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("collectionSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Categories`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.collectionSectionWrapper.appendChild(sourceHeader)
					if (!document.querySelector('.collectionSearchList')) {
						searchThree.collectionsList = document.createElement("ul")
						searchThree.collectionsList.classList.add("searchList")
						searchThree.collectionsList.classList.add("collectionSearchList")
						searchThree.collectionSectionWrapper.appendChild(searchThree.collectionsList)
					}
					searchThree.fullWidth	= true
					html	= searchThree.generateCategoryHtml(categoryResult)					
				}
				searchThree.collectionsList.innerHTML = html
				if (blogResult.hits && blogResult.hits.length > 0) {
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("collectionSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("collectionSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Blogs`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.collectionSectionWrapper.appendChild(sourceHeader)
					if (!document.querySelector('.blogSearchList')) {
						searchThree.blogList = document.createElement("ul")
						searchThree.blogList.classList.add("searchList")
						searchThree.blogList.classList.add("blogSearchList")
						searchThree.collectionSectionWrapper.appendChild(searchThree.blogList)
					}
					searchThree.fullWidth	= true
					html	= searchThree.generateBlogHtml(blogResult)					
				}
				searchThree.blogList.innerHTML = html
				if (pageResult.hits && pageResult.hits.length > 0) {
					let sourceHeader = document.createElement("div"),
						sourceHeaderTitle = document.createElement("span"),
						sourceHeaderLine = document.createElement("div")
					sourceHeader.classList.add("collectionSourceHeader")
					sourceHeader.classList.add("sourceHeader")
					sourceHeaderTitle.classList.add("collectionSourceHeaderTitle")
					sourceHeaderTitle.classList.add("sourceHeaderTitle")
					sourceHeaderLine.classList.add("sourceHeaderLine")
					sourceHeaderTitle.innerHTML = `Pages`
					sourceHeader.appendChild(sourceHeaderTitle)
					sourceHeader.appendChild(sourceHeaderLine)
					searchThree.collectionSectionWrapper.appendChild(sourceHeader)
					if (!document.querySelector('.pageSearchList')) {
						searchThree.pagesList = document.createElement("ul")
						searchThree.pagesList.classList.add("searchList")
						searchThree.pagesList.classList.add("pageSearchList")
						searchThree.collectionSectionWrapper.appendChild(searchThree.pagesList)
					}
					searchThree.fullWidth	= true
					html	= searchThree.generatePageHtml(pageResult)					
				}
				searchThree.pagesList.innerHTML = html
				if (productResult.hits && productResult.hits.length > 0) {
					html	= searchThree.generateProductHtml(productResult)
				} else {
					html = `
									<li class="searchProductItem productNotFound" id="autocompleteItem010" role="option">
										<span>No product found</span>
									</li>
								`
				}
				searchThree.productsList.innerHTML = html
				if( !searchThree.fullWidth ){
					if (document.querySelector(".collectionsWrapper")) {
						document.querySelector(".collectionsWrapper").style.display = "none"
					}
				}else{
					if (document.querySelector(".collectionsWrapper")) {
						document.querySelector(".collectionsWrapper").style.display = "block"
					}
				}
				let config = searchConfigAutoComplete
				if (config.seeAllButton) {
					if (!document.querySelector(".viewAllItemsList")) {
						searchThree.viewAllItemsList = document.createElement("ul")
						searchThree.viewAllItemsList.classList.add("viewAllItemsList")
						searchThree.viewAllItemsList.classList.add("searchList")
						searchThree.searchResultPanelSections.appendChild(searchThree.viewAllItemsList)
					}
					searchThree.viewAllItemsList.innerHTML = ''
					let totalProducts = productResult.hits.length > 0 ? "View all " + productResult.found + " items" : " See All products"
					searchThree.viewAllItemsList.innerHTML = `
						<li class="viewAllItemsListItem">
							<a class="searchNoResultsLink" href="/search-results-page?q=${productResult.hits.length > 0 ? searchThree.inputMobileObj.value : ""}">
								${totalProducts}
								<i class="searchThreeArrowList"></i>
							</a>
						</li>
					`
				}
			}
		}, 100, value)
	},

	hitSearchAnalytics: async (searchValue, searchResult) => {
		clearTimeout(searchThree.analyticsAutoCompleteDebounceTime);
		searchThree.analyticsAutoCompleteDebounceTime = setTimeout(async () => {
			try {
				const postData = {
					uniqueId: searchThree.uniqueId,
					searchKey: searchValue,
					searchResult: searchResult,
					sessionId: searchThree.sessionID
				},
					response = await fetch(`${searchThree.analyticsURL}/api/v1/analytics/autocompleteLog`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json',
						},
						body: JSON.stringify(postData)
					});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();
			} catch (error) {
				console.error('Error:', error);
			}
		}, 3000, searchValue, searchResult)
	}
}

// Start the interval to check for the variable
cbAutoCompleteIntervalId = setInterval(function () {
	// Check if the custom variable is defined and has a value
	if (typeof window.conversionBoxSearch !== 'undefined' && typeof window.conversionBoxSearch.config !== "undefined" && typeof window.conversionBoxSearch.config.searchConfig && Object.keys(window.conversionBoxSearch.config.searchConfig).length > 0) {
		// Trigger the function if the variable is defined
		clearInterval(cbAutoCompleteIntervalId); // Remove the interval
		searchConfigAutoComplete = window.conversionBoxSearch.config.autoComplete
		channelId = window.conversionBoxSearch.config.channelId
		searchThree.init()
	}
}, 1000);
