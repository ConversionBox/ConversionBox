// Define the interval ID
let cbCustomSearchIntervalId, cbCustomPageType, cbCustomRenderFlag = false, cbCustomFindProductFlag = false;
window.roundviewSearch = window.roundviewSearch || {}
roundviewSearch.vechileFitmentPage = Boolean(window.location.href.match(/\/vehicle-fitments/))
var conversionBoxInstantCustomSearch = {	
	instantSearchWrapSelector: document.querySelector('#roundViewInstantSearchWrapper'),
	instantSearchPageElement: document.createElement("div"),
	instantSearchPageH1Element: document.createElement("h1"),
	inputWrapper: document.createElement("div"),
	inputSearchBoxContainer: document.createElement("div"),
	searchBoxWrapper: document.createElement("div"),
	searchBoxInner: document.createElement("div"),
	searchBoxForm: document.createElement("form"),
	searchInput: document.createElement("input"),
	searchBoxSubmit: document.createElement("button"),
	searchBoxReset: document.createElement("button"),
	searchBoxLoadingIndicator: document.createElement("span"),
	searchBoxMobileFilter: document.createElement("div"),
	searchBoxFacetsWrapper: document.createElement("div"),
	clearFacetsWrapper: document.createElement("div"),
	selectedFactesWrapper: document.createElement("div"),
	searchBoxResultWrapper: document.createElement("div"),
	resultHeaderWrapper: document.createElement("div"),
	resultStatContainer: document.createElement("div"),
	resultChangeDisplayWrapper: document.createElement("div"),
	resultHeaderRightWrapper: document.createElement("div"),
	resultDisplayBlockWrapper: document.createElement("span"),
	resultDisplayListWrapper: document.createElement("span"),
	resultSortWrapper: document.createElement("div"),
	resultSortWrapperBtn: document.createElement("div"),
	resultSortContentWrapper: document.createElement("div"),
	resultContentWrapper: document.createElement("div"),
	resultPaginationContainer: document.createElement("div"),
	productResults: {},
	pageResults: {},
	blogResults: {},
	uniqueId: null,
	sessionID: null,
	channelId: null,
	noOfProducts: 20,
	noOfPages: 20,
	noOfBlogs: 20,
	outOfStock: null,
	showVendor: true,
	cssSelector: ".productlistingcont", // ".page-content",
	rvsClearRefinementBtn: null,
	rvsResultStatsText: null,
	renderHtmlFlag: false,
	typeSenseConfig: null,
	queryStringParams: {},
	sortItems: {},
	facetItems: {},
	facetBy: [],
	sortBy: [],
	page: 1,
	activeSortItem: "Relevance",
	instantSearchConfig: null,
	categorySearchConfig: null,
	tablePrefix: null,
	typeSenseClient: null,
	rvsInputRangeDiv: null,
	rvsPriceInputBox: null,
	rvsInputProgessDiv: null,
	displayView: "block",
	sliderGap: 0,
	priceRangeDragging: false,
	priceFilterValue: null,
	initialLoader: true,
	filterList: {},
	facetValues: {},
	analyticsURL: null,
	cssURL: null,
	APPURL: null,
	analyticsAutoCompleteDebounceTime: null,
	columnClass: "autoColumn",
	facetShowMore: {},
	currencyObj: null,
	tabFlag: false,
	activeTab: "Products",
	tabArray: [],
	searchQueryIndex: [],
	currentFacetTitle: "",
	productIds: "",
	currentPriceFacetAttribute: "price",
	cbProductRendered: new CustomEvent('cbProductRendered'),

	init: async (type) => {
		let loadSearch	= false,
			sortObject	= [],
			facetObject	= [],
			columnCount	= 2
		conversionBoxInstantCustomSearch.instantSearchConfig = window.conversionBoxSearch.config.instantSearch
		conversionBoxInstantCustomSearch.noOfProducts	= conversionBoxInstantCustomSearch.instantSearchConfig.noOfProducts ?? 20
		conversionBoxInstantCustomSearch.noOfBlogs	= conversionBoxInstantCustomSearch.instantSearchConfig.noOfBlogs ?? 20
		conversionBoxInstantCustomSearch.noOfPages	= conversionBoxInstantCustomSearch.instantSearchConfig.noOfPages ?? 20
		conversionBoxInstantCustomSearch.showVendor	= conversionBoxInstantCustomSearch.instantSearchConfig.showVendor ? conversionBoxInstantCustomSearch.instantSearchConfig.showVendor : false
		sortObject = conversionBoxInstantCustomSearch.instantSearchConfig.sort
		facetObject = conversionBoxInstantCustomSearch.instantSearchConfig.facet
		conversionBoxInstantCustomSearch.typeSenseConfig	= window.conversionBoxSearch.config.searchConfig
		conversionBoxInstantCustomSearch.channelId	= window.conversionBoxSearch.config.channelId
		conversionBoxInstantCustomSearch.uniqueId	= window.conversionBoxSearch.config.unique_id
		conversionBoxInstantCustomSearch.template	= typeof window.conversionBoxSearch.config.template !== "undefined" ? window.conversionBoxSearch.config.template : "bigImage"
		conversionBoxInstantCustomSearch.analyticsURL	= window.conversionBoxSearch.config.analyticsURL
		conversionBoxInstantCustomSearch.cssURL	= window.conversionBoxSearch.config.CSSURLIns
		conversionBoxInstantCustomSearch.APPURL	= window.conversionBoxSearch.config.APPURL
		columnCount	= typeof conversionBoxInstantCustomSearch.instantSearchConfig.gridColumnCount !== "undefined" ? conversionBoxInstantCustomSearch.instantSearchConfig.gridColumnCount : 0

		let currentFacets	= conversionBoxInstantCustomSearch.instantSearchConfig.facet ?? []
		for( let i = 0; i < currentFacets.length; i++ ){
			if( currentFacets[i].attribute === "effective_price" ){
				conversionBoxInstantCustomSearch.currentPriceFacetAttribute	= "effective_price"
				break;
			}
		}

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
			conversionBoxInstantCustomSearch.currencyObj	= currencies[currencyId]
		}else{
			conversionBoxInstantCustomSearch.currencyObj	= defaultCurrencyConfig
		}
		if( typeof conversionBoxInstantCustomSearch.instantSearchConfig.outOfStock !== 'undefined' ){
			conversionBoxInstantCustomSearch.outOfStock = conversionBoxInstantCustomSearch.instantSearchConfig.outOfStock
		}
		let indexConfig	= window.conversionBoxSearch.config.indexConfig
		if ( conversionBoxInstantCustomSearch.instantSearchConfig.status && ( indexConfig.index_products === "true" || indexConfig.index_pages === "true" || indexConfig.index_products === "true" ) && cbCustomPageType === "page" ) {
			loadSearch	= true
		}
		if( conversionBoxInstantCustomSearch.template === "bigImage" ){
			switch ( columnCount ){
				case 6:
					conversionBoxInstantCustomSearch.columnClass	= "sixthColumn"
					break;
				case 5:
					conversionBoxInstantCustomSearch.columnClass	= "fivethColumn"
					break;
				case 4:
					conversionBoxInstantCustomSearch.columnClass	= "fourthColumn"
					break;
				case 3:
					conversionBoxInstantCustomSearch.columnClass	= "thirdColumn"
					break;					
				case 2:
					conversionBoxInstantCustomSearch.columnClass	= "secondColumn"
					break;
				case 1:
					conversionBoxInstantCustomSearch.columnClass	= "oneColumn"
					break;
				default:
					conversionBoxInstantCustomSearch.columnClass	= "autoColumn"
					break;
			}
		}
		let data = await conversionBoxInstantCustomSearch.createTypeSenseClient()
		if ( loadSearch && data ) {
			if (!conversionBoxInstantCustomSearch.instantSearchWrapSelector) {				
				let wrapSeelctor	= document.createElement("div")
				wrapSeelctor.classList.add("roundViewInstantSearchWrapper")
				wrapSeelctor.id	= "roundViewInstantSearchWrapper"
				conversionBoxInstantCustomSearch.instantSearchWrapSelector	= wrapSeelctor;
				let pageContainer	= document.querySelector(conversionBoxInstantCustomSearch.cssSelector)
				if( pageContainer ){
					pageContainer.style.width	= "100%"
					pageContainer.appendChild(wrapSeelctor);
				}else{
					return
				}
			}
			for (let i = 0; i < sortObject.length; i++) {
				conversionBoxInstantCustomSearch.sortBy.push(sortObject[i].title)
				conversionBoxInstantCustomSearch.sortItems[sortObject[i].title] = sortObject[i]
			}
			for (let i = 0; i < facetObject.length; i++) {
				conversionBoxInstantCustomSearch.facetBy.push(facetObject[i].attribute)
				conversionBoxInstantCustomSearch.facetItems[facetObject[i].attribute] = facetObject[i]
			}
			//conversionBoxInstantCustomSearch.instantSearchWrapSelector.innerHTML	= `<div id=cbSearchResultSkeleton><div class="cbFiltersSidebar cbProductFilters"><div class="cbSkeletonCard cbProductFiltersBlock"><div class=cbProductFiltersTitle><span class="cbSkeletonText cbFullWidth"></span></div><div class=cbProductFiltersList><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><div class="cbSkeletonCard cbProductFiltersBlock"><div class=cbProductFiltersTitle><span class="cbSkeletonText cbFullWidth"></span></div><div class=cbProductFiltersList><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><div class="cbSkeletonCard cbProductFiltersBlock"><div class=cbProductFiltersTitle><span class="cbSkeletonText cbFullWidth"></span></div><div class=cbProductFiltersList><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div></div><div class=cbSearchResultMainWrapper><div class="cbGridMode cbThreeColumns"id=cbSearchResultsWrapper><ul class=cbSearchResultContent><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div></ul></div></div></div><style>@keyframes cbSkeletonAnim { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } } #cbSearchResultSkeleton * { box-sizing: border-box; } #cbSearchResultSkeleton .cbSkeletonCard { padding: 10px; border: 1px solid #eee; } #cbSearchResultSkeleton .cbSkeletonText { height: 8px; background: #eee; border-radius: 3px; display: inline-block; animation: cbSkeletonAnim 2s infinite; } #cbSearchResultSkeleton .cbSkeletonText.cbFullWidth:last-child { width: 100%; } #cbSearchResultSkeleton .cbSkeletonText.cbFullWidth:first-child:not(:last-child) { width: 80%; } #cbSearchResultSkeleton .cbSkeletonText.cbFullWidth:nth-child(2):not(:last-child) { width: 95%; } #cbSearchResultSkeleton .cbSkeletonText.cbFullWidth:last-child:not(:first-child) { width: 60%; } #cbSearchResultSkeleton .cbFiltersSidebar { float: left; width: 225px; } #cbSearchResultSkeleton .cbFiltersSidebar > .cbSkeletonCard:not(:last-child) { border-bottom: none; } #cbSearchResultSkeleton .cbFiltersSidebar .cbProductFiltersTitle { padding: 4px 0 12px 0; } #cbSearchResultSkeleton .cbFiltersSidebar .cbProductFiltersTitle > span.cbFullWidth { width: 40%; } #cbSearchResultSkeleton .cbFiltersSidebar .cbProductFiltersList > span { margin: 1px 0 12px 0; } #cbSearchResultSkeleton .cbFiltersSidebar .cbProductFiltersList > span:last-child { margin-bottom: 10px; } #cbSearchResultSkeleton .cbSearchResultMainWrapper { margin-left: 225px; } #cbSearchResultSkeleton ul.cbSearchResultContent { margin: 0 0 0 -1%; padding: 0 0 0 20px; list-style: none; white-space: nowrap; } #cbSearchResultSkeleton ul.cbSearchResultContent > li { display: inline-block; } #cbSearchResultSkeleton .cbThreeColumns ul.cbSearchResultContent > li { width: 30.3%; width: calc(100%/3 - 2%); } #cbSearchResultSkeleton li.cbProducts { cursor: pointer; margin: 0 1% 2%; white-space: normal; } #cbSearchResultSkeleton li.cbProducts .cbThumbnailWrap { position: relative; } #cbSearchResultSkeleton li.cbProducts .cbThumbnailWrap .cbThumbnail { margin: -10px -10px 0px -10px; background: #eee; height: 180px; } #cbSearchResultSkeleton li.cbProducts .cbOverhidden { padding-bottom: 20px; text-align: center; } #cbSearchResultSkeleton li.cbProducts .cbOverhidden > span { margin: 15px 0 0 0; } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:nth-child(4), #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:nth-child(5) { display: none; } /* Tablet view 2-column mode */ @media (min-width: 768px) and (max-width: 910px) { #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts { width: 46%; width: calc(50% - 10px); min-width: 160px; margin: 0 5px 10px; } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:nth-child(3) { display: none; } } /* Mobile view 2-column mode */ @media (max-width: 768px) { #cbSearchResultSkeleton .cbFiltersSidebar { display: none; } #cbSearchResultSkeleton .cbSearchResultMainWrapper { margin-left: 0; } #cbSearchResultSkeleton ul.cbSearchResultContent { margin: 0; padding: 0; } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:nth-child(3) { display: none; } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts { width: 46%; width: calc(50% - 10px); min-width: 160px; margin: 0 5px 10px; } } /* Mobile view one-column mode */ @media (max-width: 370px) { #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts { width: 96%; width: calc(100% - 10px); } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:not(:first-child) { display: none; } }</style>`
			if (conversionBoxInstantCustomSearch.cssURL) {
				await conversionBoxInstantCustomSearch.addLinkToHead(conversionBoxInstantCustomSearch.cssURL)
				if( conversionBoxInstantCustomSearch.APPURL ){
					await conversionBoxInstantCustomSearch.addLinkToHead(conversionBoxInstantCustomSearch.APPURL+"/api/css/instantsearch/"+conversionBoxInstantCustomSearch.uniqueId)
				}
			}
			conversionBoxInstantCustomSearch.instantSearchWrapSelector.innerHTML = ''
			//await conversionBoxInstantCustomSearch.renderHtml()			
			//conversionBoxInstantCustomSearch.initateSearch()
			
		}
	},

	fetchVechileFitmentProducts: async(productIds) => {
		if( cbCustomRenderFlag ){
			conversionBoxInstantCustomSearch.productIds	= productIds
			await conversionBoxInstantCustomSearch.renderHtml()
			conversionBoxInstantCustomSearch.initateSearch()
		}
	},

	addLinkToHead: async (href) => {
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

	renderHtml: async () => {
		const queryString = window.location.search;
		queryString.substring(1).split('&').forEach(pair => {
			const [key, value] = pair.split('=');
			conversionBoxInstantCustomSearch.queryStringParams[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : "";
		});
		console.log(conversionBoxInstantCustomSearch.renderHtmlFlag, "Render Html Flag")
		if( !conversionBoxInstantCustomSearch.renderHtmlFlag ){
			conversionBoxInstantCustomSearch.instantSearchPageElement.classList.add("rvsResultPageWrapper")
			conversionBoxInstantCustomSearch.instantSearchPageElement.classList.add(conversionBoxInstantCustomSearch.template)
			// conversionBoxInstantCustomSearch.instantSearchPageH1Element.classList.add("rvsHeaderH1")
			conversionBoxInstantCustomSearch.inputWrapper.classList.add("rvsInputWrapper")
			// conversionBoxInstantCustomSearch.searchBoxWrapper.classList.add("rvsSearchBoxWrapper")
			// conversionBoxInstantCustomSearch.searchBoxInner.classList.add("rvsSearchBoxInner")
			// conversionBoxInstantCustomSearch.searchBoxForm.classList.add("rvsSearchBoxForm")
			// conversionBoxInstantCustomSearch.searchBoxForm.setAttribute("role", "search")
			// conversionBoxInstantCustomSearch.searchInput.classList.add("rvsSearchBoxInput")
			// conversionBoxInstantCustomSearch.searchInput.setAttribute("type", "text")
			// conversionBoxInstantCustomSearch.searchInput.setAttribute("placeholder", "Search")
			// conversionBoxInstantCustomSearch.searchInput.setAttribute("placeholder", "Search for products")
			// conversionBoxInstantCustomSearch.searchInput.setAttribute("autocomplete", "off")
			// conversionBoxInstantCustomSearch.searchInput.setAttribute("autocapitalize", "off")
			// conversionBoxInstantCustomSearch.searchInput.setAttribute("spellcheck", "false")
			// conversionBoxInstantCustomSearch.searchInput.setAttribute("maxlength", "512")
			// conversionBoxInstantCustomSearch.searchBoxSubmit.classList.add("rvsSearchBoxSubmit")
			// conversionBoxInstantCustomSearch.searchBoxSubmit.setAttribute("title", "Submit the search query.")
			// conversionBoxInstantCustomSearch.searchBoxSubmit.setAttribute("type", "button")
			// conversionBoxInstantCustomSearch.searchBoxSubmit.innerHTML = `<svg class="rvsSearchBoxSubmitIcon" width="10" height="10" viewBox="0 0 40 40" aria-hidden="true"><path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path></svg>`
			// conversionBoxInstantCustomSearch.searchBoxReset.classList.add("rvsSearchBoxReset")
			// conversionBoxInstantCustomSearch.searchBoxReset.setAttribute("title", "Clear the search query.")
			// conversionBoxInstantCustomSearch.searchBoxReset.setAttribute("type", "reset")
			// conversionBoxInstantCustomSearch.searchBoxReset.setAttribute("hidden", "")
			// conversionBoxInstantCustomSearch.searchBoxReset.innerHTML = `<svg class="rvsSearchBoxResetIcon" viewBox="0 0 20 20" width="10" height="10" aria-hidden="true"><path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"></path></svg>`
			// conversionBoxInstantCustomSearch.searchBoxLoadingIndicator.classList.add("rvsLoadingIndicator")
			// conversionBoxInstantCustomSearch.searchBoxLoadingIndicator.innerHTML = `<svg class="rvsSearchBoxLoadingIcon" width="16" height="16" viewBox="0 0 38 38" stroke="#444" aria-hidden="true"><g fill="none" fillRule="evenodd"><g transform="translate(1 1)" strokeWidth="2"><circle strokeOpacity=".5" cx="18" cy="18" r="18"></circle><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform></path></g></g></svg>`
			// conversionBoxInstantCustomSearch.searchBoxLoadingIndicator.setAttribute("hidden", "")
			conversionBoxInstantCustomSearch.searchBoxMobileFilter.classList.add("rvsFacetsMobileBtn")
			conversionBoxInstantCustomSearch.searchBoxMobileFilter.innerHTML = `Filters`
			conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.classList.add("rvsFacetsWrapper")
			let facetMobileHeaderWrapper	= document.createElement("div"),
				facetMobileCloseBtn	= document.createElement("button"),
				facetMobileHeader	= document.createElement("div"),
				rvFacetMobileBottom	= document.createElement("div"),
				rvsMobileFacetFilterBtn	= document.createElement("button"),
				rvsMobileClearBtn	= document.createElement("button");
			facetMobileHeaderWrapper.classList.add("rvFacetMobileHeadWrap")
			facetMobileHeader.classList.add("rvFacetMobileHeading")
			facetMobileHeader.innerHTML	= "Filters"
			facetMobileCloseBtn.classList.add("facetMobileCloseBtn")
			rvFacetMobileBottom.classList.add("rvFacetMobileBottom")
			rvsMobileFacetFilterBtn.classList.add("rvsMobileFacetFilterBtn")
			rvsMobileClearBtn.classList.add("rvsMobileClearBtn")
			rvsMobileFacetFilterBtn.innerHTML	= "Done"
			rvsMobileClearBtn.innerHTML	= "Clear"
			rvFacetMobileBottom.appendChild(rvsMobileClearBtn)
			rvFacetMobileBottom.appendChild(rvsMobileFacetFilterBtn)
			conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.appendChild(facetMobileHeaderWrapper)
			conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.appendChild(rvFacetMobileBottom)
			facetMobileHeaderWrapper.appendChild(facetMobileHeader)
			facetMobileHeaderWrapper.appendChild(facetMobileCloseBtn)
			conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.setAttribute("hidden", "")
			// conversionBoxInstantCustomSearch.clearFacetsWrapper.classList.add("rvsClearFacetsWrapper")
			// conversionBoxInstantCustomSearch.clearFacetsWrapper.innerHTML = `<div class="rvsControls rvsControlNoRefinement" hidden><div class="rvsControlBody"><div><div class="rvsClearRefinements"><button class="rvsClearRefinementBtn rvsClearRefinementBtnDisabled" disabled>Clear all</button></div></div></div></div>`
			conversionBoxInstantCustomSearch.selectedFactesWrapper.classList.add("rvsSelectedFacetWrapper")
			conversionBoxInstantCustomSearch.selectedFactesWrapper.innerHTML = `<div class="rvsControls rvsControlNoRefinement" hidden><div class="rvsControlBody"><div><div class="rvsSelectedValuesHeader rvsFacetHeader rvsHeader">Selected Filter <button class="rvsClearRefinementBtn rvsClearRefinementBtnDisabled" disabled>Clear all</button></div><div class="rvsRoot rvsSelectedValues rvsFacetsWrap"><ul class="rvsSelectedValuesList"></ul></div></div></div></div>`
			conversionBoxInstantCustomSearch.searchBoxResultWrapper.classList.add("rvsSearchBox")
			conversionBoxInstantCustomSearch.resultHeaderWrapper.classList.add("rvsResultHeaderWrapper")
			conversionBoxInstantCustomSearch.resultHeaderWrapper.setAttribute("hidden", "")
			conversionBoxInstantCustomSearch.resultStatContainer.classList.add("rvsResultStatContainer")
			conversionBoxInstantCustomSearch.resultStatContainer.innerHTML = `<div class="rvsResultStatWrapper"><span class="rvsResultStatText"></span></div>`
			conversionBoxInstantCustomSearch.resultHeaderRightWrapper.classList.add("resultHeaderRightWrapper")
			conversionBoxInstantCustomSearch.resultHeaderRightWrapper.classList.add("alignCenter")
			conversionBoxInstantCustomSearch.resultChangeDisplayWrapper.classList.add("rvsResultDisplayWrapper")
			conversionBoxInstantCustomSearch.resultDisplayBlockWrapper.classList.add("rvsResultDisplayBlock")
			conversionBoxInstantCustomSearch.resultDisplayBlockWrapper.classList.add("rvsResultDisplaySelected")
			conversionBoxInstantCustomSearch.resultDisplayBlockWrapper.innerHTML = `<svg enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="grid-2"><path d="M10.246,4.228c0-0.547-0.443-0.991-0.99-0.991H3.914c-0.548,0-0.991,0.443-0.991,0.991V9.57   c0,0.546,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.444,0.99-0.99V4.228z" fill="currentcolor"/><path d="M19.453,4.228c0-0.547-0.443-0.991-0.991-0.991h-5.343c-0.546,0-0.99,0.443-0.99,0.991V9.57   c0,0.546,0.444,0.99,0.99,0.99h5.343c0.548,0,0.991-0.444,0.991-0.99V4.228z" fill="currentcolor"/><path d="M28.868,4.228c0-0.547-0.443-0.991-0.99-0.991h-5.342c-0.548,0-0.991,0.443-0.991,0.991V9.57   c0,0.546,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.444,0.99-0.99V4.228z" fill="currentcolor"/><path d="M10.246,13.224c0-0.547-0.443-0.99-0.99-0.99H3.914c-0.548,0-0.991,0.443-0.991,0.99v5.342   c0,0.549,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.441,0.99-0.99V13.224z" fill="currentcolor"/><path d="M19.453,13.224c0-0.547-0.443-0.99-0.991-0.99h-5.343c-0.546,0-0.99,0.443-0.99,0.99v5.342   c0,0.549,0.444,0.99,0.99,0.99h5.343c0.548,0,0.991-0.441,0.991-0.99V13.224z" fill="currentcolor"/><path d="M28.868,13.224c0-0.547-0.443-0.99-0.99-0.99h-5.342c-0.548,0-0.991,0.443-0.991,0.99v5.342   c0,0.549,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.441,0.99-0.99V13.224z" fill="currentcolor"/><path d="M10.246,22.43c0-0.545-0.443-0.99-0.99-0.99H3.914c-0.548,0-0.991,0.445-0.991,0.99v5.344   c0,0.547,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.443,0.99-0.99V22.43z" fill="currentcolor"/><path d="M19.453,22.43c0-0.545-0.443-0.99-0.991-0.99h-5.343c-0.546,0-0.99,0.445-0.99,0.99v5.344   c0,0.547,0.444,0.99,0.99,0.99h5.343c0.548,0,0.991-0.443,0.991-0.99V22.43z" fill="currentcolor"/><path d="M28.868,22.43c0-0.545-0.443-0.99-0.99-0.99h-5.342c-0.548,0-0.991,0.445-0.991,0.99v5.344   c0,0.547,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.443,0.99-0.99V22.43z" fill="currentcolor"/></g></svg>`
			conversionBoxInstantCustomSearch.resultDisplayListWrapper.classList.add("rvsResultDisplayList")
			conversionBoxInstantCustomSearch.resultDisplayListWrapper.innerHTML = `<svg height="32" id="svg2" version="1.1" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs6"/><g id="g10" transform="matrix(1.3333333,0,0,-1.3333333,0,32)"><path d="M 6.4124,16.292783 H 18.411669" id="path168" style="fill:currentcolor;stroke:currentcolor;stroke-width:0.77399999;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m 6.4124,12.110025 h 8.205209" id="path170" style="fill:currentcolor;stroke:currentcolor;stroke-width:0.77399999;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m 6.4124,7.9272666 h 4.424821" id="path981" style="fill:currentcolor;stroke:currentcolor;stroke-width:0.77399999;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>`
			conversionBoxInstantCustomSearch.resultSortWrapper.classList.add("rvsSortWrapper")
			conversionBoxInstantCustomSearch.resultSortWrapperBtn.classList.add("resultSortWrapperBtn")
			conversionBoxInstantCustomSearch.resultSortWrapperBtn.id	= "resultSortWrapperBtn"
			conversionBoxInstantCustomSearch.resultSortWrapperBtn.innerHTML	= `<span>Relevance</span><svg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9.87998 1.29L5.99998 5.17L2.11998 1.29C1.72998 0.899998 1.09998 0.899998 0.70998 1.29C0.31998 1.68 0.31998 2.31 0.70998 2.7L5.29998 7.29C5.68998 7.68 6.31998 7.68 6.70998 7.29L11.3 2.7C11.69 2.31 11.69 1.68 11.3 1.29C10.91 0.909998 10.27 0.899998 9.87998 1.29Z' fill='currentcolor'/></svg>`
			conversionBoxInstantCustomSearch.resultSortContentWrapper.classList.add("resultSortContentWrapper")
			conversionBoxInstantCustomSearch.resultSortContentWrapper.id	= "resultSortContentWrapper"
			conversionBoxInstantCustomSearch.resultSortWrapper.appendChild(conversionBoxInstantCustomSearch.resultSortWrapperBtn)
			conversionBoxInstantCustomSearch.resultSortWrapper.appendChild(conversionBoxInstantCustomSearch.resultSortContentWrapper)
			conversionBoxInstantCustomSearch.resultContentWrapper.classList.add("rvsResultContentWrapper")
			conversionBoxInstantCustomSearch.resultContentWrapper.classList.add("rvsResultContentAsBlock")
			conversionBoxInstantCustomSearch.resultPaginationContainer.classList.add("rvsResultPaginationContainer")
			if( conversionBoxInstantCustomSearch.tabFlag ){
				conversionBoxInstantCustomSearch.instantSearchPageElement.appendChild(conversionBoxInstantCustomSearch.inputWrapper)
			}
			//conversionBoxInstantCustomSearch.inputWrapper.appendChild(conversionBoxInstantCustomSearch.searchBoxWrapper)
			//conversionBoxInstantCustomSearch.searchBoxWrapper.appendChild(conversionBoxInstantCustomSearch.searchBoxInner)
			//conversionBoxInstantCustomSearch.searchBoxInner.appendChild(conversionBoxInstantCustomSearch.searchBoxForm)
			//conversionBoxInstantCustomSearch.searchBoxForm.appendChild(conversionBoxInstantCustomSearch.searchInput)
			//conversionBoxInstantCustomSearch.searchBoxForm.appendChild(conversionBoxInstantCustomSearch.searchBoxSubmit)
			//conversionBoxInstantCustomSearch.searchBoxForm.appendChild(conversionBoxInstantCustomSearch.searchBoxReset)
			//conversionBoxInstantCustomSearch.searchBoxForm.appendChild(conversionBoxInstantCustomSearch.searchBoxLoadingIndicator)
			conversionBoxInstantCustomSearch.resultStatContainer.appendChild(conversionBoxInstantCustomSearch.searchBoxMobileFilter)
			if( conversionBoxInstantCustomSearch.tabFlag ){
				conversionBoxInstantCustomSearch.instantSearchPageElement.appendChild(conversionBoxInstantCustomSearch.resultHeaderWrapper)
			}
			conversionBoxInstantCustomSearch.instantSearchPageElement.appendChild(conversionBoxInstantCustomSearch.searchBoxFacetsWrapper)
			conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.appendChild(conversionBoxInstantCustomSearch.selectedFactesWrapper)
			for (let i = 0; i < conversionBoxInstantCustomSearch.facetBy.length; i++) {
				let currentFacetBy = conversionBoxInstantCustomSearch.facetBy[i],
					facetDownWrapper = document.createElement("div"),
					facetLabel = document.createElement("label"),
					facetInputCheckbox = document.createElement("input"),
					facetType = conversionBoxInstantCustomSearch.facetItems[currentFacetBy];
				currentFacetBy	= currentFacetBy.replace(/\./g, '_').replace(/ /g,'');
				facetItemContainer = document.createElement("div");
				facetDownWrapper.classList.add(`rvsFacetDownWrapper`)
				facetDownWrapper.classList.add(`rvsFacet${facetType.facetType.charAt(0).toUpperCase() + facetType.facetType.slice(1)}`)
				facetDownWrapper.classList.add(`rvFacet${currentFacetBy.charAt(0).toUpperCase() + currentFacetBy.slice(1)}`)
				facetLabel.classList.add(`rvsFacetHeader`)
				facetLabel.classList.add(`rvsHeader`)
				facetLabel.setAttribute("for", currentFacetBy)
				facetLabel.innerHTML = facetType.title
				if( ( facetType.attribute === "price" || facetType.attribute === "effective_price" ) && facetType.facetType === "slider" ){
					facetLabel.innerHTML += `, ${conversionBoxInstantCustomSearch.currencyObj.symbol}`
				}
				facetInputCheckbox.classList.add("rvsDropdownCheckbox")
				facetInputCheckbox.id = currentFacetBy
				facetInputCheckbox.setAttribute("type", "checkbox")
				if( conversionBoxInstantCustomSearch.uniqueId === "3873c9508c0a36c681df5e0b146b53268e079c3f166b4fa47f43b56701a522c9" && ( facetType.attribute !== "price" && facetType.attribute !== "effective_price" && facetType.attribute !== "brand" ) ){
					facetInputCheckbox.setAttribute("checked", true)
				}
				facetInputCheckbox.name = "dropdown"
				facetItemContainer.classList.add(`rvsFacet${currentFacetBy.charAt(0).toUpperCase() + currentFacetBy.slice(1)}Container`)
				facetItemContainer.classList.add(`rvsFacetDropdownContainer`)
				conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.appendChild(facetDownWrapper)
				facetDownWrapper.appendChild(facetInputCheckbox)
				facetDownWrapper.appendChild(facetLabel)			
				facetDownWrapper.appendChild(facetItemContainer)
			}
			conversionBoxInstantCustomSearch.instantSearchPageElement.appendChild(conversionBoxInstantCustomSearch.searchBoxResultWrapper)
			if( !conversionBoxInstantCustomSearch.tabFlag ){
				conversionBoxInstantCustomSearch.searchBoxResultWrapper.appendChild(conversionBoxInstantCustomSearch.resultHeaderWrapper)			
			}
			if( conversionBoxInstantCustomSearch.tabFlag ){
				conversionBoxInstantCustomSearch.resultHeaderWrapper.appendChild(conversionBoxInstantCustomSearch.resultStatContainer)
			}
			conversionBoxInstantCustomSearch.rvsResultStatsText	= document.querySelector('.rvsResultStatText');
			conversionBoxInstantCustomSearch.resultHeaderWrapper.appendChild(conversionBoxInstantCustomSearch.resultHeaderRightWrapper)
			if( !conversionBoxInstantCustomSearch.tabFlag ){
				conversionBoxInstantCustomSearch.resultHeaderRightWrapper.appendChild(conversionBoxInstantCustomSearch.inputWrapper)
				conversionBoxInstantCustomSearch.inputWrapper.appendChild(conversionBoxInstantCustomSearch.resultStatContainer)
			}
			conversionBoxInstantCustomSearch.resultHeaderRightWrapper.appendChild(conversionBoxInstantCustomSearch.resultChangeDisplayWrapper)
			conversionBoxInstantCustomSearch.resultChangeDisplayWrapper.appendChild(conversionBoxInstantCustomSearch.resultDisplayBlockWrapper)
			conversionBoxInstantCustomSearch.resultChangeDisplayWrapper.appendChild(conversionBoxInstantCustomSearch.resultDisplayListWrapper)
			conversionBoxInstantCustomSearch.resultHeaderRightWrapper.appendChild(conversionBoxInstantCustomSearch.resultSortWrapper)
			for (let i = 0; i < conversionBoxInstantCustomSearch.sortBy.length; i++) {
				let currentSortItem = conversionBoxInstantCustomSearch.sortBy[i],
					option = document.createElement("div");
				option.setAttribute("data-value", currentSortItem)
				option.innerHTML = currentSortItem
				conversionBoxInstantCustomSearch.resultSortContentWrapper.appendChild(option)
			}
			conversionBoxInstantCustomSearch.searchBoxResultWrapper.appendChild(conversionBoxInstantCustomSearch.resultContentWrapper)
			conversionBoxInstantCustomSearch.instantSearchPageElement.appendChild(conversionBoxInstantCustomSearch.resultPaginationContainer)
			conversionBoxInstantCustomSearch.instantSearchWrapSelector.appendChild(conversionBoxInstantCustomSearch.instantSearchPageElement)
			conversionBoxInstantCustomSearch.reAdjust()
			window.addEventListener("resize", conversionBoxInstantCustomSearch.reAdjust)
			conversionBoxInstantCustomSearch.resultDisplayBlockWrapper.addEventListener("click", () => conversionBoxInstantCustomSearch.changeRvsProductView("block"))
			conversionBoxInstantCustomSearch.resultDisplayListWrapper.addEventListener("click", () => conversionBoxInstantCustomSearch.changeRvsProductView("list"))
			conversionBoxInstantCustomSearch.searchBoxMobileFilter.addEventListener("click", conversionBoxInstantCustomSearch.toggleMobileFilters)
			facetMobileCloseBtn.addEventListener("click", conversionBoxInstantCustomSearch.toggleMobileFilters)
			rvsMobileFacetFilterBtn.addEventListener("click", conversionBoxInstantCustomSearch.toggleMobileFilters)
			rvsMobileClearBtn.addEventListener("click", conversionBoxInstantCustomSearch.clearAllFilterEvent)
			conversionBoxInstantCustomSearch.searchBoxForm.addEventListener("submit", conversionBoxInstantCustomSearch.stopSubmitEvent)
			document.addEventListener("click", conversionBoxInstantCustomSearch.documentButtonClick)
			let sortContentWrapperDiv	= conversionBoxInstantCustomSearch.resultSortContentWrapper.querySelectorAll("div")
			sortContentWrapperDiv.forEach((item) => {
				item.addEventListener("click", conversionBoxInstantCustomSearch.changeSortOrder)
			})
		}
		conversionBoxInstantCustomSearch.renderHtmlFlag = true
	},

	toggleMobileFilters: (e) => {
		if( conversionBoxInstantCustomSearch.searchBoxFacetsWrapper ){
			if( conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.style.display === "flex" ){				
				document.body.style.overflow = 'auto';
				conversionBoxInstantCustomSearch.searchBoxMobileFilter.innerHTML	= "Filters"
				conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.style.display	= "none"
			}else{
				document.body.style.overflow = 'hidden';
				document.querySelectorAll('.rvsDropdownCheckbox').forEach(function(checkbox) {
					checkbox.checked = true;
				});
				conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.style.display	= "flex"
				conversionBoxInstantCustomSearch.searchBoxMobileFilter.innerHTML	= "Filters"
			}
		}
	},

	stopSubmitEvent: (e) => {
		e.preventDefault()
	},

	reAdjust: () => {
		const width = conversionBoxInstantCustomSearch.searchBoxResultWrapper.offsetWidth;
		let minWidth	= 245
		if( conversionBoxInstantCustomSearch.template === "design1" || conversionBoxInstantCustomSearch.template === "design2" ){
			minWidth	= 190
		}
		if( conversionBoxInstantCustomSearch.columnClass === "autoColumn" && width > 540 ){
			let twoPercentWidth	= ( ( width / 100 ) * 2 ) + minWidth,
				noOfColumns	= ( Math.floor( width / twoPercentWidth ) <= 8 ) ? Math.floor( width / twoPercentWidth ) : 8,
				listWidth	= parseFloat( ( 100 / noOfColumns ).toFixed(2) ) - 2
			if( noOfColumns === 6 || noOfColumns === 7 ){
				listWidth	-= 0.1
			}
			let rvsResultListItem 	= document.querySelectorAll("li.rvsResultListItem")
			rvsResultListItem.forEach((item) => item.style.width = listWidth + "%")
		}
		
		if( window.innerWidth < 820 ){
			conversionBoxInstantCustomSearch.instantSearchWrapSelector.classList.add('rvsResultMobileDesign');
		}else{
			conversionBoxInstantCustomSearch.instantSearchWrapSelector.classList.remove('rvsResultMobileDesign');
		}

		if( width > 540 ){
			document.body.style.overflow	= "auto"
			if( conversionBoxInstantCustomSearch.searchBoxFacetsWrapper && conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.style.display	=== "none" ){
				conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.style.display	= "flex"
			}
		}
	},

	groupParamsIntoArrays: (url) => {
		const params = new URLSearchParams(url.split('?')[1]);
		const groupedParams = {};

		for (const [key, value] of params.entries()) {
			const matches = key.match(/\[([^\]]+)\]/g);

			if (matches) {
				const mainKey = key.split('[')[0];
				const subKey = matches[0].substring(1, matches[0].length - 1);

				if (!groupedParams[mainKey]) {
					groupedParams[mainKey] = {};
				}

				if (!groupedParams[mainKey][subKey]) {
					groupedParams[mainKey][subKey] = [];
				}

				groupedParams[mainKey][subKey].push(value);
			} else {
				groupedParams[key] = value;
			}
		}

		return groupedParams;
	},

	initateSearch: async() => {
		if (typeof conversionBoxInstantCustomSearch.queryStringParams["page"] !== "undefined") {
			conversionBoxInstantCustomSearch.page = conversionBoxInstantCustomSearch.queryStringParams["page"]
		}
		
		if (typeof conversionBoxInstantCustomSearch.queryStringParams["sort_by"] !== "undefined") {
			conversionBoxInstantCustomSearch.activeSortItem = conversionBoxInstantCustomSearch.queryStringParams["sort_by"]
		}
		if (typeof conversionBoxInstantCustomSearch.queryStringParams["price_range"] !== "undefined") {
			conversionBoxInstantCustomSearch.priceFilterValue = conversionBoxInstantCustomSearch.queryStringParams["price_range"]
		}
		
		let filterByQuery = conversionBoxInstantCustomSearch.groupParamsIntoArrays(window.location.href)
		conversionBoxInstantCustomSearch.filterList = { ...filterByQuery.filter_by }	
		await conversionBoxInstantCustomSearch.findProducts()
		conversionBoxInstantCustomSearch.renderSelectedFilter()
	},

	createTypeSenseClient: async () => {
		let config = conversionBoxInstantCustomSearch.typeSenseConfig
		conversionBoxInstantCustomSearch.tablePrefix = config.tablePrefix;
		try {
			conversionBoxInstantCustomSearch.typeSenseClient = new Typesense.Client({
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
		} catch (e) {
			console.error(e)
		}
	},

	getFlipImage: (product) => {
		if( conversionBoxInstantCustomSearch.instantSearchConfig && conversionBoxInstantCustomSearch.instantSearchConfig.flipImageHover ){
			for( let i = 0; i < product.product_images.length; i++ ){
				if( product.image !== product.product_images[i] ){
					return	`<img src="${product.product_images[i]}" alt="${product.name}" class="rvSRItemImage rvSRFlipImage" border="0" loading="lazy" />`
				}
			}
		}
		return ""
	},

	findProducts: async () => {
		cbCustomFindProductFlag	= true;
		let currentSortObject = conversionBoxInstantCustomSearch.sortItems[conversionBoxInstantCustomSearch.activeSortItem],
			searchParameters = { q: "", typo_tokens_threshold: 1, num_typos: 2, min_len_1typo: 4, min_len_2typo: 4, per_page: conversionBoxInstantCustomSearch.noOfProducts, query_by: "name,description,categories,sku", page: conversionBoxInstantCustomSearch.page, max_facet_values: 1000 };
		searchParameters["facet_by"] = conversionBoxInstantCustomSearch.facetBy;
		if (currentSortObject && typeof currentSortObject !== "undefined") {
			searchParameters["sort_by"] = `${currentSortObject.attribute}:${currentSortObject.sort}`
		}
		let requestQuery = `channel_ids:=[${conversionBoxInstantCustomSearch.channelId}] && is_visible:=1 && product_id:=[${conversionBoxInstantCustomSearch.productIds}]`

		if( conversionBoxInstantCustomSearch.outOfStock !== null && conversionBoxInstantCustomSearch.outOfStock === false ){
			requestQuery	+= ` && in_stock:=1`
		}

		for (let [key, value] of Object.entries(conversionBoxInstantCustomSearch.filterList)) {
			if (conversionBoxInstantCustomSearch.facetBy.indexOf(key) !== -1) {
				let facetType = conversionBoxInstantCustomSearch.facetItems[key].facetType
				if (facetType === "conjunctive") {
					for (let i = 0; i < value.length; i++) {
						if (requestQuery !== "") {
							requestQuery += " && "
						}
						requestQuery += `${key}:=${value[i]}`
					}
				} else if (facetType === "disjunctive") {
					if (value.length > 0) {
						if (requestQuery !== "") {
							requestQuery += " && "
						}
						requestQuery += " ( "
						for (let i = 0; i < value.length; i++) {
							if (i > 0) {
								requestQuery += " || "
							}
							requestQuery += `${key}:=${value[i]}`
						}
						requestQuery += " ) "
					}
				}
			}
		}
		if (conversionBoxInstantCustomSearch.priceFilterValue !== null) {
			if (requestQuery !== "") {
				requestQuery += `&& `
			}
			let splitPriceFilter	= conversionBoxInstantCustomSearch.priceFilterValue.split(".."),
				minPrice	= parseInt(conversionBoxInstantCustomSearch.revertPrice(splitPriceFilter[0])),
				maxPrice	= parseInt(conversionBoxInstantCustomSearch.revertPrice(splitPriceFilter[1]))
			requestQuery += `${conversionBoxInstantCustomSearch.currentPriceFacetAttribute}:[${minPrice}..${maxPrice}]`
		}
		searchParameters['filter_by'] = requestQuery
		let searchResults	= await conversionBoxInstantCustomSearch.typeSenseClient.collections(`${conversionBoxInstantCustomSearch.tablePrefix}products`).documents().search(searchParameters);
		conversionBoxInstantCustomSearch.rvsResultStatsText = document.querySelector('.rvsResultStatText')
		conversionBoxInstantCustomSearch.productResults[searchResults.page]	= searchResults
		await conversionBoxInstantCustomSearch.renderProducts()
	},

	renderProducts: async() => {
		let searchResults		= conversionBoxInstantCustomSearch.productResults[conversionBoxInstantCustomSearch.page],
			facetByAnalytics	= {...conversionBoxInstantCustomSearch.filterList},
			query = conversionBoxInstantCustomSearch.queryStringParams["q"] ? conversionBoxInstantCustomSearch.queryStringParams["q"] : "",
			currentSortObject = conversionBoxInstantCustomSearch.sortItems[conversionBoxInstantCustomSearch.activeSortItem]
		if( conversionBoxInstantCustomSearch.priceFilterValue ){
			facetByAnalytics["price_filter"]	= conversionBoxInstantCustomSearch.priceFilterValue
		}
		conversionBoxInstantCustomSearch.resultHeaderWrapper.removeAttribute("hidden")
		conversionBoxInstantCustomSearch.searchBoxFacetsWrapper.removeAttribute("hidden")
		conversionBoxInstantCustomSearch.resultContentWrapper.innerHTML = ""
		if (searchResults.hits.length === 0) {
			conversionBoxInstantCustomSearch.resultContentWrapper.innerHTML = `<div class="rvsRecords rvsRecordsEmpty"><div class="rvsRecordEmpty"><div class="rvsRecordEmptyTitle">Sorry, no compatible fitments were found for this vehicle.</div></div></div>`
			if (conversionBoxInstantCustomSearch.rvsResultStatsText) {
				conversionBoxInstantCustomSearch.rvsResultStatsText.innerHTML = `No result found in ${searchResults.search_time_ms}ms`
			}
			return
		}
		if (searchResults.hits.length > 1) {
			if (conversionBoxInstantCustomSearch.rvsResultStatsText) {
				conversionBoxInstantCustomSearch.rvsResultStatsText.innerHTML = `${((searchResults.page - 1) * searchResults.request_params.per_page) + 1} - ${(searchResults.found > (((searchResults.page - 1) * searchResults.request_params.per_page) + searchResults.request_params.per_page)) ? (((searchResults.page - 1) * searchResults.request_params.per_page) + searchResults.request_params.per_page) : searchResults.found} out of <span class="rvsStatsNoResults"> ${searchResults.found} results found</span> in ${searchResults.search_time_ms}ms`
			}
		} else {
			if (conversionBoxInstantCustomSearch.rvsResultStatsText) {
				conversionBoxInstantCustomSearch.rvsResultStatsText.innerHTML = `<span class="rvsStatsNoResults"> ${searchResults.found} results found</span> in ${searchResults.search_time_ms}ms`
			}
		}
		let aiResultWrapper = document.createElement("div"),
			aiResultListWrap = document.createElement("ol")
		aiResultWrapper.classList.add("rvsResultWrapper")
		aiResultListWrap.classList.add("rvResultListWrap")
		aiResultListWrap.classList.add(conversionBoxInstantCustomSearch.columnClass)
		aiResultListWrap.classList.add(conversionBoxInstantCustomSearch.template)
		//roundViewInstantSearch.instantSearchPageElement.classList.add(roundViewInstantSearch.template)
		conversionBoxInstantCustomSearch.resultContentWrapper.appendChild(aiResultWrapper)
		aiResultWrapper.appendChild(aiResultListWrap)
		let intermediateResults = searchResults.hits;
		for (let i = 0; i < intermediateResults.length; i++) {
			let aiResultListItem = document.createElement("li"),
				val = intermediateResults[i],
				valDocument	= val.document
			aiResultListItem.classList.add("rvsResultListItem")
			aiResultListItem.setAttribute("data-product-id", valDocument.id)
			aiResultListItem.innerHTML	= `
														<a href="${valDocument.url}" class="rvSRProductLink" draggable="false">
															<div class="rvSRItem">
																<div class="rvSRThumnailWrapper">
																	<span class="rvSRThumbnail">
																		<img src="${valDocument.image ? valDocument.image : "https://storage.googleapis.com/roundclicksview/No%20Product%20Image%20Available.png"}" class="rvSRItemImage " alt="" border="0" loading="lazy">
																		`+conversionBoxInstantCustomSearch.getFlipImage(valDocument)+`
																	</span>
																</div>
																<span class="rvSROverHidden">
																	<span class="rvSRTitle" style="-webkit-line-clamp: ${( conversionBoxInstantCustomSearch.instantSearchConfig && conversionBoxInstantCustomSearch.instantSearchConfig.titleMaxLines ) ? conversionBoxInstantCustomSearch.instantSearchConfig.titleMaxLines : 2 };">${valDocument.name}</span>
																	${( ( conversionBoxInstantCustomSearch.instantSearchConfig && conversionBoxInstantCustomSearch.instantSearchConfig.showVendor ) && valDocument.brand ) ?
																		`<span class="rvSRBrand">By ${valDocument.brand}</span>`
																	:
																		""
																	}
																	${( conversionBoxInstantCustomSearch.instantSearchConfig && conversionBoxInstantCustomSearch.instantSearchConfig.showDescription && valDocument.description ) ?
																		`<span class="rvSRDescription" style="-webkit-line-clamp: ${conversionBoxInstantCustomSearch.instantSearchConfig.titleMaxLines};">${valDocument.description}</span>`
																	:
																		""
																	}
																	${( conversionBoxInstantCustomSearch.instantSearchConfig && conversionBoxInstantCustomSearch.instantSearchConfig.showSKU && valDocument.sku ) ? `<div class="rvSRSKU">${valDocument.sku}</div>`: ""}
																	${ conversionBoxInstantCustomSearch.instantSearchConfig && ( typeof conversionBoxInstantCustomSearch.instantSearchConfig.showPrice === "undefined" || conversionBoxInstantCustomSearch.instantSearchConfig.showPrice ) ?
																		`<div class="rvSRPriceList">
																			<span class="rvSRPrice">`+conversionBoxInstantCustomSearch.formatPrice(valDocument)+`</span>
																		</div>`
																	:
																		""
																	}
																	<button class="rvSRButton rvSRActionButton rvSRAddToCartButton">Add to cart</button>
																</span>
															</div>
														</a>
													`
			aiResultListWrap.appendChild(aiResultListItem)
		}
		conversionBoxInstantCustomSearch.updateDisplayProductView(conversionBoxInstantCustomSearch.displayView)
		document.dispatchEvent(conversionBoxInstantCustomSearch.cbProductRendered)
		conversionBoxInstantCustomSearch.resultPaginationContainer.innerHTML = ``
		if (searchResults.found > conversionBoxInstantCustomSearch.noOfProducts) {
			let totalPages = Math.ceil(searchResults.found / conversionBoxInstantCustomSearch.noOfProducts),
				currentUrl = window.location.href,
				searchParams = new URLSearchParams(window.location.search),
				page = searchResults.page,
				startPage = page - 2,
				endPage = page + 2;
			if (startPage < 1) {
				startPage = 1;
				endPage = Math.min(totalPages, startPage + 4);
			}

			if (endPage > totalPages) {
				endPage = totalPages;
				startPage = Math.max(1, endPage - 4);
			}
			let rvsPaginationWrapper = document.createElement("div"),
				rvsPaginationList = document.createElement("ul"),
				rvsPaginationFirstPage = document.createElement("li"),
				rvsPaginationPreviousPage = document.createElement("li"),
				rvsPaginationLastPage = document.createElement("li"),
				rvsPaginationNextPage = document.createElement("li")
			rvsPaginationWrapper.classList.add("rvsPaginationWrapper")
			rvsPaginationList.classList.add("rvsPaginationList")
			rvsPaginationFirstPage.classList.add("rvsPaginationItem")
			rvsPaginationFirstPage.classList.add("rvsPaginationItemFirstPage")
			rvsPaginationPreviousPage.classList.add("rvsPaginationItem")
			rvsPaginationPreviousPage.classList.add("rvsPaginationItemPreviousPage")
			rvsPaginationLastPage.classList.add("rvsPaginationItem")
			rvsPaginationLastPage.classList.add("rvsPaginationItemLastPage")
			rvsPaginationNextPage.classList.add("rvsPaginationItem")
			rvsPaginationNextPage.classList.add("rvsPaginationItemNextPage")
			if (page === 1) {
				rvsPaginationFirstPage.classList.add("rvsPaginationItemDisabled")
				rvsPaginationPreviousPage.classList.add("rvsPaginationItemDisabled")
				rvsPaginationFirstPage.innerHTML = `<span class="rvsPaginationLink" aria-label="First">«</span>`
				rvsPaginationPreviousPage.innerHTML = `<span class="rvsPaginationLink" aria-label="Previous">‹</span>`
			} else {
				// if (searchParams.has('page')) {
				// 	searchParams.set("page", 1)
				// } else {
				// 	searchParams.append("page", 1)
				// }
				rvsPaginationFirstPage.innerHTML = `<a class="rvsPaginationLink" aria-label="First" data-page="${1}" href="#">«</a>`
				// searchParams.append("page", page - 1)
				rvsPaginationPreviousPage.innerHTML = `<a class="rvsPaginationLink" aria-label="Previous" data-page="${page - 1}" href="#">‹</a>`
			}
			rvsPaginationList.appendChild(rvsPaginationFirstPage)
			rvsPaginationList.appendChild(rvsPaginationPreviousPage)
			for (let i = startPage; i <= endPage; i++) {
				let rvsPaginationPage = document.createElement("li")
				rvsPaginationPage.classList.add("rvsPaginationItem")
				rvsPaginationPage.classList.add("rvsPaginationItemPage")
				// if (searchParams.has("page")) {
				// 	searchParams.set("page", i)
				// } else {
				// 	searchParams.append("page", i)
				// }
				let activeClass = "",
					disabledAttr	= "",
					dataAttr	= `data-page="${i}"`
				if( page === i ){
					activeClass = "rvActivePagiantion"
					disabledAttr = "disabled"
					dataAttr	= ""
				}
				rvsPaginationPage.innerHTML = `<a class="rvsPaginationLink ${activeClass}" ${disabledAttr} aria-label="Page ${i}" ${dataAttr} href="#">${i}</a>`
				rvsPaginationList.appendChild(rvsPaginationPage)
			}
			if (page === totalPages) {
				rvsPaginationNextPage.classList.add("rvsPaginationItemDisabled")
				rvsPaginationLastPage.classList.add("rvsPaginationItemDisabled")
				rvsPaginationNextPage.innerHTML = `<span class="rvsPaginationLink" aria-label="Next">›</span>`
				rvsPaginationLastPage.innerHTML = `<span class="rvsPaginationLink" aria-label="Last">»</span>`
			} else {
				// if (searchParams.has('page')) {
				// 	searchParams.set("page", totalPages)
				// } else {
				// 	searchParams.append("page", totalPages)
				// }
				rvsPaginationLastPage.innerHTML = `<a class="rvsPaginationLink" aria-label="Last" data-page="${totalPages}" href="#">»</a>`
				// searchParams.append("page", page + 1)
				rvsPaginationNextPage.innerHTML = `<a class="rvsPaginationLink" aria-label="Next" data-page="${page + 1}" href="#">›</a>`
			}
			rvsPaginationList.appendChild(rvsPaginationNextPage)
			rvsPaginationList.appendChild(rvsPaginationLastPage)
			rvsPaginationWrapper.appendChild(rvsPaginationList)
			conversionBoxInstantCustomSearch.resultPaginationContainer.appendChild(rvsPaginationList)
			conversionBoxInstantCustomSearch.paginationEvent();
		}
		await conversionBoxInstantCustomSearch.renderFilterOptions(searchResults)
		conversionBoxInstantCustomSearch.reAdjust()
		if( conversionBoxInstantCustomSearch.initialLoader ){
			conversionBoxInstantCustomSearch.initialLoader	= false
			// if( conversionBoxInstantCustomSearch.priceFilterValue !== null ){
			// 	conversionBoxInstantCustomSearch.findProducts()
			// }
		}
	},

	documentButtonClick: (e) => {
		if( e.target.classList.contains("rvSRAddToCartButton") ){
			e.preventDefault()
			// Find the closest parent element with class 'rvsResultListItem'
			const parentElement = e.target.closest('.rvsResultListItem');
			// Get the 'data-product-id' from the parent
			const productId = parentElement.getAttribute('data-product-id');
			window.location.href	= `/cart.php?action=add&product_id=${productId}&qty=1`
		}
	},

	paginationEvent: () =>{
		document.querySelectorAll('a.rvsPaginationLink').forEach((link) => link.removeEventListener("click", conversionBoxInstantCustomSearch.paginationClickEvent))
		document.querySelectorAll('a.rvsPaginationLink').forEach((link) => link.addEventListener("click", conversionBoxInstantCustomSearch.paginationClickEvent))
	},

	paginationClickEvent: (e) => {
		e.preventDefault()
		let page	= e.target.dataset.page,
			currentUrl = window.location.href,
			searchParams = new URLSearchParams(window.location.search);
		if( page ){
			let searchPageParam	= 'page'
			conversionBoxInstantCustomSearch.page	= page
			if (searchParams.has(searchPageParam)) {
				searchParams.set(searchPageParam, page)
			} else {
				searchParams.append(searchPageParam, page)
			}
			let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
			window.history.pushState({}, '', newUrl);
			conversionBoxInstantCustomSearch.searchBoxWrapper.scrollIntoView()
			if( typeof conversionBoxInstantCustomSearch.productResults[page] !== "undefined" ){
				conversionBoxInstantCustomSearch.renderProducts()
			}else{
				conversionBoxInstantCustomSearch.findProducts()
			}
		}
	},

	changeRvsProductView: async (type) => {
		if (type === conversionBoxInstantCustomSearch.displayView) {
			return
		}
		conversionBoxInstantCustomSearch.updateDisplayProductView(type)
	},

	updateDisplayProductView: async (type) => {
		if (type === "block") {
			conversionBoxInstantCustomSearch.displayView = "block"
			conversionBoxInstantCustomSearch.resultDisplayListWrapper.classList.remove("rvsResultDisplaySelected")
			conversionBoxInstantCustomSearch.resultDisplayBlockWrapper.classList.add("rvsResultDisplaySelected")
			conversionBoxInstantCustomSearch.resultContentWrapper.classList.remove("rvsResultContentAsList")
			conversionBoxInstantCustomSearch.resultContentWrapper.classList.add("rvsResultContentAsBlock")
		} else {
			conversionBoxInstantCustomSearch.displayView = "list"
			conversionBoxInstantCustomSearch.resultDisplayBlockWrapper.classList.remove("rvsResultDisplaySelected")
			conversionBoxInstantCustomSearch.resultDisplayListWrapper.classList.add("rvsResultDisplaySelected")
			conversionBoxInstantCustomSearch.resultContentWrapper.classList.remove("rvsResultContentAsBlock")
			conversionBoxInstantCustomSearch.resultContentWrapper.classList.add("rvsResultContentAsList")
		}
	},

	changeSortOrder: async (e) => {
		let value = e.target.getAttribute("data-value")
		let spanSelector		 = conversionBoxInstantCustomSearch.resultSortWrapperBtn.querySelector('span')
		if( spanSelector ){
			spanSelector.innerHTML	= value
		}
		conversionBoxInstantCustomSearch.activeSortItem = value
		let currentUrl = window.location.href;
		let searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has('sort_by') && value !== "Relevance") {
			searchParams.set('sort_by', value)
		} else if (value !== "Relevance") {
			searchParams.append('sort_by', value)
		} else {
			searchParams.delete('sort_by')
		}
		let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
		window.history.pushState({}, '', newUrl);
		conversionBoxInstantCustomSearch.productResults	= {}
		conversionBoxInstantCustomSearch.findProducts()
	},

	renderFilterOptions: async (searchData) => {
		let filterArray = searchData.facet_counts.filter((item) => {
			if (conversionBoxInstantCustomSearch.facetBy.indexOf(item.field_name) !== -1) {
				return item;
			}
		})
		for (let i = 0; i < filterArray.length; i++) {
			conversionBoxInstantCustomSearch.facetValues[filterArray[i].field_name]	= filterArray[i]
			switch (filterArray[i].field_name) {
				case "price":
				case "effective_price":
					if (conversionBoxInstantCustomSearch.priceFilterValue === null || (conversionBoxInstantCustomSearch.priceFilterValue !== null && conversionBoxInstantCustomSearch.initialLoader)) {
						conversionBoxInstantCustomSearch.priceSlider(filterArray[i])
					}
					break;
				default:
					if (conversionBoxInstantCustomSearch.facetItems[filterArray[i].field_name].facetType === "conjunctive") {
						conversionBoxInstantCustomSearch.renderConjunctiveFilter(filterArray[i])
					} else if (conversionBoxInstantCustomSearch.facetItems[filterArray[i].field_name].facetType === "disjunctive" && conversionBoxInstantCustomSearch.currentFacetTitle !==  filterArray[i].field_name) {
						conversionBoxInstantCustomSearch.renderDisjunctiveFilter(filterArray[i])
					}
					break;
			}
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

	convertPrice: (price) => {
		let config				= conversionBoxInstantCustomSearch.currencyObj,
			convertedPrice		= parseFloat(price);
		if( !config.isDefault ){
			convertedPrice = parseFloat(price) * parseFloat(config.rate);
		}
		return convertedPrice.toFixed(config.decimals);
	},

	revertPrice: (convertedPrice) => {
		let config			= conversionBoxInstantCustomSearch.currencyObj,
			originalPrice	= parseFloat(convertedPrice);
		if( !config.isDefault ){
			originalPrice = parseFloat(convertedPrice) / parseFloat(config.rate);
		}
		return originalPrice.toFixed(config.decimals);
	},

	formPriceText: (price) => {
		let config				= conversionBoxInstantCustomSearch.currencyObj,
			parsedPrice = conversionBoxInstantCustomSearch.convertPrice(price),
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
		let { min, max }	= conversionBoxInstantCustomSearch.getPriceRange(product)
		if( min === max ){
			if( product.sale_price > 0 ){
				return `<span class="cbPriceList">${conversionBoxInstantCustomSearch.formPriceText(product.sale_price)}</span><span class="cbPriceList cbOriginalPrice">${conversionBoxInstantCustomSearch.formPriceText(product.price)}</span>`
			}else{
				return `<span class="cbPriceList">${conversionBoxInstantCustomSearch.formPriceText(product.price)}</span>`
			}
		}else{
			let minPrice	= conversionBoxInstantCustomSearch.formPriceText(min),
				maxPrice	= conversionBoxInstantCustomSearch.formPriceText(max);
			return `<span class="cbPriceList">${minPrice} - ${maxPrice}</span>`
		}
	},

	priceSlider: async (item) => {
		let minValue = 0,
			maxValue = 0,
			range = 0
		if (item.stats != undefined) {
			minValue = Math.floor(conversionBoxInstantCustomSearch.convertPrice(item.stats.min));
			maxValue = Math.ceil(conversionBoxInstantCustomSearch.convertPrice(item.stats.max));
			if( minValue === maxValue ){
				maxValue	= minValue + 1
			}
			range = maxValue - minValue
		}
		conversionBoxInstantCustomSearch.sliderGap = range > 100 ? parseFloat(range / 100) : 1
		let rvsFacetPrice = document.querySelector('.rvsFacetPriceContainer')
		if( !rvsFacetPrice ){
			rvsFacetPrice	= document.querySelector('.rvsFacetEffective_priceContainer')
		}
		if (rvsFacetPrice) {
			rvsFacetPrice.innerHTML = ''
			let rvPriceFacetWrapper	= document.createElement("div"), 
				rvPriceInputWrapper	= document.createElement("div"),
				rvPriceMinInputWrap	= document.createElement("div"),
				rvPriceMinInput	= document.createElement("input"),
				rvPriceSepratorWrap	= document.createElement("div"),
				rvPriceMaxInputWrap	= document.createElement("div"),
				rvPriceMaxInput	= document.createElement("input"),
				rvPriceSliderWrap	= document.createElement("div"),
				rvPriceProgressWrap	= document.createElement("div"),
				rvPriceRangeInputWrap	= document.createElement("div"),
				rvPriceMinRangeInput	= document.createElement("input"),
				rvPriceMaxRangeInput	= document.createElement("input"),
				rvPriceRangeStep	= document.createElement("div")
				rvPriceFacetWrapper.classList.add("rvPriceFacetWrapper")
				rvPriceInputWrapper.classList.add("rvPriceInputWrapper")
				rvPriceMinInputWrap.classList.add("rvPriceMinInputWrap")
				rvPriceMinInput.classList.add("rvPriceMinInput")
				rvPriceSepratorWrap.classList.add("rvPriceSepratorWrap")
				rvPriceMaxInputWrap.classList.add("rvPriceMaxInputWrap")
				rvPriceMaxInput.classList.add("rvPriceMaxInput")
				rvPriceSliderWrap.classList.add("rvPriceSliderWrap")
				rvPriceProgressWrap.classList.add("rvPriceProgressWrap")
				rvPriceRangeInputWrap.classList.add("rvPriceRangeInputWrap")
				rvPriceMinRangeInput.classList.add("rvPriceMinRangeInput")
				rvPriceMaxRangeInput.classList.add("rvPriceMaxRangeInput")
				rvPriceRangeStep.classList.add("rvPriceRangeStep")
				rvPriceMinInput.setAttribute("type", "number")
				rvPriceMinInput.setAttribute("value", minValue)
				rvPriceMaxInput.setAttribute("type", "number")
				rvPriceMaxInput.setAttribute("value", maxValue)
				rvPriceMinRangeInput.setAttribute("type", "range")
				rvPriceMinRangeInput.setAttribute("min", minValue)
				rvPriceMinRangeInput.setAttribute("max", maxValue)
				rvPriceMinRangeInput.setAttribute("step", conversionBoxInstantCustomSearch.sliderGap)
				rvPriceMinRangeInput.setAttribute("value", minValue)
				rvPriceMaxRangeInput.setAttribute("type", "range")
				rvPriceMaxRangeInput.setAttribute("min", minValue)
				rvPriceMaxRangeInput.setAttribute("max", maxValue)
				rvPriceMaxRangeInput.setAttribute("step", conversionBoxInstantCustomSearch.sliderGap)
				rvPriceMaxRangeInput.setAttribute("value", maxValue)
				rvPriceFacetWrapper.appendChild(rvPriceInputWrapper)
				rvPriceInputWrapper.appendChild(rvPriceMinInputWrap)
				rvPriceMinInputWrap.appendChild(rvPriceMinInput)
				rvPriceInputWrapper.appendChild(rvPriceSepratorWrap)
				rvPriceSepratorWrap.innerHTML	= "-"
				rvPriceInputWrapper.appendChild(rvPriceMaxInputWrap)
				rvPriceMaxInputWrap.appendChild(rvPriceMaxInput)
				rvPriceFacetWrapper.appendChild(rvPriceSliderWrap)
				rvPriceSliderWrap.appendChild(rvPriceProgressWrap)
				rvPriceFacetWrapper.appendChild(rvPriceRangeInputWrap)
				rvPriceRangeInputWrap.appendChild(rvPriceMinRangeInput)
				rvPriceRangeInputWrap.appendChild(rvPriceMaxRangeInput)
				rvsFacetPrice.appendChild(rvPriceFacetWrapper)
			conversionBoxInstantCustomSearch.rvsInputRangeDiv = document.querySelectorAll(".rvPriceRangeInputWrap input")
			conversionBoxInstantCustomSearch.rvsInputProgessDiv = document.querySelector(".rvPriceProgressWrap")
			conversionBoxInstantCustomSearch.rvsPriceInputBox	= document.querySelectorAll(".rvPriceInputWrapper input")
			conversionBoxInstantCustomSearch.priceSliderAddEvent()
		}
	},

	priceInputChangeEvent: async(e) => {
		let minPrice = parseInt(conversionBoxInstantCustomSearch.rvsPriceInputBox[0].value),
			maxPrice = parseInt(conversionBoxInstantCustomSearch.rvsPriceInputBox[1].value);
		if( minPrice > maxPrice && e.target.className === "rvPriceMinInput" ){
			minPrice	= maxPrice - parseFloat(conversionBoxInstantCustomSearch.sliderGap)
			conversionBoxInstantCustomSearch.rvsPriceInputBox[0].value	= Math.floor(minPrice)
		}else if( minPrice < parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].min) ){
			minPrice	= parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].min)
			conversionBoxInstantCustomSearch.rvsPriceInputBox[0].value	= minPrice
		}else if( minPrice > parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].max) ){
			minPrice	= parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].max) - parseFloat(conversionBoxInstantCustomSearch.sliderGap)
			conversionBoxInstantCustomSearch.rvsPriceInputBox[0].value	= Math.floor(minPrice)
		}

		if( minPrice > maxPrice && e.target.className !== "rvPriceMinInput" ){
			maxPrice	= minPrice + parseFloat(conversionBoxInstantCustomSearch.sliderGap)
			conversionBoxInstantCustomSearch.rvsPriceInputBox[1].value	= Math.floor(maxPrice)
		}else if( maxPrice > parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].max) ){
			maxPrice	= parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].max)
			conversionBoxInstantCustomSearch.rvsPriceInputBox[1].value	= maxPrice
		}else if( maxPrice < parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].min) ){
			maxPrice	= parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].min) + parseFloat(conversionBoxInstantCustomSearch.sliderGap)
			conversionBoxInstantCustomSearch.rvsPriceInputBox[1].value	= Math.ceil(maxPrice)
		}

		if (maxPrice - minPrice >= conversionBoxInstantCustomSearch.sliderGap && maxPrice <= parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[1].max) ) {
			if (e.target.className === "rvPriceMinInput") {
				conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].value = minPrice;
				conversionBoxInstantCustomSearch.rvsInputProgessDiv.style.left = (minPrice / conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].max) * 100 + "%";
			} else {
				conversionBoxInstantCustomSearch.rvsInputRangeDiv[1].value = maxPrice;
				conversionBoxInstantCustomSearch.rvsInputProgessDiv.style.right = 100 - (maxPrice / conversionBoxInstantCustomSearch.rvsInputRangeDiv[1].max) * 100 + "%";
			}
		}
		minPrice = parseInt(conversionBoxInstantCustomSearch.rvsPriceInputBox[0].value)
		maxPrice = parseInt(conversionBoxInstantCustomSearch.rvsPriceInputBox[1].value)
		currentUrl = window.location.href,
		searchParams = new URLSearchParams(window.location.search);
		conversionBoxInstantCustomSearch.priceFilterValue = `${minPrice}..${maxPrice}`
		conversionBoxInstantCustomSearch.page = 1
		if (searchParams.has('price_range')) {
			searchParams.set('price_range', conversionBoxInstantCustomSearch.priceFilterValue);
		} else {
			searchParams.append('price_range', conversionBoxInstantCustomSearch.priceFilterValue);
		}
		if (searchParams.has("page")) {
			searchParams.delete("page")
		}
		let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
		window.history.pushState({}, '', newUrl);
		await conversionBoxInstantCustomSearch.renderSelectedFilter()
		conversionBoxInstantCustomSearch.productResults	= {}
		conversionBoxInstantCustomSearch.findProducts()
	},

	priceSliderAddEvent: async () => {
		conversionBoxInstantCustomSearch.rvsInputRangeDiv.forEach(input => {
			input.addEventListener("input", conversionBoxInstantCustomSearch.priceRangeInputEvent);
			input.addEventListener("mousedown", conversionBoxInstantCustomSearch.priceRangeMouseDown);
		})
		conversionBoxInstantCustomSearch.rvsPriceInputBox.forEach(input => {
			input.addEventListener("blur", conversionBoxInstantCustomSearch.priceInputChangeEvent)
		})
		document.addEventListener("mouseup", conversionBoxInstantCustomSearch.documentMouseUp)
	},

	priceRangeInputEvent: async (e) => {
		let minVal = parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].value),
			maxVal = parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[1].value);
		if (!conversionBoxInstantCustomSearch.priceRangeDragging) {
			conversionBoxInstantCustomSearch.priceRangeDragging = true
		}
		if ((maxVal - minVal) < conversionBoxInstantCustomSearch.sliderGap) {
			if (e.target.className === "range-min") {
				conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].value = maxVal - conversionBoxInstantCustomSearch.sliderGap
			} else {
				conversionBoxInstantCustomSearch.rvsInputRangeDiv[1].value = minVal + conversionBoxInstantCustomSearch.sliderGap;
			}
		} else {
			conversionBoxInstantCustomSearch.rvsPriceInputBox[0].value = minVal;
			conversionBoxInstantCustomSearch.rvsPriceInputBox[1].value = maxVal;
			conversionBoxInstantCustomSearch.rvsInputProgessDiv.style.left = ((minVal / conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].max) * 100) + "%";
			conversionBoxInstantCustomSearch.rvsInputProgessDiv.style.right = 100 - (maxVal / conversionBoxInstantCustomSearch.rvsInputRangeDiv[1].max) * 100 + "%";
		}
	},

	priceRangeMouseDown: async () => {
		conversionBoxInstantCustomSearch.priceRangeDragging = true
	},

	documentMouseUp: async () => {
		if (conversionBoxInstantCustomSearch.priceRangeDragging) {
			conversionBoxInstantCustomSearch.priceRangeDragging = false
			let minPrice = parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[0].value),
				maxPrice = parseInt(conversionBoxInstantCustomSearch.rvsInputRangeDiv[1].value),
				currentUrl = window.location.href,
				searchParams = new URLSearchParams(window.location.search);
			conversionBoxInstantCustomSearch.priceFilterValue = `${minPrice}..${maxPrice}`
			conversionBoxInstantCustomSearch.page = 1
			if (searchParams.has('price_range')) {
				searchParams.set('price_range', conversionBoxInstantCustomSearch.priceFilterValue);
			} else {
				searchParams.append('price_range', conversionBoxInstantCustomSearch.priceFilterValue);
			}
			if (searchParams.has("page")) {
				searchParams.delete("page")
			}
			let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
			window.history.pushState({}, '', newUrl);
			await conversionBoxInstantCustomSearch.renderSelectedFilter()
			conversionBoxInstantCustomSearch.productResults	= {}
			conversionBoxInstantCustomSearch.findProducts()
		}
	},

	renderConjunctiveFilter: async (item) => {
		let fieldName = item.field_name,
			searchable	= conversionBoxInstantCustomSearch.facetItems[fieldName].searchable,
			title		= conversionBoxInstantCustomSearch.facetItems[fieldName].title,
			selectorTitle = fieldName.replace(/\./g, '_').charAt(0).toUpperCase() + fieldName.replace(/\./g, '_').replace(/ /g,'').slice(1),
			currentFacetSelector = document.querySelector(`.rvsFacet${selectorTitle}Container`)
		if (currentFacetSelector) {
			currentFacetSelector.innerHTML = ""
			let rvsControls = document.createElement("div"),
				rvsControlBody = document.createElement("div"),
				emptyDiv = document.createElement("div"),
				rvsFacetListWrapper = document.createElement("div"),
				rvsFacetList = document.createElement("ul")
			rvsControls.classList.add("rvsControls")
			rvsControlBody.classList.add("rvsControlBody")
			rvsFacetListWrapper.classList.add("rvsFacetListWrapper")
			rvsFacetListWrapper.classList.add("rvsFacetsWrap")
			rvsFacetList.classList.add("rvsFacetList")
			rvsControls.appendChild(rvsControlBody)
			rvsControlBody.appendChild(emptyDiv)
			emptyDiv.appendChild(rvsFacetListWrapper)
			if( searchable ){
				let rvsFacetListSearchBox	= document.createElement("div"),
					rvsFacetSearchBox	= document.createElement("div"),
					rvsFacetSearchForm	= document.createElement("form"),
					rvsFacetSearchInput	= document.createElement("input"),
					rvsFacetSearchSubmit	= document.createElement("button"),
					rvsFacetSearchReset	= document.createElement("button")
				rvsFacetListSearchBox.classList.add("rvsFacetListSearchBox")
				rvsFacetSearchBox.classList.add("rvsFacetSearchBox")
				rvsFacetSearchForm.classList.add("rvsFacetSearchForm")
				rvsFacetSearchInput.classList.add("rvsFacetSearchInput")
				rvsFacetSearchInput.setAttribute("placeholder", `Search for ${title.toLowerCase()}`)
				rvsFacetSearchInput.setAttribute("autocomplete", "off")
				rvsFacetSearchInput.setAttribute("autocorrect", "off")
				rvsFacetSearchInput.setAttribute("autocapitalize", "off")
				rvsFacetSearchInput.setAttribute("spellcheck", "false")
				rvsFacetSearchInput.setAttribute("maxlength", "512")
				rvsFacetSearchInput.setAttribute("data-field-name", fieldName)
				rvsFacetSearchInput.setAttribute("id", `rvsFacetInput${fieldName}`)
				rvsFacetSearchSubmit.classList.add("rvsFacetSearchSubmit")
				rvsFacetSearchSubmit.setAttribute("title", "Submit the search query.")
				rvsFacetSearchSubmit.innerHTML	= `<svg class="rvsSearchBoxSubmitIcon" width="10" height="10" viewBox="0 0 40 40" aria-hidden="true"><path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path></svg>`
				rvsFacetSearchReset.classList.add("rvsFacetSearchReset")
				rvsFacetSearchReset.setAttribute("title", "Clear the search query.")
				rvsFacetSearchReset.setAttribute("hidden", "")
				rvsFacetSearchReset.setAttribute("data-field-name", fieldName)
				rvsFacetSearchReset.innerHTML	= `<svg class="rvsSearchBoxResetIcon" viewBox="0 0 20 20" width="10" height="10" aria-hidden="true"><path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"></path></svg>`
				rvsFacetListSearchBox.appendChild(rvsFacetSearchBox)
				rvsFacetSearchBox.appendChild(rvsFacetSearchForm)
				rvsFacetSearchForm.appendChild(rvsFacetSearchInput)
				rvsFacetSearchForm.appendChild(rvsFacetSearchSubmit)
				rvsFacetSearchForm.appendChild(rvsFacetSearchReset)
				rvsFacetListWrapper.appendChild(rvsFacetListSearchBox)
			}
			rvsFacetListWrapper.appendChild(rvsFacetList)
			currentFacetSelector.appendChild(rvsControls)
			let facetCounts = item.counts
			let facetValueFlag	= false
			for (let i = 0; i < facetCounts.length; i++) {
				if (facetCounts[i].value) {
					facetValueFlag = true
					let rvsFacetFilterListItem = document.createElement("li"),
						listEmptyDiv = document.createElement("div"),
						rvsFacetFilterListItemLabel = document.createElement("label"),
						rvsFacetFilterListItemCount = document.createElement("span")
					rvsFacetFilterListItem.classList.add("rvsFacetFilterListItem")
					if (conversionBoxInstantCustomSearch.filterList && conversionBoxInstantCustomSearch.filterList[fieldName] && conversionBoxInstantCustomSearch.filterList[fieldName].indexOf(facetCounts[i].value) !== -1) {
						rvsFacetFilterListItem.classList.add("rvsFacetFilterListItemSelected")
					}

					rvsFacetFilterListItem.dataset.facetBy = fieldName
					rvsFacetFilterListItem.dataset.value = facetCounts[i].value
					rvsFacetFilterListItem.classList.add("rvsFacetItem")
					rvsFacetFilterListItemLabel.classList.add("rvsFacetFilterListItemLabel")
					rvsFacetFilterListItemLabel.classList.add("rvsFacetLabel")
					rvsFacetFilterListItemCount.classList.add("rvsFacetFilterListItemCount")
					rvsFacetFilterListItemCount.classList.add("rvsFacetCount")
					rvsFacetFilterListItem.appendChild(listEmptyDiv)
					listEmptyDiv.appendChild(rvsFacetFilterListItemLabel)
					rvsFacetFilterListItemLabel.innerHTML = facetCounts[i].value
					rvsFacetFilterListItemLabel.appendChild(rvsFacetFilterListItemCount)
					rvsFacetFilterListItemCount.innerHTML = facetCounts[i].count
					rvsFacetList.appendChild(rvsFacetFilterListItem)
				}
			}
			if( facetValueFlag ){
				currentFacetSelector.parentNode.removeAttribute("style")
			}else{
				console.log(currentFacetSelector.parentNode)
				currentFacetSelector.parentNode.style.display	= "none"
			}
			conversionBoxInstantCustomSearch.addConjuctiveFilterEvent(selectorTitle)
			conversionBoxInstantCustomSearch.addConjuctiveInputFilterEvent(selectorTitle)
		}
	},

	addConjuctiveFilterEvent: async (selectorTitle) => {
		let listItemSelector = document.querySelectorAll(`.rvsFacet${selectorTitle}Container .rvsFacetItem`)
		listItemSelector.forEach((item) => {
			item.addEventListener("click", conversionBoxInstantCustomSearch.conjuctiveFilterClickEvent)
		})
	},

	addConjuctiveInputFilterEvent: async (selectorTitle) => {
		let searchableInput	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchInput`)
		if( searchableInput ){
			searchableInput.addEventListener("keyup", conversionBoxInstantCustomSearch.conjuctiveFilterInputChange)
		}
		let searchBoxForm	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchForm`)
		if( searchBoxForm ){
			searchBoxForm.addEventListener("submit", function(e){
				e.preventDefault()
			})
		}
		let rvsFacetSearchReset	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchReset`)
		if( rvsFacetSearchReset ){
			rvsFacetSearchReset.addEventListener("click", conversionBoxInstantCustomSearch.resetConjuctiveInputValue)
		}
	},

	addDisjuctiveInputFilterEvent: async (selectorTitle) => {
		let searchableInput	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchInput`)
		if( searchableInput ){
			searchableInput.addEventListener("keyup", conversionBoxInstantCustomSearch.disjuctiveFilterInputChange)
		}
		let searchBoxForm	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchForm`)
		if( searchBoxForm ){
			searchBoxForm.addEventListener("submit", function(e){
				e.preventDefault()
			})
		}
		let rvsFacetSearchReset	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchReset`)
		if( rvsFacetSearchReset ){
			rvsFacetSearchReset.addEventListener("click", conversionBoxInstantCustomSearch.resetDisjuctiveInputValue)
		}
	},

	resetConjuctiveInputValue: async (e) => {
		let type	= ""
		if (!e.target.dataset.fieldName) {
			if (e.target.closest("button")) {
				type = e.target.closest("button").dataset.fieldName
			}
		} else {
			type = e.target.dataset.fieldName
		}
		let selectorTitle = type.charAt(0).toUpperCase() + type.slice(1),
			currentFacetSelector = document.querySelector(`.rvsFacet${selectorTitle}Container`)
			
		if( currentFacetSelector.querySelector('.rvsFacetSearchInput') ){
			currentFacetSelector.querySelector('.rvsFacetSearchInput').value	= ''
			var event = new KeyboardEvent('keyup', {
				bubbles: true,
				cancelable: true
			});
			currentFacetSelector.querySelector('.rvsFacetSearchInput').dispatchEvent(event)
		}
	},

	conjuctiveFilterInputChange: async(e) => {
		if( e.key === 'Escape' ) {
			return
		}
		let value = e.target.value
			type	= e.target.dataset.fieldName,
			fieldName	= e.target.dataset.fieldName,
			parentNode	= e.target.parentNode,
			selectorTitle = type.charAt(0).toUpperCase() + type.slice(1),
			currentFacetSelector = document.querySelector(`.rvsFacet${selectorTitle}Container`)
			facetCounts = conversionBoxInstantCustomSearch.facetValues[type].counts
			rvsFacetList	= currentFacetSelector.querySelector('.rvsFacetList')
		rvsFacetList.innerHTML	= ``
		if( value ){
			parentNode.querySelector('.rvsFacetSearchReset').removeAttribute("hidden")
		}else{
			parentNode.querySelector('.rvsFacetSearchReset').setAttribute("hidden", "")
		}
		for (let i = 0; i < facetCounts.length; i++) {
			if ( facetCounts[i].value && facetCounts[i].value.toLowerCase().includes(value.toLowerCase()) ) {
				let rvsFacetFilterListItem = document.createElement("li"),
					listEmptyDiv = document.createElement("div"),
					rvsFacetFilterListItemLabel = document.createElement("label"),
					rvsFacetFilterListItemCount = document.createElement("span")
				rvsFacetFilterListItem.classList.add("rvsFacetFilterListItem")
				if (conversionBoxInstantCustomSearch.filterList && conversionBoxInstantCustomSearch.filterList[fieldName] && conversionBoxInstantCustomSearch.filterList[fieldName].indexOf(facetCounts[i].value) !== -1) {
					rvsFacetFilterListItem.classList.add("rvsFacetFilterListItemSelected")
				}
				rvsFacetFilterListItem.dataset.facetBy = fieldName
				rvsFacetFilterListItem.dataset.value = facetCounts[i].value
				rvsFacetFilterListItem.classList.add("rvsFacetItem")
				rvsFacetFilterListItemLabel.classList.add("rvsFacetFilterListItemLabel")
				rvsFacetFilterListItemLabel.classList.add("rvsFacetLabel")
				rvsFacetFilterListItemCount.classList.add("rvsFacetFilterListItemCount")
				rvsFacetFilterListItemCount.classList.add("rvsFacetCount")
				rvsFacetFilterListItem.appendChild(listEmptyDiv)
				listEmptyDiv.appendChild(rvsFacetFilterListItemLabel)
				rvsFacetFilterListItemLabel.innerHTML = facetCounts[i].value
				rvsFacetFilterListItemLabel.appendChild(rvsFacetFilterListItemCount)
				rvsFacetFilterListItemCount.innerHTML = facetCounts[i].count
				rvsFacetList.appendChild(rvsFacetFilterListItem)
			}
		}
		conversionBoxInstantCustomSearch.addConjuctiveFilterEvent(selectorTitle)
		
	},

	resetDisjuctiveInputValue: async (e) => {
		let type	= ""
		if (!e.target.dataset.fieldName) {
			if (e.target.closest("button")) {
				type = e.target.closest("button").dataset.fieldName
			}
		} else {
			type = e.target.dataset.fieldName
		}
		let selectorTitle = type.charAt(0).toUpperCase() + type.slice(1),
			currentFacetSelector = document.querySelector(`.rvsFacet${selectorTitle}Container`)
			
		if( currentFacetSelector.querySelector('.rvsFacetSearchInput') ){
			currentFacetSelector.querySelector('.rvsFacetSearchInput').value	= ''
			var event = new KeyboardEvent('keyup', {
				bubbles: true,
				cancelable: true
			});
			currentFacetSelector.querySelector('.rvsFacetSearchInput').dispatchEvent(event)
		}
	},

	disjuctiveFilterInputChange: async(e) => {
		if( e.key === 'Escape' ) {
			return
		}
		let value = e.target.value
			type	= e.target.dataset.fieldName,
			fieldName	= e.target.dataset.fieldName,
			parentNode	= e.target.parentNode,
			selectorTitle = type.charAt(0).toUpperCase() + type.slice(1),
			currentFacetSelector = document.querySelector(`.rvsFacet${selectorTitle}Container`)
			facetCounts = conversionBoxInstantCustomSearch.facetValues[type].counts
			rvsFacetList	= currentFacetSelector.querySelector('.rvsFacetList')
		rvsFacetList.innerHTML	= ``
		if( value ){
			parentNode.querySelector('.rvsFacetSearchReset').removeAttribute("hidden")
		}else{
			parentNode.querySelector('.rvsFacetSearchReset').setAttribute("hidden", "")
		}
		for (let i = 0; i < facetCounts.length; i++) {
			if ( facetCounts[i].value && facetCounts[i].value.toLowerCase().includes(value.toLowerCase()) ) {
				let rvsFacetFilterListItem				= document.createElement("li"),
						listEmptyDiv						= document.createElement("div"),
						rvsFacetFilterListItemLabel	= document.createElement("label"),
						rvsFacetFilterListItemInput	= document.createElement("input"),
						rvsFacetCheckmark					= document.createElement("span"),
						rvsFacetFilterListItemCount	= document.createElement("span")
					rvsFacetFilterListItem.classList.add("rvsFacetFilterListItem")
					rvsFacetFilterListItemInput.classList.add("rvsFacetFilterListCheckBox")
					rvsFacetCheckmark.classList.add("rvsFacetCheckmark")
					rvsFacetFilterListItemInput.classList.add("rvsFacetCheckbox")
					rvsFacetFilterListItemInput.setAttribute("type", "checkbox")
					if (conversionBoxInstantCustomSearch.filterList && conversionBoxInstantCustomSearch.filterList[fieldName] && conversionBoxInstantCustomSearch.filterList[fieldName].indexOf(facetCounts[i].value) !== -1) {
						rvsFacetFilterListItem.classList.add("rvsFacetFilterListItemSelected")
						rvsFacetFilterListItemInput.setAttribute("checked", true)
					}
					rvsFacetFilterListItem.dataset.facetBy = fieldName
					rvsFacetFilterListItem.dataset.value = facetCounts[i].value
					rvsFacetFilterListItem.classList.add("rvsFacetItem")
					rvsFacetFilterListItemLabel.classList.add("rvsFacetFilterListItemLabel")
					rvsFacetFilterListItemLabel.classList.add("rvsFacetLabel")
					rvsFacetFilterListItemCount.classList.add("rvsFacetFilterListItemCount")
					rvsFacetFilterListItemCount.classList.add("rvsFacetCount")
					rvsFacetFilterListItem.appendChild(listEmptyDiv)
					listEmptyDiv.appendChild(rvsFacetFilterListItemLabel)
					rvsFacetFilterListItemLabel.appendChild(rvsFacetFilterListItemInput)
					rvsFacetFilterListItemLabel.appendChild(rvsFacetCheckmark)
					rvsFacetFilterListItemLabel.append(facetCounts[i].value)
					rvsFacetFilterListItemLabel.appendChild(rvsFacetFilterListItemCount)
					rvsFacetFilterListItemCount.innerHTML = facetCounts[i].count
					rvsFacetList.appendChild(rvsFacetFilterListItem)
			}
		}
		conversionBoxInstantCustomSearch.addConjuctiveFilterEvent(selectorTitle)
		
	},

	removeConjuctiveFilterEvent: async (selectorTitle) => {
		let listItemSelector = document.querySelectorAll(`.rvsFacet${selectorTitle}Container .rvsFacetItem`)
		listItemSelector.forEach((item) => {
			item.removeEventListener("click", conversionBoxInstantCustomSearch.conjuctiveFilterClickEvent)
		})
	},

	conjuctiveFilterClickEvent: async (e) => {
		let filterBy = "",
			facetValue = ""
		if (!e.target.dataset.facetBy) {
			if (e.target.closest("li")) {
				filterBy = e.target.closest("li").dataset.facetBy
				facetValue = e.target.closest("li").dataset.value
			}
		} else {
			filterBy = e.target.dataset.facetBy
			facetValue = e.target.dataset.value
		}
		if (filterBy && facetValue) {
			if (typeof conversionBoxInstantCustomSearch.filterList[filterBy] === "undefined") {
				conversionBoxInstantCustomSearch.filterList[filterBy] = []
			}
			let index = conversionBoxInstantCustomSearch.filterList[filterBy].indexOf(facetValue)
			if (index !== -1) {
				conversionBoxInstantCustomSearch.filterList[filterBy].splice(index, 1)				
				if( e.target.querySelector('input.rvsFacetFilterListCheckBox') ){
					e.target.querySelector('input.rvsFacetFilterListCheckBox').checked = false
				}
			} else {
				conversionBoxInstantCustomSearch.filterList[filterBy].push(facetValue)
				if( e.target.querySelector('input.rvsFacetFilterListCheckBox') ){
					e.target.querySelector('input.rvsFacetFilterListCheckBox').checked = true
				}
			}
			let currentUrl = window.location.href,
				searchParams = new URLSearchParams(window.location.search);
			if (index === -1) {
				searchParams.set(`filter_by[${filterBy}][${conversionBoxInstantCustomSearch.filterList[filterBy].length - 1}]`, facetValue)
			} else {
				if( searchParams.has(`filter_by[${filterBy}][${index}]`) ){
					searchParams.delete(`filter_by[${filterBy}][${index}]`)
				}
			}
			if (searchParams.has("page")) {
				searchParams.delete("page")
			}
			if (searchParams.has("price_range")) {
				searchParams.delete("price_range")
			}
			let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
			window.history.pushState({}, '', newUrl);
			conversionBoxInstantCustomSearch.priceFilterValue	= null
			conversionBoxInstantCustomSearch.page = 1	
			if( conversionBoxInstantCustomSearch.filterList[filterBy].length === 0 ){
				delete conversionBoxInstantCustomSearch.filterList[filterBy]
				conversionBoxInstantCustomSearch.currentFacetTitle	= ""
			}else{
				conversionBoxInstantCustomSearch.currentFacetTitle	= filterBy
			}
			await conversionBoxInstantCustomSearch.renderSelectedFilter()
			conversionBoxInstantCustomSearch.currentFacetTitle	= filterBy
			conversionBoxInstantCustomSearch.productResults	= {}
			conversionBoxInstantCustomSearch.findProducts()
		}
	},

	renderDisjunctiveFilter: async (item) => {
		let fieldName = item.field_name,
			searchable	= conversionBoxInstantCustomSearch.facetItems[fieldName].searchable,
			title		= conversionBoxInstantCustomSearch.facetItems[fieldName].title,
			selectorTitle = fieldName.replace(/\./g, '_').charAt(0).toUpperCase() + fieldName.replace(/\./g, '_').replace(/ /g,'').slice(1),
			currentFacetSelector = document.querySelector(`.rvsFacet${selectorTitle}Container`)
		if (currentFacetSelector) {
			currentFacetSelector.innerHTML = ""
			let rvsControls = document.createElement("div"),
				rvsControlBody = document.createElement("div"),
				emptyDiv = document.createElement("div"),
				rvsFacetListWrapper = document.createElement("div"),
				rvsFacetList = document.createElement("ul")
			rvsControls.classList.add("rvsControls")
			rvsControlBody.classList.add("rvsControlBody")
			rvsFacetListWrapper.classList.add("rvsFacetListWrapper")
			rvsFacetListWrapper.classList.add("rvsFacetsWrap")
			rvsFacetList.classList.add("rvsFacetList")
			rvsControls.appendChild(rvsControlBody)
			rvsControlBody.appendChild(emptyDiv)
			emptyDiv.appendChild(rvsFacetListWrapper)
			if( searchable ){
				let rvsFacetListSearchBox	= document.createElement("div"),
					rvsFacetSearchBox	= document.createElement("div"),
					rvsFacetSearchForm	= document.createElement("form"),
					rvsFacetSearchInput	= document.createElement("input"),
					rvsFacetSearchSubmit	= document.createElement("button"),
					rvsFacetSearchReset	= document.createElement("button")
				rvsFacetListSearchBox.classList.add("rvsFacetListSearchBox")
				rvsFacetSearchBox.classList.add("rvsFacetSearchBox")
				rvsFacetSearchForm.classList.add("rvsFacetSearchForm")
				rvsFacetSearchInput.classList.add("rvsFacetSearchInput")
				rvsFacetSearchInput.setAttribute("placeholder", `Search for ${title.toLowerCase()}`)
				rvsFacetSearchInput.setAttribute("autocomplete", "off")
				rvsFacetSearchInput.setAttribute("autocorrect", "off")
				rvsFacetSearchInput.setAttribute("autocapitalize", "off")
				rvsFacetSearchInput.setAttribute("spellcheck", "false")
				rvsFacetSearchInput.setAttribute("maxlength", "512")
				rvsFacetSearchInput.setAttribute("data-field-name", fieldName)
				rvsFacetSearchInput.setAttribute("id", `rvsFacetInput${fieldName}`)
				rvsFacetSearchSubmit.classList.add("rvsFacetSearchSubmit")
				rvsFacetSearchSubmit.setAttribute("title", "Submit the search query.")
				rvsFacetSearchSubmit.innerHTML	= `<svg class="rvsSearchBoxSubmitIcon" width="10" height="10" viewBox="0 0 40 40" aria-hidden="true"><path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path></svg>`
				rvsFacetSearchReset.classList.add("rvsFacetSearchReset")
				rvsFacetSearchReset.setAttribute("title", "Clear the search query.")
				rvsFacetSearchReset.setAttribute("hidden", "")
				rvsFacetSearchReset.setAttribute("data-field-name", fieldName)
				rvsFacetSearchReset.innerHTML	= `<svg class="rvsSearchBoxResetIcon" viewBox="0 0 20 20" width="10" height="10" aria-hidden="true"><path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"></path></svg>`
				rvsFacetListSearchBox.appendChild(rvsFacetSearchBox)
				rvsFacetSearchBox.appendChild(rvsFacetSearchForm)
				rvsFacetSearchForm.appendChild(rvsFacetSearchInput)
				rvsFacetSearchForm.appendChild(rvsFacetSearchSubmit)
				rvsFacetSearchForm.appendChild(rvsFacetSearchReset)
				rvsFacetListWrapper.appendChild(rvsFacetListSearchBox)
			}
			rvsFacetListWrapper.appendChild(rvsFacetList)
			currentFacetSelector.appendChild(rvsControls)
			let facetCounts = item.counts,
				facetValueFlag	= false;
			for (let i = 0; i < facetCounts.length; i++) {
				if (facetCounts[i].value) {
					facetValueFlag	= true
					let rvsFacetFilterListItem	= document.createElement("li"),
						listEmptyDiv	= document.createElement("div"),
						rvsFacetFilterListItemLabel	= document.createElement("label"),
						rvsFacetFilterListItemInput	= document.createElement("input"),
						rvsFacetCheckmark	= document.createElement("span"),
						rvsFacetFilterListItemCount	= document.createElement("span")
					rvsFacetFilterListItem.classList.add("rvsFacetFilterListItem")
					rvsFacetFilterListItemInput.classList.add("rvsFacetFilterListCheckBox")
					rvsFacetCheckmark.classList.add("rvsFacetCheckmark")
					rvsFacetFilterListItemInput.classList.add("rvsFacetCheckbox")
					rvsFacetFilterListItemInput.setAttribute("type", "checkbox")
					if (conversionBoxInstantCustomSearch.filterList && conversionBoxInstantCustomSearch.filterList[fieldName] && conversionBoxInstantCustomSearch.filterList[fieldName].indexOf(facetCounts[i].value) !== -1) {
						rvsFacetFilterListItem.classList.add("rvsFacetFilterListItemSelected")
						rvsFacetFilterListItemInput.setAttribute("checked", true)
					}
					rvsFacetFilterListItem.dataset.facetBy = fieldName
					rvsFacetFilterListItem.dataset.value = facetCounts[i].value
					rvsFacetFilterListItem.classList.add("rvsFacetItem")
					rvsFacetFilterListItem.classList.add("rvsDisjunctiveFacetItem")
					rvsFacetFilterListItemLabel.classList.add("rvsFacetFilterListItemLabel")
					rvsFacetFilterListItemLabel.classList.add("rvsFacetLabel")
					rvsFacetFilterListItemCount.classList.add("rvsFacetFilterListItemCount")
					rvsFacetFilterListItemCount.classList.add("rvsFacetCount")
					rvsFacetFilterListItem.appendChild(listEmptyDiv)
					listEmptyDiv.appendChild(rvsFacetFilterListItemLabel)
					rvsFacetFilterListItemLabel.appendChild(rvsFacetFilterListItemInput)
					rvsFacetFilterListItemLabel.appendChild(rvsFacetCheckmark)
					rvsFacetFilterListItemLabel.append(facetCounts[i].value)
					rvsFacetFilterListItemLabel.appendChild(rvsFacetFilterListItemCount)
					rvsFacetFilterListItemCount.innerHTML = facetCounts[i].count
					rvsFacetList.appendChild(rvsFacetFilterListItem)
				}
			}
			if( facetValueFlag ){
				currentFacetSelector.parentNode.removeAttribute("style")
			}else{
				console.log(currentFacetSelector.parentNode)
				currentFacetSelector.parentNode.style.display	= "none"
			}
			conversionBoxInstantCustomSearch.addConjuctiveFilterEvent(selectorTitle)
			conversionBoxInstantCustomSearch.addDisjuctiveInputFilterEvent(selectorTitle)
		}
	},

	renderSelectedFilter: async () => {
		let //clearFacetControl = conversionBoxInstantCustomSearch.clearFacetsWrapper.querySelector('.rvsControls'),
			rvsClearRefinementBtn = conversionBoxInstantCustomSearch.selectedFactesWrapper.querySelector('.rvsClearRefinementBtn'),
			selectFacetControl = conversionBoxInstantCustomSearch.selectedFactesWrapper.querySelector('.rvsControls'),
			selectedFacetList	= conversionBoxInstantCustomSearch.selectedFactesWrapper.querySelector('.rvsSelectedValuesList')
		if( selectedFacetList ){
			selectedFacetList.innerHTML	= ``
		}
		if (Object.keys(conversionBoxInstantCustomSearch.filterList).length > 0 || conversionBoxInstantCustomSearch.priceFilterValue !== null) {
			if (rvsClearRefinementBtn) {
				rvsClearRefinementBtn.classList.remove("rvsClearRefinementBtnDisabled")
				rvsClearRefinementBtn.removeAttribute("disabled")
				rvsClearRefinementBtn.addEventListener("click", conversionBoxInstantCustomSearch.clearAllFilterEvent)
			}
			if (rvsClearRefinementBtn) {
				rvsClearRefinementBtn.classList.remove("rvsControlNoRefinement")
				rvsClearRefinementBtn.removeAttribute("hidden")

			}
			if (selectFacetControl) {
				selectFacetControl.classList.remove("rvsControlNoRefinement")
				selectFacetControl.removeAttribute("hidden")

			}
			if( conversionBoxInstantCustomSearch.priceFilterValue !== null ){
				let splitPriceFilter	= conversionBoxInstantCustomSearch.priceFilterValue.split(".."),
					selectedFacetListItem	= document.createElement("li"),
					selectedFaceListItemLink	= document.createElement("a"),
					emptyDiv	= document.createElement("div"),
					selectedFacetListeItemLabel	= document.createElement("div")
				selectedFacetListItem.classList.add("selectedFacetListItem")
				selectedFaceListItemLink.classList.add("selectedFaceListItemLink")
				selectedFaceListItemLink.dataset.facetBy	= "price"
				selectedFacetListeItemLabel.classList.add("selectedFacetListeItemLabel")
				selectedFacetListItem.appendChild(selectedFaceListItemLink)
				selectedFaceListItemLink.appendChild(emptyDiv)
				emptyDiv.appendChild(selectedFacetListeItemLabel)
				selectedFacetListeItemLabel.innerHTML	= 'Price'
				emptyDiv.append(`: ${splitPriceFilter[0]} > And < ${splitPriceFilter[1]}`)
				selectedFacetList.appendChild(selectedFacetListItem)
			}
			for( let [ key, values ] of Object.entries(conversionBoxInstantCustomSearch.filterList) ){
				if( typeof conversionBoxInstantCustomSearch.facetItems[key] !== "undefined" ){
					for( let i = 0; i < values.length; i++ ){
						let selectedFacetListItem	= document.createElement("li"),
							selectedFaceListItemLink	= document.createElement("a"),
							emptyDiv	= document.createElement("div"),
							selectedFacetListeItemLabel	= document.createElement("div")
						selectedFacetListItem.classList.add("selectedFacetListItem")
						selectedFaceListItemLink.classList.add("selectedFaceListItemLink")
						selectedFaceListItemLink.dataset.facetBy	= key
						selectedFaceListItemLink.dataset.value	= values[i]
						selectedFacetListeItemLabel.classList.add("selectedFacetListeItemLabel")
						selectedFacetListItem.appendChild(selectedFaceListItemLink)
						selectedFaceListItemLink.appendChild(emptyDiv)
						emptyDiv.appendChild(selectedFacetListeItemLabel)
						selectedFacetListeItemLabel.innerHTML	= conversionBoxInstantCustomSearch.facetItems[key].title
						emptyDiv.append(`: ${values[i]}`)
						selectedFacetList.appendChild(selectedFacetListItem)
					}
				}
			}
			conversionBoxInstantCustomSearch.addSingleSelectedItemEvent()
		} else {
			if (rvsClearRefinementBtn) {
				rvsClearRefinementBtn.classList.add("rvsClearRefinementBtnDisabled")
				rvsClearRefinementBtn.setAttribute("disabled", "")
				rvsClearRefinementBtn.removeEventListener("click", conversionBoxInstantCustomSearch.clearAllFilterEvent)
			}
			if (rvsClearRefinementBtn) {
				rvsClearRefinementBtn.classList.add("rvsControlNoRefinement")
				rvsClearRefinementBtn.setAttribute("hidden", "")

			}
			if (selectFacetControl) {
				selectFacetControl.classList.add("rvsControlNoRefinement")
				selectFacetControl.setAttribute("hidden", "")
			}
		}
	},

	clearAllFilterEvent: () => {
		conversionBoxInstantCustomSearch.filterList = {}
		conversionBoxInstantCustomSearch.priceFilterValue = null
		conversionBoxInstantCustomSearch.currentFacetTitle	= null
		conversionBoxInstantCustomSearch.modifyURL()
		conversionBoxInstantCustomSearch.renderSelectedFilter()
		conversionBoxInstantCustomSearch.productResults	= {}
		conversionBoxInstantCustomSearch.findProducts()
	},

	modifyURL: () => {
		let url = window.location.href;
		let urlObject = new URL(url);
		let params = urlObject.searchParams;
		let newUrl = `${window.location.origin}${window.location.pathname}`;
		if (params.has('q')) {
			newUrl = `${window.location.origin}${window.location.pathname}?q=${params.get('q')}`;
		}
		window.history.pushState({}, '', newUrl);
	},

	addSingleSelectedItemEvent: () => {
		let selectedFacetListItemLinks	= conversionBoxInstantCustomSearch.selectedFactesWrapper.querySelectorAll('.rvsSelectedValuesList > .selectedFacetListItem > a')
		if( selectedFacetListItemLinks ){
			selectedFacetListItemLinks.forEach((item) => {
				item.addEventListener("click", conversionBoxInstantCustomSearch.removeParticularSelectedFacet)
			})
		}
	},

	removeParticularSelectedFacet: (e) => {
		let filterBy = "",
			facetValue = "",
			currentUrl = window.location.href,
			searchParams = new URLSearchParams(window.location.search);
		conversionBoxInstantCustomSearch.currentFacetTitle	= ""
		if (!e.target.dataset.facetBy) {
			if (e.target.closest("a")) {
				filterBy = e.target.closest("a").dataset.facetBy
				facetValue = e.target.closest("a").dataset.value
			}
		} else {
			filterBy = e.target.dataset.facetBy
			facetValue = e.target.dataset.value
		}
		if( filterBy === "price" || filterBy === "effective_price" ){
			conversionBoxInstantCustomSearch.priceFilterValue	= null
			if( searchParams.has("price_range") ){
				searchParams.delete("price_range")
			}
		}else{
			let index = conversionBoxInstantCustomSearch.filterList[filterBy] ? conversionBoxInstantCustomSearch.filterList[filterBy].indexOf(facetValue) : -1
			if (index !== -1) {
				conversionBoxInstantCustomSearch.filterList[filterBy].splice(index, 1)
				if( Object.keys(conversionBoxInstantCustomSearch.filterList).length === 1 && conversionBoxInstantCustomSearch.filterList[filterBy].length === 0 ){
					conversionBoxInstantCustomSearch.filterList	= {}
				}
				if( searchParams.has(`filter_by[${filterBy}][${index}]`) ){
					searchParams.delete(`filter_by[${filterBy}][${index}]`)
				}
			}
		}
		let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
		window.history.pushState({}, '', newUrl);
		conversionBoxInstantCustomSearch.renderSelectedFilter()
		conversionBoxInstantCustomSearch.productResults	= {}
		conversionBoxInstantCustomSearch.findProducts()
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
}
// Start the interval to check for the variable
cbCustomSearchIntervalId = setInterval(function () {
	let customPageConfigFlag	= false
	// Check if the custom variable is defined and has a valueg
	if( roundviewSearch.vechileFitmentPage && typeof window.conversionBoxSearch !== 'undefined' && typeof window.conversionBoxSearch.config !== "undefined" && typeof window.conversionBoxSearch.config.searchConfig && Object.keys(window.conversionBoxSearch.config.searchConfig).length > 0 ) {
		// Trigger the function if the variable is defined
		cbCustomPageType				= window.conversionBoxSearch.pageType	
		customPageConfigFlag	= true
		if( !cbCustomRenderFlag ){
			window.roundviewSearch.cbRenderCustomFlag = true
			conversionBoxInstantCustomSearch.init()
		}
		cbCustomRenderFlag	= true
	}else if( !roundviewSearch.searchResultPage ){
		customPageConfigFlag	= true
	}

	if( customPageConfigFlag ){
		clearInterval(cbCustomSearchIntervalId); // Remove the interval
	}
}, 500);