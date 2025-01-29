// Define the interval ID
let cbInstaSearchIntervalId, instaSearchDebounceTimer, pageType, cbCategoryId, renderFlag = false, findProductFlag = false;
window.roundviewSearch = window.roundviewSearch || {}
roundviewSearch.searchResultPage = Boolean(window.location.href.match(/\/search-results-page/))
const cbProductRendered = new CustomEvent('cbProductRendered')
var roundViewInstantSearch = {	
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
	cssSelector: ".page-content",
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
	blogPage: 1,
	pagePage: 1,
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
	currentPriceFacetAttribute: "price",
	pageType: "",
	categoryName: null,

	init: async (type) => {
		let loadSearch	= false,
			sortObject	= [],
			facetObject	= [],
			columnCount	= 2
		roundViewInstantSearch.pageType	= type
		if( type === "instantSearch" ){
			roundViewInstantSearch.instantSearchConfig = window.conversionBoxSearch.config.instantSearch
			roundViewInstantSearch.noOfProducts	= roundViewInstantSearch.instantSearchConfig.noOfProducts ?? 20
			roundViewInstantSearch.noOfBlogs	= roundViewInstantSearch.instantSearchConfig.noOfBlogs ?? 20
			roundViewInstantSearch.noOfPages	= roundViewInstantSearch.instantSearchConfig.noOfPages ?? 20
			roundViewInstantSearch.showVendor	= roundViewInstantSearch.instantSearchConfig.showVendor ? roundViewInstantSearch.instantSearchConfig.showVendor : false
			sortObject = roundViewInstantSearch.instantSearchConfig.sort
			facetObject = roundViewInstantSearch.instantSearchConfig.facet
			roundViewInstantSearch.typeSenseConfig	= window.conversionBoxSearch.config.searchConfig
			roundViewInstantSearch.channelId	= window.conversionBoxSearch.config.channelId
			roundViewInstantSearch.uniqueId	= window.conversionBoxSearch.config.unique_id
			roundViewInstantSearch.template	= typeof window.conversionBoxSearch.config.template !== "undefined" ? window.conversionBoxSearch.config.template : "bigImage"
			roundViewInstantSearch.analyticsURL	= window.conversionBoxSearch.config.analyticsURL
			roundViewInstantSearch.cssURL	= window.conversionBoxSearch.config.CSSURLIns
			roundViewInstantSearch.APPURL	= window.conversionBoxSearch.config.APPURL
			columnCount	= typeof roundViewInstantSearch.instantSearchConfig.gridColumnCount !== "undefined" ? roundViewInstantSearch.instantSearchConfig.gridColumnCount : 0
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
				roundViewInstantSearch.currencyObj	= currencies[currencyId]
			}else{
				roundViewInstantSearch.currencyObj	= defaultCurrencyConfig
			}
			if( typeof roundViewInstantSearch.instantSearchConfig.outOfStock !== 'undefined' ){
				roundViewInstantSearch.outOfStock = roundViewInstantSearch.instantSearchConfig.outOfStock
			}
			let indexConfig	= window.conversionBoxSearch.config.indexConfig
			if ( roundViewInstantSearch.instantSearchConfig.status && ( indexConfig.index_products === "true" || indexConfig.index_pages === "true" || indexConfig.index_blogs === "true" ) && pageType === "page" ) {
				loadSearch	= true
			}			
			if( indexConfig.index_products === "true" ){
				roundViewInstantSearch.tabArray.push("Products")
			}
			if( indexConfig.index_blogs === "true" ){
				roundViewInstantSearch.tabArray.push("Blogs")
			}
			if( indexConfig.index_pages === "true" ){
				roundViewInstantSearch.tabArray.push("Pages")
			}
			if( roundViewInstantSearch.tabArray.length > 1 ){
				roundViewInstantSearch.tabFlag	= true
			}
		}else{
			roundViewInstantSearch.instantSearchConfig	= window.conversionBoxCategoryConfig.config.categoryConfig
			roundViewInstantSearch.noOfProducts	= roundViewInstantSearch.instantSearchConfig.noOfProducts ? roundViewInstantSearch.instantSearchConfig.noOfProducts : 20
			roundViewInstantSearch.showVendor	= roundViewInstantSearch.instantSearchConfig.showVendor ? roundViewInstantSearch.instantSearchConfig.showVendor : false
			sortObject = roundViewInstantSearch.instantSearchConfig.sort
			facetObject = roundViewInstantSearch.instantSearchConfig.facet
			roundViewInstantSearch.typeSenseConfig	= window.conversionBoxCategoryConfig.config.searchConfig
			roundViewInstantSearch.cssSelector	= roundViewInstantSearch.instantSearchConfig.cssSelector
			roundViewInstantSearch.channelId	= window.conversionBoxCategoryConfig.config.channelId
			roundViewInstantSearch.uniqueId	= window.conversionBoxCategoryConfig.config.unique_id
			roundViewInstantSearch.template	= typeof window.conversionBoxCategoryConfig.config.template !== "undefined" ? window.conversionBoxCategoryConfig.config.template : "bigImage"
			roundViewInstantSearch.analyticsURL	= window.conversionBoxCategoryConfig.config.analyticsURL
			roundViewInstantSearch.cssURL	= window.conversionBoxCategoryConfig.config.CSSURLIns
			roundViewInstantSearch.APPURL	= window.conversionBoxCategoryConfig.config.APPURL
			roundViewInstantSearch.categoryName	= window.conversionBoxCategoryConfig.categoryName
			columnCount	= typeof roundViewInstantSearch.instantSearchConfig.gridColumnCount !== "undefined" ? roundViewInstantSearch.instantSearchConfig.gridColumnCount : 0
			let currencyId					= typeof window.conversionBoxCategoryConfig.currency_id !== "undefined" ? parseInt(window.conversionBoxCategoryConfig.currency_id) : null,
				defaultCurrencyConfig	=	{
														isDefault: true,
														rate: 1,
														decimals: 0,
														decimalSeparator: ".",
														thousandsSeparator: ",",
														symbol: "$",
														location: "left"
													},
				currencies					= typeof window.conversionBoxCategoryConfig.config.currencies !== "undefined" ? window.conversionBoxCategoryConfig.config.currencies : null
			if( currencyId !== null && currencies !== null && typeof currencies[currencyId] !== "undefined" ){
				roundViewInstantSearch.currencyObj	= currencies[currencyId]
			}else{
				roundViewInstantSearch.currencyObj	= defaultCurrencyConfig
			}
			if( typeof roundViewInstantSearch.instantSearchConfig.outOfStock !== 'undefined' ){
				roundViewInstantSearch.outOfStock = roundViewInstantSearch.instantSearchConfig.outOfStock
			}
			let indexConfig	= window.conversionBoxCategoryConfig.config.indexConfig,
				categoryIds		= window.conversionBoxCategoryConfig.config.categoryIds,
				storeFrontToken	= window.conversionBoxCategoryConfig.storefront_token;
				
			if( roundViewInstantSearch.instantSearchConfig.status && indexConfig.index_products == "true" && categoryIds[cbCategoryId] ){
				let edgeValue	=	await roundViewInstantSearch.fetchCategoryById(storeFrontToken)
				if( typeof edgeValue !== "undefined" ){
					edgeValue = JSON.parse(edgeValue)
					if( typeof edgeValue.sort !== "undefined" ){
						sortObject	= edgeValue.sort
					}
					if( typeof edgeValue.facet !== "undefined" ){
						facetObject	= edgeValue.facet
					}
				}
				loadSearch	= true
			}
		}
		let currentFacets	= roundViewInstantSearch.instantSearchConfig.facet ?? []
		for( let i = 0; i < currentFacets.length; i++ ){
			if( currentFacets[i].attribute === "effective_price" ){
				roundViewInstantSearch.currentPriceFacetAttribute	= "effective_price"
				break;
			}
		}
		if( roundViewInstantSearch.template === "bigImage" ){
			switch ( columnCount ){
				case 6:
					roundViewInstantSearch.columnClass	= "sixthColumn"
					break;
				case 5:
					roundViewInstantSearch.columnClass	= "fivethColumn"
					break;
				case 4:
					roundViewInstantSearch.columnClass	= "fourthColumn"
					break;
				case 3:
					roundViewInstantSearch.columnClass	= "thirdColumn"
					break;					
				case 2:
					roundViewInstantSearch.columnClass	= "secondColumn"
					break;
				case 1:
					roundViewInstantSearch.columnClass	= "oneColumn"
					break;
				default:
					roundViewInstantSearch.columnClass	= "autoColumn"
					break;
			}
		}
		let data = await roundViewInstantSearch.createTypeSenseClient()
		if( !window.roundViewInstantSearch ){
			roundViewInstantSearch.getSessionID()
		}else{
			roundViewInstantSearch.sessionID	= window.roundViewInstantSearch.sessionID
		}

		if ( loadSearch && data ) {
			if (!roundViewInstantSearch.instantSearchWrapSelector) {				
				let wrapSeelctor	= document.createElement("div")
				wrapSeelctor.classList.add("roundViewInstantSearchWrapper")
				wrapSeelctor.id	= "roundViewInstantSearchWrapper"
				roundViewInstantSearch.instantSearchWrapSelector	= wrapSeelctor;
				let pageContainer	= document.querySelector(roundViewInstantSearch.cssSelector)
				if( pageContainer ){
					pageContainer.style.width	= "100%"
					if( cbCategoryId ){
						pageContainer.innerHTML	= ""
					}
					pageContainer.appendChild(wrapSeelctor);
				}else{
					return
				}
			}
			for (let i = 0; i < sortObject.length; i++) {
				roundViewInstantSearch.sortBy.push(sortObject[i].title)
				roundViewInstantSearch.sortItems[sortObject[i].title] = sortObject[i]
			}
			for (let i = 0; i < facetObject.length; i++) {
				roundViewInstantSearch.facetBy.push(facetObject[i].attribute)
				roundViewInstantSearch.facetItems[facetObject[i].attribute] = facetObject[i]
			}
			roundViewInstantSearch.instantSearchWrapSelector.innerHTML	= `<div id=cbSearchResultSkeleton><div class="cbFiltersSidebar cbProductFilters"><div class="cbSkeletonCard cbProductFiltersBlock"><div class=cbProductFiltersTitle><span class="cbSkeletonText cbFullWidth"></span></div><div class=cbProductFiltersList><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><div class="cbSkeletonCard cbProductFiltersBlock"><div class=cbProductFiltersTitle><span class="cbSkeletonText cbFullWidth"></span></div><div class=cbProductFiltersList><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><div class="cbSkeletonCard cbProductFiltersBlock"><div class=cbProductFiltersTitle><span class="cbSkeletonText cbFullWidth"></span></div><div class=cbProductFiltersList><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div></div><div class=cbSearchResultMainWrapper><div class="cbGridMode cbThreeColumns"id=cbSearchResultsWrapper><ul class=cbSearchResultContent><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div><li class=cbProducts><div class="cbSkeletonCard cbItem"><div class=cbThumbnailWrap><div class=cbThumbnail></div></div><div class=cbOverhidden><span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span> <span class="cbSkeletonText cbFullWidth"></span></div></div></ul></div></div></div><style>@keyframes cbSkeletonAnim { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } } #cbSearchResultSkeleton * { box-sizing: border-box; } #cbSearchResultSkeleton .cbSkeletonCard { padding: 10px; border: 1px solid #eee; } #cbSearchResultSkeleton .cbSkeletonText { height: 8px; background: #eee; border-radius: 3px; display: inline-block; animation: cbSkeletonAnim 2s infinite; } #cbSearchResultSkeleton .cbSkeletonText.cbFullWidth:last-child { width: 100%; } #cbSearchResultSkeleton .cbSkeletonText.cbFullWidth:first-child:not(:last-child) { width: 80%; } #cbSearchResultSkeleton .cbSkeletonText.cbFullWidth:nth-child(2):not(:last-child) { width: 95%; } #cbSearchResultSkeleton .cbSkeletonText.cbFullWidth:last-child:not(:first-child) { width: 60%; } #cbSearchResultSkeleton .cbFiltersSidebar { float: left; width: 225px; } #cbSearchResultSkeleton .cbFiltersSidebar > .cbSkeletonCard:not(:last-child) { border-bottom: none; } #cbSearchResultSkeleton .cbFiltersSidebar .cbProductFiltersTitle { padding: 4px 0 12px 0; } #cbSearchResultSkeleton .cbFiltersSidebar .cbProductFiltersTitle > span.cbFullWidth { width: 40%; } #cbSearchResultSkeleton .cbFiltersSidebar .cbProductFiltersList > span { margin: 1px 0 12px 0; } #cbSearchResultSkeleton .cbFiltersSidebar .cbProductFiltersList > span:last-child { margin-bottom: 10px; } #cbSearchResultSkeleton .cbSearchResultMainWrapper { margin-left: 225px; } #cbSearchResultSkeleton ul.cbSearchResultContent { margin: 0 0 0 -1%; padding: 0 0 0 20px; list-style: none; white-space: nowrap; } #cbSearchResultSkeleton ul.cbSearchResultContent > li { display: inline-block; } #cbSearchResultSkeleton .cbThreeColumns ul.cbSearchResultContent > li { width: 30.3%; width: calc(100%/3 - 2%); } #cbSearchResultSkeleton li.cbProducts { cursor: pointer; margin: 0 1% 2%; white-space: normal; } #cbSearchResultSkeleton li.cbProducts .cbThumbnailWrap { position: relative; } #cbSearchResultSkeleton li.cbProducts .cbThumbnailWrap .cbThumbnail { margin: -10px -10px 0px -10px; background: #eee; height: 180px; } #cbSearchResultSkeleton li.cbProducts .cbOverhidden { padding-bottom: 20px; text-align: center; } #cbSearchResultSkeleton li.cbProducts .cbOverhidden > span { margin: 15px 0 0 0; } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:nth-child(4), #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:nth-child(5) { display: none; } /* Tablet view 2-column mode */ @media (min-width: 768px) and (max-width: 910px) { #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts { width: 46%; width: calc(50% - 10px); min-width: 160px; margin: 0 5px 10px; } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:nth-child(3) { display: none; } } /* Mobile view 2-column mode */ @media (max-width: 768px) { #cbSearchResultSkeleton .cbFiltersSidebar { display: none; } #cbSearchResultSkeleton .cbSearchResultMainWrapper { margin-left: 0; } #cbSearchResultSkeleton ul.cbSearchResultContent { margin: 0; padding: 0; } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:nth-child(3) { display: none; } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts { width: 46%; width: calc(50% - 10px); min-width: 160px; margin: 0 5px 10px; } } /* Mobile view one-column mode */ @media (max-width: 370px) { #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts { width: 96%; width: calc(100% - 10px); } #cbSearchResultSkeleton ul.cbSearchResultContent li.cbProducts:not(:first-child) { display: none; } }</style>`
			if (roundViewInstantSearch.cssURL) {
				await roundViewInstantSearch.addLinkToHead(roundViewInstantSearch.cssURL)
				if( roundViewInstantSearch.APPURL ){
					roundViewInstantSearch.addLinkToHead(roundViewInstantSearch.APPURL+"/api/css/instantsearch/"+roundViewInstantSearch.uniqueId)
				}
			}
			roundViewInstantSearch.instantSearchWrapSelector.innerHTML = ''
			await roundViewInstantSearch.renderHtml()			
			roundViewInstantSearch.initateSearch()
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
			roundViewInstantSearch.queryStringParams[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : "";
		});
		roundViewInstantSearch.renderHtmlFlag = true
		roundViewInstantSearch.instantSearchPageElement.classList.add("rvsResultPageWrapper")
		roundViewInstantSearch.instantSearchPageElement.classList.add(roundViewInstantSearch.template)
		// roundViewInstantSearch.instantSearchPageH1Element.classList.add("rvsHeaderH1")
		roundViewInstantSearch.inputWrapper.classList.add("rvsInputWrapper")
		roundViewInstantSearch.searchBoxWrapper.classList.add("rvsSearchBoxWrapper")
		roundViewInstantSearch.searchBoxInner.classList.add("rvsSearchBoxInner")
		roundViewInstantSearch.searchBoxForm.classList.add("rvsSearchBoxForm")
		roundViewInstantSearch.searchBoxForm.setAttribute("role", "search")
		roundViewInstantSearch.searchInput.classList.add("rvsSearchBoxInput")
		roundViewInstantSearch.searchInput.setAttribute("type", "text")
		//roundViewInstantSearch.searchInput.setAttribute("placeholder", "Search")
		roundViewInstantSearch.searchInput.setAttribute("placeholder", "Search for products")
		if( roundViewInstantSearch.categoryName ){
			roundViewInstantSearch.searchInput.setAttribute("placeholder", "Search for "+roundViewInstantSearch.categoryName.toLowerCase())
		}
		roundViewInstantSearch.searchInput.setAttribute("autocomplete", "off")
		roundViewInstantSearch.searchInput.setAttribute("autocapitalize", "off")
		roundViewInstantSearch.searchInput.setAttribute("spellcheck", "false")
		roundViewInstantSearch.searchInput.setAttribute("maxlength", "512")
		roundViewInstantSearch.searchBoxSubmit.classList.add("rvsSearchBoxSubmit")
		roundViewInstantSearch.searchBoxSubmit.setAttribute("title", "Submit the search query.")
		roundViewInstantSearch.searchBoxSubmit.setAttribute("type", "button")
		roundViewInstantSearch.searchBoxSubmit.innerHTML = `<svg class="rvsSearchBoxSubmitIcon" width="10" height="10" viewBox="0 0 40 40" aria-hidden="true"><path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path></svg>`
		roundViewInstantSearch.searchBoxReset.classList.add("rvsSearchBoxReset")
		roundViewInstantSearch.searchBoxReset.setAttribute("title", "Clear the search query.")
		roundViewInstantSearch.searchBoxReset.setAttribute("type", "reset")
		roundViewInstantSearch.searchBoxReset.setAttribute("hidden", "")
		roundViewInstantSearch.searchBoxReset.innerHTML = `<svg class="rvsSearchBoxResetIcon" viewBox="0 0 20 20" width="10" height="10" aria-hidden="true"><path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"></path></svg>`
		roundViewInstantSearch.searchBoxLoadingIndicator.classList.add("rvsLoadingIndicator")
		roundViewInstantSearch.searchBoxLoadingIndicator.innerHTML = `<svg class="rvsSearchBoxLoadingIcon" width="16" height="16" viewBox="0 0 38 38" stroke="#444" aria-hidden="true"><g fill="none" fillRule="evenodd"><g transform="translate(1 1)" strokeWidth="2"><circle strokeOpacity=".5" cx="18" cy="18" r="18"></circle><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform></path></g></g></svg>`
		roundViewInstantSearch.searchBoxLoadingIndicator.setAttribute("hidden", "")		
		roundViewInstantSearch.searchBoxMobileFilter.classList.add("rvsFacetsMobileBtn")
		roundViewInstantSearch.searchBoxMobileFilter.innerHTML = `Filters`
		roundViewInstantSearch.searchBoxFacetsWrapper.classList.add("rvsFacetsWrapper")
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
		roundViewInstantSearch.searchBoxFacetsWrapper.appendChild(facetMobileHeaderWrapper)
		roundViewInstantSearch.searchBoxFacetsWrapper.appendChild(rvFacetMobileBottom)
		facetMobileHeaderWrapper.appendChild(facetMobileHeader)
		facetMobileHeaderWrapper.appendChild(facetMobileCloseBtn)
		roundViewInstantSearch.searchBoxFacetsWrapper.setAttribute("hidden", "")
		// roundViewInstantSearch.clearFacetsWrapper.classList.add("rvsClearFacetsWrapper")
		// roundViewInstantSearch.clearFacetsWrapper.innerHTML = `<div class="rvsControls rvsControlNoRefinement" hidden><div class="rvsControlBody"><div><div class="rvsClearRefinements"><button class="rvsClearRefinementBtn rvsClearRefinementBtnDisabled" disabled>Clear all</button></div></div></div></div>`
		roundViewInstantSearch.selectedFactesWrapper.classList.add("rvsSelectedFacetWrapper")
		roundViewInstantSearch.selectedFactesWrapper.innerHTML = `<div class="rvsControls rvsControlNoRefinement" hidden><div class="rvsControlBody"><div><div class="rvsSelectedValuesHeader rvsFacetHeader rvsHeader">Selected Filter <button class="rvsClearRefinementBtn rvsClearRefinementBtnDisabled" disabled>Clear all</button></div><div class="rvsRoot rvsSelectedValues rvsFacetsWrap"><ul class="rvsSelectedValuesList"></ul></div></div></div></div>`
		roundViewInstantSearch.searchBoxResultWrapper.classList.add("rvsSearchBox")
		roundViewInstantSearch.resultHeaderWrapper.classList.add("rvsResultHeaderWrapper")
		roundViewInstantSearch.resultHeaderWrapper.setAttribute("hidden", "")
		roundViewInstantSearch.resultStatContainer.classList.add("rvsResultStatContainer")
		roundViewInstantSearch.resultStatContainer.innerHTML = `<div class="rvsResultStatWrapper"><span class="rvsResultStatText"></span></div>`
		roundViewInstantSearch.resultHeaderRightWrapper.classList.add("resultHeaderRightWrapper")
		roundViewInstantSearch.resultChangeDisplayWrapper.classList.add("rvsResultDisplayWrapper")
		roundViewInstantSearch.resultDisplayBlockWrapper.classList.add("rvsResultDisplayBlock")
		roundViewInstantSearch.resultDisplayBlockWrapper.classList.add("rvsResultDisplaySelected")
		roundViewInstantSearch.resultDisplayBlockWrapper.innerHTML = `<svg enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="grid-2"><path d="M10.246,4.228c0-0.547-0.443-0.991-0.99-0.991H3.914c-0.548,0-0.991,0.443-0.991,0.991V9.57   c0,0.546,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.444,0.99-0.99V4.228z" fill="currentcolor"/><path d="M19.453,4.228c0-0.547-0.443-0.991-0.991-0.991h-5.343c-0.546,0-0.99,0.443-0.99,0.991V9.57   c0,0.546,0.444,0.99,0.99,0.99h5.343c0.548,0,0.991-0.444,0.991-0.99V4.228z" fill="currentcolor"/><path d="M28.868,4.228c0-0.547-0.443-0.991-0.99-0.991h-5.342c-0.548,0-0.991,0.443-0.991,0.991V9.57   c0,0.546,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.444,0.99-0.99V4.228z" fill="currentcolor"/><path d="M10.246,13.224c0-0.547-0.443-0.99-0.99-0.99H3.914c-0.548,0-0.991,0.443-0.991,0.99v5.342   c0,0.549,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.441,0.99-0.99V13.224z" fill="currentcolor"/><path d="M19.453,13.224c0-0.547-0.443-0.99-0.991-0.99h-5.343c-0.546,0-0.99,0.443-0.99,0.99v5.342   c0,0.549,0.444,0.99,0.99,0.99h5.343c0.548,0,0.991-0.441,0.991-0.99V13.224z" fill="currentcolor"/><path d="M28.868,13.224c0-0.547-0.443-0.99-0.99-0.99h-5.342c-0.548,0-0.991,0.443-0.991,0.99v5.342   c0,0.549,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.441,0.99-0.99V13.224z" fill="currentcolor"/><path d="M10.246,22.43c0-0.545-0.443-0.99-0.99-0.99H3.914c-0.548,0-0.991,0.445-0.991,0.99v5.344   c0,0.547,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.443,0.99-0.99V22.43z" fill="currentcolor"/><path d="M19.453,22.43c0-0.545-0.443-0.99-0.991-0.99h-5.343c-0.546,0-0.99,0.445-0.99,0.99v5.344   c0,0.547,0.444,0.99,0.99,0.99h5.343c0.548,0,0.991-0.443,0.991-0.99V22.43z" fill="currentcolor"/><path d="M28.868,22.43c0-0.545-0.443-0.99-0.99-0.99h-5.342c-0.548,0-0.991,0.445-0.991,0.99v5.344   c0,0.547,0.443,0.99,0.991,0.99h5.342c0.547,0,0.99-0.443,0.99-0.99V22.43z" fill="currentcolor"/></g></svg>`
		roundViewInstantSearch.resultDisplayListWrapper.classList.add("rvsResultDisplayList")
		roundViewInstantSearch.resultDisplayListWrapper.innerHTML = `<svg height="32" id="svg2" version="1.1" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs6"/><g id="g10" transform="matrix(1.3333333,0,0,-1.3333333,0,32)"><path d="M 6.4124,16.292783 H 18.411669" id="path168" style="fill:currentcolor;stroke:currentcolor;stroke-width:0.77399999;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m 6.4124,12.110025 h 8.205209" id="path170" style="fill:currentcolor;stroke:currentcolor;stroke-width:0.77399999;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m 6.4124,7.9272666 h 4.424821" id="path981" style="fill:currentcolor;stroke:currentcolor;stroke-width:0.77399999;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>`
		roundViewInstantSearch.resultSortWrapper.classList.add("rvsSortWrapper")
		roundViewInstantSearch.resultSortWrapperBtn.classList.add("resultSortWrapperBtn")
		roundViewInstantSearch.resultSortWrapperBtn.id	= "resultSortWrapperBtn"
		roundViewInstantSearch.resultSortWrapperBtn.innerHTML	= `<span>Relevance</span><svg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9.87998 1.29L5.99998 5.17L2.11998 1.29C1.72998 0.899998 1.09998 0.899998 0.70998 1.29C0.31998 1.68 0.31998 2.31 0.70998 2.7L5.29998 7.29C5.68998 7.68 6.31998 7.68 6.70998 7.29L11.3 2.7C11.69 2.31 11.69 1.68 11.3 1.29C10.91 0.909998 10.27 0.899998 9.87998 1.29Z' fill='currentcolor'/></svg>`
		roundViewInstantSearch.resultSortContentWrapper.classList.add("resultSortContentWrapper")
		roundViewInstantSearch.resultSortContentWrapper.id	= "resultSortContentWrapper"
		roundViewInstantSearch.resultSortWrapper.appendChild(roundViewInstantSearch.resultSortWrapperBtn)
		roundViewInstantSearch.resultSortWrapper.appendChild(roundViewInstantSearch.resultSortContentWrapper)
		roundViewInstantSearch.resultContentWrapper.classList.add("rvsResultContentWrapper")
		roundViewInstantSearch.resultContentWrapper.classList.add("rvsResultContentAsBlock")
		roundViewInstantSearch.resultPaginationContainer.classList.add("rvsResultPaginationContainer")
		if( roundViewInstantSearch.tabFlag ){
			roundViewInstantSearch.instantSearchPageElement.appendChild(roundViewInstantSearch.inputWrapper)
		}
		if( roundViewInstantSearch.tabFlag ){
			if( typeof roundViewInstantSearch.queryStringParams["tab"] !== "undefined" && roundViewInstantSearch.tabArray.length > 0 ){
				if( roundViewInstantSearch.tabArray.indexOf(roundViewInstantSearch.queryStringParams["tab"]) !== -1 ){
					roundViewInstantSearch.activeTab	= roundViewInstantSearch.queryStringParams["tab"]
				}else{
					roundViewInstantSearch.activeTab	= roundViewInstantSearch.tabArray[0]
					let currentUrl = window.location.href,
						searchParams = new URLSearchParams(window.location.search);
					if (searchParams.has('tab')) {
						searchParams.set("tab", roundViewInstantSearch.activeTab)
					}
					let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
					window.history.pushState({}, '', newUrl);
				}
			}
			let tabContentWrapper	= document.createElement("div"),
				tabContentInnerwrap	= document.createElement("div"),
				tabContentList			= document.createElement("ul")
			tabContentWrapper.classList.add("rvSearchResultTabWrapper")
			tabContentInnerwrap.classList.add("rvSearchResultTabInnerWrap")
			tabContentList.classList.add("rvSearchResultTabContentList")
			tabContentWrapper.appendChild(tabContentInnerwrap)
			tabContentInnerwrap.appendChild(tabContentList)
			for( let i = 0; i < roundViewInstantSearch.tabArray.length; i++ ){
				let currentTab	= roundViewInstantSearch.tabArray[i],
					tabListItem	= document.createElement("li")				
				tabListItem.classList.add("rvSearchResultTabListItem")
				if( roundViewInstantSearch.activeTab === currentTab ){
					tabListItem.classList.add('rvSearchResultTabListItemActive')
				}
				tabListItem.innerHTML	= `<a href="#"  onclick="event.preventDefault();" data-tab-content="${currentTab}">${currentTab}<span class="rvSR${currentTab}Count"></span></a>`
				tabContentList.appendChild(tabListItem)
			}
			roundViewInstantSearch.instantSearchPageElement.appendChild(tabContentWrapper)
		}
		roundViewInstantSearch.inputWrapper.appendChild(roundViewInstantSearch.searchBoxWrapper)
		roundViewInstantSearch.searchBoxWrapper.appendChild(roundViewInstantSearch.searchBoxInner)
		roundViewInstantSearch.searchBoxInner.appendChild(roundViewInstantSearch.searchBoxForm)
		roundViewInstantSearch.searchBoxForm.appendChild(roundViewInstantSearch.searchInput)
		roundViewInstantSearch.searchBoxForm.appendChild(roundViewInstantSearch.searchBoxSubmit)
		roundViewInstantSearch.searchBoxForm.appendChild(roundViewInstantSearch.searchBoxReset)
		roundViewInstantSearch.searchBoxForm.appendChild(roundViewInstantSearch.searchBoxLoadingIndicator)
		roundViewInstantSearch.resultStatContainer.appendChild(roundViewInstantSearch.searchBoxMobileFilter)
		if( roundViewInstantSearch.tabFlag ){
			roundViewInstantSearch.instantSearchPageElement.appendChild(roundViewInstantSearch.resultHeaderWrapper)
		}
		roundViewInstantSearch.instantSearchPageElement.appendChild(roundViewInstantSearch.searchBoxFacetsWrapper)
		roundViewInstantSearch.searchBoxFacetsWrapper.appendChild(roundViewInstantSearch.selectedFactesWrapper)
		for (let i = 0; i < roundViewInstantSearch.facetBy.length; i++) {
			let currentFacetBy = roundViewInstantSearch.facetBy[i],
				facetDownWrapper = document.createElement("div"),
				facetLabel = document.createElement("label"),
				facetInputCheckbox = document.createElement("input"),
				facetType = roundViewInstantSearch.facetItems[currentFacetBy];
			currentFacetBy	= currentFacetBy.replace(/\./g, '_').replace(/ /g,'');
			facetItemContainer = document.createElement("div");
			facetDownWrapper.classList.add(`rvsFacetDownWrapper`)
			facetDownWrapper.classList.add(`rvsFacet${facetType.facetType.charAt(0).toUpperCase() + facetType.facetType.slice(1)}`)
			facetDownWrapper.classList.add(`rvFacet${currentFacetBy.charAt(0).toUpperCase() + currentFacetBy.slice(1)}`)
			facetLabel.classList.add(`rvsFacetHeader`)
			facetLabel.classList.add(`rvsHeader`)
			facetLabel.setAttribute("for", currentFacetBy)
			facetLabel.innerHTML = facetType.title
			if( roundViewInstantSearch.uniqueId !== "3873c9508c0a36c681df5e0b146b53268e079c3f166b4fa47f43b56701a522c9" && ( facetType.attribute === "price" || facetType.attribute === "effective_price" ) && facetType.facetType === "slider" ){
				facetLabel.innerHTML += `, ${roundViewInstantSearch.currencyObj.symbol}`
			}
			facetInputCheckbox.classList.add("rvsDropdownCheckbox")
			facetInputCheckbox.id = currentFacetBy
			facetInputCheckbox.setAttribute("type", "checkbox")
			if( ( roundViewInstantSearch.uniqueId === "3873c9508c0a36c681df5e0b146b53268e079c3f166b4fa47f43b56701a522c9" && ( facetType.attribute !== "price" && facetType.attribute !== "effective_price" && facetType.attribute !== "brand" ) || facetType.collapsible ) ){
				facetInputCheckbox.setAttribute("checked", true)
			}
			facetInputCheckbox.name = "dropdown"
			facetItemContainer.classList.add(`rvsFacet${currentFacetBy.charAt(0).toUpperCase() + currentFacetBy.slice(1)}Container`)
			facetItemContainer.classList.add(`rvsFacetDropdownContainer`)
			roundViewInstantSearch.searchBoxFacetsWrapper.appendChild(facetDownWrapper)
			facetDownWrapper.appendChild(facetInputCheckbox)
			facetDownWrapper.appendChild(facetLabel)			
			facetDownWrapper.appendChild(facetItemContainer)
		}
		roundViewInstantSearch.instantSearchPageElement.appendChild(roundViewInstantSearch.searchBoxResultWrapper)
		if( !roundViewInstantSearch.tabFlag ){
			roundViewInstantSearch.searchBoxResultWrapper.appendChild(roundViewInstantSearch.resultHeaderWrapper)			
		}
		if( roundViewInstantSearch.tabFlag ){
			roundViewInstantSearch.resultHeaderWrapper.appendChild(roundViewInstantSearch.resultStatContainer)
		}
		roundViewInstantSearch.resultHeaderWrapper.appendChild(roundViewInstantSearch.resultHeaderRightWrapper)
		if( !roundViewInstantSearch.tabFlag ){
			roundViewInstantSearch.resultHeaderRightWrapper.appendChild(roundViewInstantSearch.inputWrapper)
			roundViewInstantSearch.inputWrapper.appendChild(roundViewInstantSearch.resultStatContainer)
		}
		roundViewInstantSearch.resultHeaderRightWrapper.appendChild(roundViewInstantSearch.resultChangeDisplayWrapper)
		roundViewInstantSearch.resultChangeDisplayWrapper.appendChild(roundViewInstantSearch.resultDisplayBlockWrapper)
		roundViewInstantSearch.resultChangeDisplayWrapper.appendChild(roundViewInstantSearch.resultDisplayListWrapper)
		roundViewInstantSearch.resultHeaderRightWrapper.appendChild(roundViewInstantSearch.resultSortWrapper)
		roundViewInstantSearch.rvsResultStatsText	= document.querySelector('.rvsResultStatText');
		for (let i = 0; i < roundViewInstantSearch.sortBy.length; i++) {
			let currentSortItem = roundViewInstantSearch.sortBy[i],
				option = document.createElement("div");
			option.setAttribute("data-value", currentSortItem)
			option.innerHTML = currentSortItem
			roundViewInstantSearch.resultSortContentWrapper.appendChild(option)
		}
		roundViewInstantSearch.searchBoxResultWrapper.appendChild(roundViewInstantSearch.resultContentWrapper)
		roundViewInstantSearch.instantSearchPageElement.appendChild(roundViewInstantSearch.resultPaginationContainer)
		roundViewInstantSearch.instantSearchWrapSelector.appendChild(roundViewInstantSearch.instantSearchPageElement)
		roundViewInstantSearch.reAdjust()
		window.addEventListener("resize", roundViewInstantSearch.reAdjust)
		roundViewInstantSearch.resultDisplayBlockWrapper.addEventListener("click", () => roundViewInstantSearch.changeRvsProductView("block"))
		roundViewInstantSearch.resultDisplayListWrapper.addEventListener("click", () => roundViewInstantSearch.changeRvsProductView("list"))
		roundViewInstantSearch.searchInput.addEventListener("keyup", roundViewInstantSearch.changeProductQueryString)
		roundViewInstantSearch.searchBoxMobileFilter.addEventListener("click", roundViewInstantSearch.toggleMobileFilters)
		facetMobileCloseBtn.addEventListener("click", roundViewInstantSearch.toggleMobileFilters)
		rvsMobileFacetFilterBtn.addEventListener("click", roundViewInstantSearch.toggleMobileFilters)
		rvsMobileClearBtn.addEventListener("click", roundViewInstantSearch.clearAllFilterEvent)
		roundViewInstantSearch.searchBoxForm.addEventListener("submit", roundViewInstantSearch.stopSubmitEvent)
		document.addEventListener("click", roundViewInstantSearch.documentButtonClick)
		let sortContentWrapperDiv	= roundViewInstantSearch.resultSortContentWrapper.querySelectorAll("div")
		sortContentWrapperDiv.forEach((item) => {
			item.addEventListener("click", roundViewInstantSearch.changeSortOrder)
		})
		if( document.getElementById('roundViewInstantSearchWrapper') ){
			let currentActiveClass	= 'rvsSelected'+roundViewInstantSearch.activeTab
			document.getElementById('roundViewInstantSearchWrapper').classList.remove('rvsSelectedPages')
			document.getElementById('roundViewInstantSearchWrapper').classList.remove('rvsSelectedBlogs')
			document.getElementById('roundViewInstantSearchWrapper').classList.remove('rvsSelectedProducts')
			document.getElementById('roundViewInstantSearchWrapper').classList.add(currentActiveClass)
		}

		if( roundViewInstantSearch.activeTab === "Products" ){
			roundViewInstantSearch.searchBoxFacetsWrapper.classList.remove('cbHidden')
			roundViewInstantSearch.searchBoxResultWrapper.classList.remove('cbFullWidth')
		}else{
			roundViewInstantSearch.searchBoxFacetsWrapper.classList.add('cbHidden')
			roundViewInstantSearch.searchBoxResultWrapper.classList.add('cbFullWidth')
		}
		let tabContentListItemLinks	= document.querySelectorAll(".rvSearchResultTabListItem a")
		if( tabContentListItemLinks ){
			tabContentListItemLinks.forEach((item) => {
				item.addEventListener("click", roundViewInstantSearch.tabContentItemLinkClicked)
			})
		}
	},

	tabContentItemLinkClicked: (e) => {
		let currentItem	= e.target
			currentTab	= currentItem.closest('a').getAttribute("data-tab-content")
		if( roundViewInstantSearch.activeTab !== currentTab ){
			if( currentItem.closest(".rvSearchResultTabListItem") ) {
				if( document.querySelector(".rvSearchResultTabListItemActive") ){
					document.querySelector(".rvSearchResultTabListItemActive").classList.remove("rvSearchResultTabListItemActive")
				}
				currentItem.closest(".rvSearchResultTabListItem").classList.add("rvSearchResultTabListItemActive")
			}
			roundViewInstantSearch.activeTab	= currentTab
			let currentUrl = window.location.href,
				searchParams = new URLSearchParams(window.location.search);
			if (searchParams.has('tab')) {
				searchParams.set("tab", roundViewInstantSearch.activeTab)
			}else{
				searchParams.append("tab", roundViewInstantSearch.activeTab)
			}
			if( document.getElementById('roundViewInstantSearchWrapper') ){
				let currentActiveClass	= 'rvsSelected'+roundViewInstantSearch.activeTab
				document.getElementById('roundViewInstantSearchWrapper').classList.remove('rvsSelectedPages')
				document.getElementById('roundViewInstantSearchWrapper').classList.remove('rvsSelectedBlogs')
				document.getElementById('roundViewInstantSearchWrapper').classList.remove('rvsSelectedProducts')
				document.getElementById('roundViewInstantSearchWrapper').classList.add(currentActiveClass)
			}
			if( roundViewInstantSearch.activeTab === "Products" ){
				roundViewInstantSearch.searchBoxFacetsWrapper.classList.remove('cbHidden')
				roundViewInstantSearch.searchBoxResultWrapper.classList.remove('cbFullWidth')
			}else{
				roundViewInstantSearch.searchBoxFacetsWrapper.classList.add('cbHidden')
				roundViewInstantSearch.searchBoxResultWrapper.classList.add('cbFullWidth')
			}
			if( roundViewInstantSearch.activeTab === "Blogs" ){
				roundViewInstantSearch.renderBlogs()
			}else if( roundViewInstantSearch.activeTab === "Pages" ){
				roundViewInstantSearch.renderPages()
			}else{
				roundViewInstantSearch.renderProducts()
			}
			let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
			window.history.pushState({}, '', newUrl);
		}
	},

	toggleMobileFilters: (e) => {
		console.log(e, "Event")
		if( e ){
			if( roundViewInstantSearch.searchBoxFacetsWrapper ){
				if( roundViewInstantSearch.searchBoxFacetsWrapper.style.display === "flex" ){				
					document.body.style.overflow = 'auto';
					roundViewInstantSearch.searchBoxMobileFilter.innerHTML	= "Filters"
					roundViewInstantSearch.searchBoxFacetsWrapper.style.display	= "none"
				}else{
					document.body.style.overflow = 'hidden';
					document.querySelectorAll('.rvsDropdownCheckbox').forEach(function(checkbox) {
						checkbox.checked = true;
					});
					roundViewInstantSearch.searchBoxFacetsWrapper.style.display	= "flex"
					roundViewInstantSearch.searchBoxMobileFilter.innerHTML	= "Filters"
				}
			}
		}
	},

	stopSubmitEvent: (e) => {
		e.preventDefault()
	},

	reAdjust: () => {
		const width = roundViewInstantSearch.searchBoxResultWrapper.offsetWidth;
		let minWidth	= 245
		if( roundViewInstantSearch.template === "design1" || roundViewInstantSearch.template === "design2" ){
			minWidth	= 190
		}
		if( roundViewInstantSearch.columnClass === "autoColumn" && width > 540 ){
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
			roundViewInstantSearch.instantSearchWrapSelector.classList.add('rvsResultMobileDesign');
		}else{
			roundViewInstantSearch.instantSearchWrapSelector.classList.remove('rvsResultMobileDesign');
		}
		if( width > 540 ){
			console.log(width, "Width")
			document.body.style.overflow	= "initial"
			if( roundViewInstantSearch.searchBoxFacetsWrapper && roundViewInstantSearch.searchBoxFacetsWrapper.style.display	=== "none" ){
				roundViewInstantSearch.searchBoxFacetsWrapper.style.display	= "flex"
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
		if (typeof roundViewInstantSearch.queryStringParams["q"] !== "undefined") {
			roundViewInstantSearch.searchInput.value = roundViewInstantSearch.queryStringParams["q"]
		}
		if (typeof roundViewInstantSearch.queryStringParams["page"] !== "undefined") {
			roundViewInstantSearch.page = roundViewInstantSearch.queryStringParams["page"]
		}
		if (typeof roundViewInstantSearch.queryStringParams["blog_page"] !== "undefined") {
			roundViewInstantSearch.blogPage = roundViewInstantSearch.queryStringParams["blog_page"]
		}
		if (typeof roundViewInstantSearch.queryStringParams["page_page"] !== "undefined") {
			roundViewInstantSearch.pagePage = roundViewInstantSearch.queryStringParams["page_page"]
		}
		if (typeof roundViewInstantSearch.queryStringParams["sort_by"] !== "undefined") {
			roundViewInstantSearch.activeSortItem = roundViewInstantSearch.queryStringParams["sort_by"]
		}
		if (typeof roundViewInstantSearch.queryStringParams["price_range"] !== "undefined") {
			roundViewInstantSearch.priceFilterValue = roundViewInstantSearch.queryStringParams["price_range"]
		}
		
		let filterByQuery = roundViewInstantSearch.groupParamsIntoArrays(window.location.href)
		roundViewInstantSearch.filterList = { ...filterByQuery.filter_by }
		if( roundViewInstantSearch.tabFlag ){
			await roundViewInstantSearch.fetchAllItems()
		}else{
			await roundViewInstantSearch.findProducts()
		}
		roundViewInstantSearch.renderSelectedFilter()
	},

	createTypeSenseClient: async () => {
		let config = roundViewInstantSearch.typeSenseConfig
		roundViewInstantSearch.tablePrefix = config.tablePrefix;
		try {
			roundViewInstantSearch.typeSenseClient = new Typesense.Client({
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
		if( roundViewInstantSearch.instantSearchConfig && roundViewInstantSearch.instantSearchConfig.flipImageHover ){
			for( let i = 0; i < product.product_images.length; i++ ){
				if( product.image !== product.product_images[i] ){
					return	`<img src="${product.product_images[i]}" alt="${product.name}" class="rvSRItemImage rvSRFlipImage" border="0" loading="lazy" />`
				}
			}
		}
		return ""
	},

	fetchAllItems: async() => {
		let indexConfig	= window.conversionBoxSearch.config.indexConfig,
			query = roundViewInstantSearch.queryStringParams["q"] ? roundViewInstantSearch.queryStringParams["q"] : "",
			currentSortObject = roundViewInstantSearch.sortItems[roundViewInstantSearch.activeSortItem],
			tablePrefix = roundViewInstantSearch.tablePrefix,
			productTable = tablePrefix + "products",
			pageTable	= tablePrefix + "pages",
			blogTable	= tablePrefix + "blogs",
			searchProductParameters = null,
			searchPageParameters	= null,
			searchBlogParameters	= null,
			searchRequests = {
				'searches': []
			},
			commonSearchParams = {
				'typo_tokens_threshold': 1,
				'num_typos': 2,
				'min_len_1typo': 4,
				'min_len_2typo': 4,
				max_facet_values: 1000
			};
		roundViewInstantSearch.searchQueryIndex	= []
		if (indexConfig.index_products == "true") {
			searchProductParameters = {
				collection: productTable,
				q: query,
				query_by: "name,description,categories,sku,brand",
				per_page: roundViewInstantSearch.noOfProducts,
				page: roundViewInstantSearch.page,
				filter_by: `channel_ids:=[${roundViewInstantSearch.channelId}] && is_visible:=1`,
				include_fields: "id, url, image, name, brand, description, sku, product_images, price, variants, sale_price, stock_qty",
				sort_by: "_text_match:desc",
				facets: true,
				max_facet_values: 1000,
				facet_by: roundViewInstantSearch.facetBy.join(","),
			}
			if( roundViewInstantSearch.outOfStock !== null && roundViewInstantSearch.outOfStock === false ){
				searchProductParameters["filter_by"]	+= ` && in_stock:=1`
			}

			if (currentSortObject && typeof currentSortObject !== "undefined") {
				searchProductParameters["sort_by"] = `${currentSortObject.attribute}:${currentSortObject.sort}`
			}
	
			for (let [key, value] of Object.entries(roundViewInstantSearch.filterList)) {
				if (roundViewInstantSearch.facetBy.indexOf(key) !== -1) {
					let facetType = roundViewInstantSearch.facetItems[key].facetType
					if (facetType === "conjunctive") {
						for (let i = 0; i < value.length; i++) {
							if (searchProductParameters["filter_by"] !== "") {
								searchProductParameters["filter_by"] += " && "
							}
							searchProductParameters["filter_by"] += `${key}:=${value[i]}`
						}
					} else if (facetType === "disjunctive") {
						if (value.length > 0) {
							if (searchProductParameters["filter_by"] !== "") {
								searchProductParameters["filter_by"] += " && "
							}
							searchProductParameters["filter_by"] += " ( "
							for (let i = 0; i < value.length; i++) {
								if (i > 0) {
									searchProductParameters["filter_by"] += " || "
								}
								searchProductParameters["filter_by"] += `${key}:=${value[i]}`
							}
							searchProductParameters["filter_by"] += " ) "
						}
					}
				}
			}
			if (roundViewInstantSearch.priceFilterValue !== null) {
				if (searchProductParameters["filter_by"] !== "") {
					searchProductParameters["filter_by"] += `&& `
				}
				let splitPriceFilter	= roundViewInstantSearch.priceFilterValue.split(".."),
					minPrice	= parseInt(roundViewInstantSearch.revertPrice(splitPriceFilter[0])),
					maxPrice	= parseInt(roundViewInstantSearch.revertPrice(splitPriceFilter[1]))
					searchProductParameters["filter_by"] += `${roundViewInstantSearch.currentPriceFacetAttribute}:[${minPrice}..${maxPrice}]`
			}
			searchRequests.searches.push(searchProductParameters)
			roundViewInstantSearch.searchQueryIndex.push("products")
		}
		if ( indexConfig.index_pages === "true" ){
			searchPageParameters	= {
												collection: pageTable,
												q: query,
												query_by: "name, description",
												per_page: roundViewInstantSearch.noOfPages,
												page: roundViewInstantSearch.pagePage,
												filter_by: `channel_id:[${roundViewInstantSearch.channelId}] && is_visible:=1`,
												sort_by: '_text_match:desc'
											}
			searchRequests.searches.push(searchPageParameters)
			roundViewInstantSearch.searchQueryIndex.push("pages")
		}
		if( indexConfig.index_blogs === "true" ){
			searchBlogParameters	= {
												collection: blogTable,
												q: query,
												query_by: "name,description,tags,author",
												per_page: roundViewInstantSearch.noOfBlogs,
												page: roundViewInstantSearch.blogPage,
												filter_by: `is_published:=1`,
												sort_by: '_text_match:desc'
											}
			searchRequests.searches.push(searchBlogParameters)
			roundViewInstantSearch.searchQueryIndex.push("blogs")
		}
		try {
			//roundViewInstantSearch.instantSearchWrapSelector.innerHTML = ''
			//roundViewInstantSearch.instantSearchWrapSelector.appendChild(roundViewInstantSearch.instantSearchPageElement)
			roundViewInstantSearch.rvsResultStatsText = document.querySelector('.rvsResultStatText')
			let searchResult = await roundViewInstantSearch.typeSenseClient.multiSearch.perform(searchRequests, commonSearchParams),
				currentProductResult	= searchResult.results[roundViewInstantSearch.searchQueryIndex.indexOf("products")],
				currentPageResult	= searchResult.results[roundViewInstantSearch.searchQueryIndex.indexOf("pages")],
				currentBlogResult	= searchResult.results[roundViewInstantSearch.searchQueryIndex.indexOf("blogs")]
			roundViewInstantSearch.productResults[currentProductResult.page]	= currentProductResult
			if( currentPageResult ){
				roundViewInstantSearch.pageResults[currentPageResult.page]	= currentPageResult
			}
			if( currentBlogResult ){
				roundViewInstantSearch.blogResults[currentBlogResult.page]	= currentBlogResult
			}
			if( document.querySelector('.rvSRProductsCount') ){
				document.querySelector('.rvSRProductsCount').innerHTML	= currentProductResult.found
			}
			
			if( document.querySelector('.rvSRPagesCount') ){
				document.querySelector('.rvSRPagesCount').innerHTML	= currentPageResult.found
			}

			if( document.querySelector('.rvSRBlogsCount') ){
				document.querySelector('.rvSRBlogsCount').innerHTML	= currentBlogResult.found
			}
			if( roundViewInstantSearch.activeTab === "Products" ){
				await roundViewInstantSearch.renderProducts()
			}else if( roundViewInstantSearch.activeTab === "Pages" ){
				await roundViewInstantSearch.renderPages()
				roundViewInstantSearch.searchBoxFacetsWrapper.classList.add("cbHidden")
			}else if( roundViewInstantSearch.activeTab === "Blogs" ){
				roundViewInstantSearch.searchBoxFacetsWrapper.classList.add("cbHidden")
				await roundViewInstantSearch.renderBlogs()
			}
		} catch (e) {
			console.log(e)
			console.log("Error in fetching documents")
			return null
		}
	},

	findProducts: async () => {
		findProductFlag	= true;
		let query = roundViewInstantSearch.queryStringParams["q"] ? roundViewInstantSearch.queryStringParams["q"] : "",
			currentSortObject = roundViewInstantSearch.sortItems[roundViewInstantSearch.activeSortItem],
			searchParameters = { q: query, typo_tokens_threshold: 1, num_typos: 2, min_len_1typo: 4, min_len_2typo: 4, per_page: roundViewInstantSearch.noOfProducts, query_by: "name,description,categories,sku,brand", page: roundViewInstantSearch.page, max_facet_values: 1000 };
		searchParameters["facet_by"] = roundViewInstantSearch.facetBy;
		if (currentSortObject && typeof currentSortObject !== "undefined") {
			searchParameters["sort_by"] = `${currentSortObject.attribute}:${currentSortObject.sort}`
		}
		let requestQuery = `channel_ids:=[${roundViewInstantSearch.channelId}] && is_visible:=1`
		if( cbCategoryId ){
			let categoryId	= [];
			categoryId.push(cbCategoryId);
			if( typeof window.conversionBoxCategoryConfig.children !== "undefined" && window.conversionBoxCategoryConfig.children !== "" ){
				let rawJson	= window.conversionBoxCategoryConfig.children,
					childCategories	= []
				try{
					childCategories	= JSON.parse(rawJson.replace(/&quot;/g, '"').replace(/,"description":.*?(","url"|})/g, ',"url"').replace(/,"name":.*?(","url"|})/g, ',"url"'));
				}catch(e){
					console.log(e)
				}
				for( let z = 0; z < childCategories.length; z++ ){
					let currentCategory	= childCategories[z];
					if( currentCategory.id ){
						categoryId.push(currentCategory.id)
					}
				}
			}
			requestQuery	+= ` && category_ids:=[${categoryId.join(",")}]`
		}

		if( roundViewInstantSearch.outOfStock !== null && roundViewInstantSearch.outOfStock === false ){
			requestQuery	+= ` && in_stock:=1`
		}

		for (let [key, value] of Object.entries(roundViewInstantSearch.filterList)) {
			if (roundViewInstantSearch.facetBy.indexOf(key) !== -1) {
				let facetType = roundViewInstantSearch.facetItems[key].facetType
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
		if (roundViewInstantSearch.priceFilterValue !== null) {
			if (requestQuery !== "") {
				requestQuery += `&& `
			}
			let splitPriceFilter	= roundViewInstantSearch.priceFilterValue.split(".."),
				minPrice	= parseInt(roundViewInstantSearch.revertPrice(splitPriceFilter[0])),
				maxPrice	= parseInt(roundViewInstantSearch.revertPrice(splitPriceFilter[1]))
			requestQuery += `${roundViewInstantSearch.currentPriceFacetAttribute}:[${minPrice}..${maxPrice}]`
		}
		searchParameters['filter_by'] = requestQuery
		roundViewInstantSearch.rvsResultStatsText = document.querySelector('.rvsResultStatText')
		let searchResults	= await roundViewInstantSearch.typeSenseClient.collections(`${roundViewInstantSearch.tablePrefix}products`).documents().search(searchParameters);
		roundViewInstantSearch.productResults[searchResults.page]	= searchResults
		await roundViewInstantSearch.renderProducts()
	},

	findPages: async () => {
		let query = roundViewInstantSearch.queryStringParams["q"] ? roundViewInstantSearch.queryStringParams["q"] : "",
			searchParameters = { q: query, typo_tokens_threshold: 1, num_typos: 2, min_len_1typo: 4, min_len_2typo: 4, per_page: roundViewInstantSearch.noOfPages, query_by: "name,description", page: roundViewInstantSearch.pagePage, filter_by: `channel_id:[${roundViewInstantSearch.channelId}] && is_visible:=1`, sort_by: '_text_match:desc' },
			searchResults	= await roundViewInstantSearch.typeSenseClient.collections(`${roundViewInstantSearch.tablePrefix}pages`).documents().search(searchParameters);
		roundViewInstantSearch.rvsResultStatsText = document.querySelector('.rvsResultStatText')
		roundViewInstantSearch.pageResults[searchResults.page]	= searchResults
		await roundViewInstantSearch.renderPages()
	},

	findBlogs: async () => {
		let query = roundViewInstantSearch.queryStringParams["q"] ? roundViewInstantSearch.queryStringParams["q"] : "",
			searchParameters = { q: query, typo_tokens_threshold: 1, num_typos: 2, min_len_1typo: 4, min_len_2typo: 4, per_page: roundViewInstantSearch.noOfBlogs, query_by: "name,description,tags,author", page: roundViewInstantSearch.blogPage, filter_by: `is_published:=1`, sort_by: '_text_match:desc' },
			searchResults	= await roundViewInstantSearch.typeSenseClient.collections(`${roundViewInstantSearch.tablePrefix}blogs`).documents().search(searchParameters);
		roundViewInstantSearch.blogResults[searchResults.page]	= searchResults
		roundViewInstantSearch.rvsResultStatsText = document.querySelector('.rvsResultStatText')
		await roundViewInstantSearch.renderBlogs()
	},

	productClickEvent: (event, product) => {
		event.preventDefault()
		const isModifiedClick = event.ctrlKey || event.metaKey;
		let { min, max }	= roundViewInstantSearch.getPriceRange(product);
		product["minPrice"]	= min
		product["maxPrice"]	= max
		roundViewInstantSearch.productClickTracking(product)		
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
			let query = roundViewInstantSearch.queryStringParams["q"] ? roundViewInstantSearch.queryStringParams["q"] : ""
			if(!roundViewInstantSearch.sessionID){
				window.searchThree.getSessionID()
				roundViewInstantSearch.sessionID	= window.searchThree.sessionID
			}
			const postData = {
				uniqueId: roundViewInstantSearch.uniqueId,
				searchKey: query,
				product: product,
				sessionId: roundViewInstantSearch.sessionID,
				searchType: cbCategoryId ? "collection" : "instantsearch",
			},
				response = await fetch(`${roundViewInstantSearch.analyticsURL}/api/v1/analytics/productClickLog`, {
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

	renderProducts: async() => {
		let searchResults		= roundViewInstantSearch.productResults[roundViewInstantSearch.page],
			facetByAnalytics	= {...roundViewInstantSearch.filterList},
			query = roundViewInstantSearch.queryStringParams["q"] ? roundViewInstantSearch.queryStringParams["q"] : "",
			currentSortObject = roundViewInstantSearch.sortItems[roundViewInstantSearch.activeSortItem]
		if( roundViewInstantSearch.priceFilterValue ){
			facetByAnalytics["price_filter"]	= roundViewInstantSearch.priceFilterValue
		}
		if( cbCategoryId === "" ){
			roundViewInstantSearch.hitSearchAnalytics(query, searchResults, currentSortObject, facetByAnalytics, roundViewInstantSearch.page)
		}else if ( query !== "" ){
			roundViewInstantSearch.hitSearchAnalytics(query, searchResults, currentSortObject, facetByAnalytics, roundViewInstantSearch.page)
		}
		roundViewInstantSearch.resultHeaderWrapper.removeAttribute("hidden")
		roundViewInstantSearch.searchBoxFacetsWrapper.removeAttribute("hidden")
		roundViewInstantSearch.resultContentWrapper.innerHTML = ""
		if (searchResults.hits.length === 0) {
			roundViewInstantSearch.resultContentWrapper.innerHTML = `<div class="rvsRecords rvsRecordsEmpty"><div class="rvsRecordEmpty"><div class="rvsRecordEmptyTitle">No result found</div><div class="rvsRecordEmptyClears">Try  <a class="rvsRecordEmptyClearFilters rvsLinkItem">clearing the filters  </a>or  <a class="rvsRecordEmptyClearInput rvsLinkItem">changing your input</a></div></div></div>`
			if (roundViewInstantSearch.rvsResultStatsText) {
				roundViewInstantSearch.rvsResultStatsText.innerHTML = `No result found in ${searchResults.search_time_ms}ms`
			}
			return
		}
		if (searchResults.hits.length > 1) {
			if (roundViewInstantSearch.rvsResultStatsText) {
				roundViewInstantSearch.rvsResultStatsText.innerHTML = `${((searchResults.page - 1) * searchResults.request_params.per_page) + 1} - ${(searchResults.found > (((searchResults.page - 1) * searchResults.request_params.per_page) + searchResults.request_params.per_page)) ? (((searchResults.page - 1) * searchResults.request_params.per_page) + searchResults.request_params.per_page) : searchResults.found} out of <span class="rvsStatsNoResults"> ${searchResults.found} results found</span> in ${searchResults.search_time_ms}ms`
			}
		} else {
			if (roundViewInstantSearch.rvsResultStatsText) {
				roundViewInstantSearch.rvsResultStatsText.innerHTML = `<span class="rvsStatsNoResults"> ${searchResults.found} results found</span> in ${searchResults.search_time_ms}ms`
			}
		}
		let aiResultWrapper = document.createElement("div"),
			aiResultListWrap = document.createElement("ol")
		aiResultWrapper.classList.add("rvsResultWrapper")
		aiResultListWrap.classList.add("rvResultListWrap")
		aiResultListWrap.classList.add(roundViewInstantSearch.columnClass)
		aiResultListWrap.classList.add(roundViewInstantSearch.template)
		roundViewInstantSearch.instantSearchPageElement.classList.add(roundViewInstantSearch.template)
		roundViewInstantSearch.resultContentWrapper.appendChild(aiResultWrapper)
		aiResultWrapper.appendChild(aiResultListWrap)
		let intermediateResults = searchResults.hits;
		for (let i = 0; i < intermediateResults.length; i++) {
			let aiResultListItem = document.createElement("li"),
				val = intermediateResults[i],
				valDocument	= val.document
			aiResultListItem.classList.add("rvsResultListItem")
			aiResultListItem.setAttribute("data-product-id", valDocument.id)
			aiResultListItem.innerHTML	= `
														<a href="#" class="rvSRProductLink" draggable="false" onclick="window.roundViewInstantSearch.productClickEvent(event, ${JSON.stringify(valDocument).replace(/"/g, '&quot;')})">
															<div class="rvSRItem">
																<div class="rvSRThumnailWrapper">
																	<span class="rvSRThumbnail">
																		<img src="${valDocument.image ? valDocument.image : "https://storage.googleapis.com/roundclicksview/No%20Product%20Image%20Available.png"}" class="rvSRItemImage " alt="" border="0" loading="lazy">
																		`+roundViewInstantSearch.getFlipImage(valDocument)+`
																	</span>
																</div>
																<span class="rvSROverHidden">
																	<span class="rvSRTitle" style="-webkit-line-clamp: ${( roundViewInstantSearch.instantSearchConfig && roundViewInstantSearch.instantSearchConfig.titleMaxLines ) ? roundViewInstantSearch.instantSearchConfig.titleMaxLines : 2 };">${valDocument.name}</span>
																	${( ( roundViewInstantSearch.instantSearchConfig && roundViewInstantSearch.instantSearchConfig.showVendor ) && valDocument.brand ) ?
																		`<span class="rvSRBrand">By ${valDocument.brand}</span>`
																	:
																		""
																	}
																	${( roundViewInstantSearch.instantSearchConfig && roundViewInstantSearch.instantSearchConfig.showDescription && valDocument.description ) ?
																		`<span class="rvSRDescription" style="-webkit-line-clamp: ${roundViewInstantSearch.instantSearchConfig.titleMaxLines};">${valDocument.description}</span>`
																	:
																		""
																	}
																	${( roundViewInstantSearch.instantSearchConfig && roundViewInstantSearch.instantSearchConfig.showSKU && valDocument.sku ) ? `<div class="rvSRSKU">${valDocument.sku}</div>`: ""}
																	${ roundViewInstantSearch.instantSearchConfig && ( typeof roundViewInstantSearch.instantSearchConfig.showPrice === "undefined" || roundViewInstantSearch.instantSearchConfig.showPrice ) ?
																		`<div class="rvSRPriceList">
																			<span class="rvSRPrice">`+roundViewInstantSearch.formatPrice(valDocument)+`</span>
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
		roundViewInstantSearch.updateDisplayProductView(roundViewInstantSearch.displayView)
		document.dispatchEvent(cbProductRendered)
		roundViewInstantSearch.resultPaginationContainer.innerHTML = ``
		if (searchResults.found > roundViewInstantSearch.noOfProducts) {
			let totalPages = Math.ceil(searchResults.found / roundViewInstantSearch.noOfProducts),
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
			roundViewInstantSearch.resultPaginationContainer.appendChild(rvsPaginationList)
			roundViewInstantSearch.paginationEvent();
		}
		await roundViewInstantSearch.renderFilterOptions(searchResults)
		roundViewInstantSearch.reAdjust()
		if( roundViewInstantSearch.initialLoader ){
			roundViewInstantSearch.initialLoader	= false
			// if( roundViewInstantSearch.priceFilterValue !== null ){
			// 	roundViewInstantSearch.findProducts()
			// }
		}
	},

	renderPages: async() => {
		let searchResults		= roundViewInstantSearch.pageResults[roundViewInstantSearch.pagePage]
		if (searchResults.hits.length === 0) {
			roundViewInstantSearch.resultContentWrapper.innerHTML = `<div class="rvsRecords rvsRecordsEmpty"><div class="rvsRecordEmpty"><div class="rvsRecordEmptyTitle">No result found</div><div class="rvsRecordEmptyClears">Try  <a class="rvsRecordEmptyClearFilters rvsLinkItem">clearing the filters  </a>or  <a class="rvsRecordEmptyClearInput rvsLinkItem">changing your input</a></div></div></div>`
			if (roundViewInstantSearch.rvsResultStatsText) {
				roundViewInstantSearch.rvsResultStatsText.innerHTML = `No result found in ${searchResults.search_time_ms}ms`
			}
			return
		}
		if (searchResults.hits.length > 1) {
			if (roundViewInstantSearch.rvsResultStatsText) {
				roundViewInstantSearch.rvsResultStatsText.innerHTML = `${((searchResults.page - 1) * searchResults.request_params.per_page) + 1} - ${(searchResults.found > (((searchResults.page - 1) * searchResults.request_params.per_page) + searchResults.request_params.per_page)) ? (((searchResults.page - 1) * searchResults.request_params.per_page) + searchResults.request_params.per_page) : searchResults.found} out of <span class="rvsStatsNoResults"> ${searchResults.found} results found</span> in ${searchResults.search_time_ms}ms`
			}
		} else {
			if (roundViewInstantSearch.rvsResultStatsText) {
				roundViewInstantSearch.rvsResultStatsText.innerHTML = `<span class="rvsStatsNoResults"> ${searchResults.found} results found</span> in ${searchResults.search_time_ms}ms`
			}
		}
		roundViewInstantSearch.resultContentWrapper.innerHTML = ""
		roundViewInstantSearch.resultPaginationContainer.innerHTML = ``
		roundViewInstantSearch.resultContentWrapper.classList.remove('rvsResultContentAsList')
		roundViewInstantSearch.resultContentWrapper.classList.remove('rvsResultContentAsBlock')
		let aiResultWrapper = document.createElement("div"),
			aiResultListWrap = document.createElement("ol")
		aiResultWrapper.classList.add("rvsResultWrapper")
		aiResultListWrap.classList.add("rvResultListWrap")
		roundViewInstantSearch.instantSearchPageElement.classList.remove(roundViewInstantSearch.template)
		roundViewInstantSearch.resultContentWrapper.appendChild(aiResultWrapper)
		aiResultWrapper.appendChild(aiResultListWrap)
		let intermediateResults = searchResults.hits;
		for (let i = 0; i < intermediateResults.length; i++) {
			let aiResultListItem = document.createElement("li"),
				val = intermediateResults[i],
				valDocument	= val.document
			//aiResultListItem.classList.add("rvsResultListItem")
			aiResultListItem.classList.add("rvsResultPageList")
			aiResultListItem.setAttribute("data-page-id", valDocument.id)
			aiResultListItem.innerHTML	= `
														<a href="${valDocument.url}" class="rvSRProductLink" draggable="false">
															<div class="rvSRItem">
																<span class="rvSROverHidden">
																	<span class="rvSRTitle">${valDocument.name}</span>
																	<span class="rvSRDescription">${valDocument.description}</span>
																</span>
															</div>
														</a>
													`
			aiResultListWrap.appendChild(aiResultListItem)
		}
		if (searchResults.found > roundViewInstantSearch.noOfPages) {
			let totalPages = Math.ceil(searchResults.found / roundViewInstantSearch.noOfPages),
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
			roundViewInstantSearch.resultPaginationContainer.appendChild(rvsPaginationList)
			roundViewInstantSearch.paginationEvent();
		}
	},

	renderBlogs: async() => {
		let searchResults		= roundViewInstantSearch.blogResults[roundViewInstantSearch.blogPage]
		roundViewInstantSearch.resultContentWrapper.innerHTML = ""
		if (searchResults.hits.length === 0) {
			roundViewInstantSearch.resultContentWrapper.innerHTML = `<div class="rvsRecords rvsRecordsEmpty"><div class="rvsRecordEmpty"><div class="rvsRecordEmptyTitle">No result found</div><div class="rvsRecordEmptyClears">Try  <a class="rvsRecordEmptyClearFilters rvsLinkItem">clearing the filters  </a>or  <a class="rvsRecordEmptyClearInput rvsLinkItem">changing your input</a></div></div></div>`
			if (roundViewInstantSearch.rvsResultStatsText) {
				roundViewInstantSearch.rvsResultStatsText.innerHTML = `No result found in ${searchResults.search_time_ms}ms`
			}
			return
		}
		if (searchResults.hits.length > 1) {
			if (roundViewInstantSearch.rvsResultStatsText) {
				roundViewInstantSearch.rvsResultStatsText.innerHTML = `${((searchResults.page - 1) * searchResults.request_params.per_page) + 1} - ${(searchResults.found > (((searchResults.page - 1) * searchResults.request_params.per_page) + searchResults.request_params.per_page)) ? (((searchResults.page - 1) * searchResults.request_params.per_page) + searchResults.request_params.per_page) : searchResults.found} out of <span class="rvsStatsNoResults"> ${searchResults.found} results found</span> in ${searchResults.search_time_ms}ms`
			}
		} else {
			if (roundViewInstantSearch.rvsResultStatsText) {
				roundViewInstantSearch.rvsResultStatsText.innerHTML = `<span class="rvsStatsNoResults"> ${searchResults.found} results found</span> in ${searchResults.search_time_ms}ms`
			}
		}
		let aiResultWrapper = document.createElement("div"),
			aiResultListWrap = document.createElement("ol")
		aiResultWrapper.classList.add("rvsResultWrapper")
		aiResultListWrap.classList.add("rvResultListWrap")
		aiResultListWrap.classList.add("autoColumn")
		aiResultListWrap.classList.add("design1")
		roundViewInstantSearch.resultContentWrapper.appendChild(aiResultWrapper)
		aiResultWrapper.appendChild(aiResultListWrap)
		let intermediateResults = searchResults.hits;
		for (let i = 0; i < intermediateResults.length; i++) {
			let aiResultListItem = document.createElement("li"),
				val = intermediateResults[i],
				valDocument	= val.document
			aiResultListItem.classList.add("rvsResultListItem")
			aiResultListItem.classList.add("rvsResultBlogList")
			aiResultListItem.setAttribute("data-blog-id", valDocument.id)
			aiResultListItem.innerHTML	= `
														<a href="${valDocument.url}" class="rvSRProductLink" draggable="false">
															<div class="rvSRItem">
																<div class="rvSRThumnailWrapper">
																	<span class="rvSRThumbnail">
																		<img src="${valDocument.thumbnail_path ? valDocument.thumbnail_path : "https://storage.googleapis.com/roundclicksview/No%20Product%20Image%20Available.png"}" class="rvSRItemImage " alt="" border="0" loading="lazy">
																	</span>
																</div>
																<span class="rvSROverHidden">
																	<span class="rvSRTitle">${valDocument.name}</span>
																	<span class="rvSRDescription">${valDocument.description}</span>
																</span>
															</div>
														</a>
													`
			aiResultListWrap.appendChild(aiResultListItem)
		}
		roundViewInstantSearch.updateDisplayProductView("block")
		roundViewInstantSearch.resultPaginationContainer.innerHTML = ``
		if (searchResults.found > roundViewInstantSearch.noOfBlogs) {
			let totalPages = Math.ceil(searchResults.found / roundViewInstantSearch.noOfBlogs),
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
			roundViewInstantSearch.resultPaginationContainer.appendChild(rvsPaginationList)
			roundViewInstantSearch.paginationEvent();
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
		document.querySelectorAll('a.rvsPaginationLink').forEach((link) => link.removeEventListener("click", roundViewInstantSearch.paginationClickEvent))
		document.querySelectorAll('a.rvsPaginationLink').forEach((link) => link.addEventListener("click", roundViewInstantSearch.paginationClickEvent))
	},

	paginationClickEvent: (e) => {
		e.preventDefault()
		let page	= e.target.dataset.page,
			currentUrl = window.location.href,
			searchParams = new URLSearchParams(window.location.search);
		if( page ){
			let searchPageParam	= 'page'
			if( roundViewInstantSearch.activeTab === "Products" ){
				roundViewInstantSearch.page	= page
			}else if( roundViewInstantSearch.activeTab === "Pages" ){
				roundViewInstantSearch.pagePage	= page
				searchPageParam	= "page_page"
			}else if( roundViewInstantSearch.activeTab === "Blogs" ){
				roundViewInstantSearch.blogPage	= page
				searchPageParam	= "blog_page"
			}
			if (searchParams.has(searchPageParam)) {
				searchParams.set(searchPageParam, page)
			} else {
				searchParams.append(searchPageParam, page)
			}
			let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
			window.history.pushState({}, '', newUrl);
			roundViewInstantSearch.searchBoxWrapper.scrollIntoView()
			if( roundViewInstantSearch.activeTab === "Products" ){
				if( typeof roundViewInstantSearch.productResults[page] !== "undefined" ){
					roundViewInstantSearch.renderProducts()
				}else{
					roundViewInstantSearch.findProducts()
				}
			}else if( roundViewInstantSearch.activeTab === "Pages" ){
				if( typeof roundViewInstantSearch.pageResults[page] !== "undefined" ){
					roundViewInstantSearch.renderPages()
				}else{
					roundViewInstantSearch.findPages()
				}
			}else if( roundViewInstantSearch.activeTab === "Blogs" ){
				if( typeof roundViewInstantSearch.blogResults[page] !== "undefined" ){
					roundViewInstantSearch.renderBlogs()
				}else{
					roundViewInstantSearch.findBlogs()
				}
			}
		}
	},

	changeRvsProductView: async (type) => {
		if (type === roundViewInstantSearch.displayView) {
			return
		}
		roundViewInstantSearch.updateDisplayProductView(type)
	},

	updateDisplayProductView: async (type) => {
		if (type === "block") {
			roundViewInstantSearch.displayView = "block"
			roundViewInstantSearch.resultDisplayListWrapper.classList.remove("rvsResultDisplaySelected")
			roundViewInstantSearch.resultDisplayBlockWrapper.classList.add("rvsResultDisplaySelected")
			roundViewInstantSearch.resultContentWrapper.classList.remove("rvsResultContentAsList")
			roundViewInstantSearch.resultContentWrapper.classList.add("rvsResultContentAsBlock")
		} else {
			roundViewInstantSearch.displayView = "list"
			roundViewInstantSearch.resultDisplayBlockWrapper.classList.remove("rvsResultDisplaySelected")
			roundViewInstantSearch.resultDisplayListWrapper.classList.add("rvsResultDisplaySelected")
			roundViewInstantSearch.resultContentWrapper.classList.remove("rvsResultContentAsBlock")
			roundViewInstantSearch.resultContentWrapper.classList.add("rvsResultContentAsList")
		}
	},

	changeSortOrder: async (e) => {
		let value = e.target.getAttribute("data-value")
		let spanSelector		 = roundViewInstantSearch.resultSortWrapperBtn.querySelector('span')
		if( spanSelector ){
			spanSelector.innerHTML	= value
		}
		roundViewInstantSearch.activeSortItem = value
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
		roundViewInstantSearch.productResults	= {}
		roundViewInstantSearch.findProducts()
	},

	changeProductQueryString: async (e) => {
		if (e.key === 'Escape' || roundViewInstantSearch.queryStringParams["q"] === e.target.value) {
			return
		}
		let value = e.target.value
		roundViewInstantSearch.queryStringParams["q"] = value
		let currentUrl = window.location.href;
		let searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has('q') && value !== "") {
			searchParams.set('q', value);
		} else if (value !== "") {
			searchParams.append('q', value);
		} else {
			searchParams.delete('q')
		}
		if (searchParams.has("page")) {
			searchParams.delete("page")
		}
		if (searchParams.has("price_range")) {
			searchParams.delete("price_range")
		}
		roundViewInstantSearch.priceFilterValue	= null
		roundViewInstantSearch.page = 1
		let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
		window.history.pushState({}, '', newUrl);
		roundViewInstantSearch.productResults	= {}
		roundViewInstantSearch.pageResults	= {}
		roundViewInstantSearch.blogResults	= {}

		if( roundViewInstantSearch.tabFlag ){
			await roundViewInstantSearch.fetchAllItems()
		}else{
			await roundViewInstantSearch.findProducts()
		}
	},

	renderFilterOptions: async (searchData) => {
		let filterArray = searchData.facet_counts.filter((item) => {
			if (roundViewInstantSearch.facetBy.indexOf(item.field_name) !== -1) {
				return item;
			}
		})
		for (let i = 0; i < filterArray.length; i++) {
			roundViewInstantSearch.facetValues[filterArray[i].field_name]	= filterArray[i]
			switch (filterArray[i].field_name) {
				case "price":
				case "effective_price":
					if (roundViewInstantSearch.priceFilterValue === null || (roundViewInstantSearch.priceFilterValue !== null && roundViewInstantSearch.initialLoader)) {
						roundViewInstantSearch.priceSlider(filterArray[i])
					}
					break;
				default:
					if (roundViewInstantSearch.facetItems[filterArray[i].field_name].facetType === "conjunctive") {
						roundViewInstantSearch.renderConjunctiveFilter(filterArray[i])
					} else if (roundViewInstantSearch.facetItems[filterArray[i].field_name].facetType === "disjunctive" && roundViewInstantSearch.currentFacetTitle !==  filterArray[i].field_name) {
						roundViewInstantSearch.renderDisjunctiveFilter(filterArray[i])
					}
					break;
			}
		}
	},

	getPriceRange: (product)	=> {
		let min	= product.price,
			max	= product.price;
		if( typeof product.variants !== "undefined" && product.variants.length > 0 ){
			min	= product.variants[0].calculated_price > 0 ? product.variants[0].calculated_price : ( product.variants[0].sale_price > 0 ? product.variants[0].sale_price : product.variants[0].price )
			max	= min
			for( let i = 0; i < product.variants.length; i++ ){
				let currentVariant	= product.variants[i]
				if( currentVariant.calculated_price > 0 ){
					if( min > currentVariant.calculated_price ){
						min	= currentVariant.calculated_price
					}else if ( max < currentVariant.calculated_price ) {
						max	= currentVariant.calculated_price
					}
				}else if( currentVariant.sale_price > 0 ){
					if( min > currentVariant.sale_price ){
						min	= currentVariant.sale_price
					}else if ( max < currentVariant.sale_price ) {
						max	= currentVariant.sale_price
					}
				}else if( currentVariant.price > 0 ){
					if( min > currentVariant.price ){
						min	= currentVariant.price
					}else if ( max < currentVariant.price ) {
						max	= currentVariant.price
					}
				}
				// if( currentVariant.price > 0 ){
				// 	if( currentVariant.calculated_price > 0 ){
				// 		if( currentVariant.calculated_price < min ){
				// 			min	= currentVariant.calculated_price
				// 		}
				// 	}
				// 	if( currentVariant.sale_price > 0 && currentVariant.sale_price < min ){
				// 		min = currentVariant.sale_price
				// 	}else if( min > currentVariant.price ){
				// 		min	= currentVariant.price
				// 	}
				// 	// if( min > currentVariant.price ){
				// 	// 	if( currentVariant.sale_price > 0 ){
				// 	// 		min	= currentVariant.sale_price
				// 	// 	}else{
				// 	// 		min	= currentVariant.price
				// 	// 	}
				// 	// }
				// 	if( max < currentVariant.price ){
				// 		if( currentVariant.sale_price > 0 && max < currentVariant.sale_price ){
				// 			max	= currentVariant.sale_price
				// 		}else{
				// 			max	= currentVariant.price
				// 		}
				// 	}
				// }
			}
		}
		return {min, max}
	},

	convertPrice: (price) => {
		let config				= roundViewInstantSearch.currencyObj,
			convertedPrice		= parseFloat(price);
		if( !config.isDefault ){
			convertedPrice = parseFloat(price) * parseFloat(config.rate);
		}
		return convertedPrice.toFixed(config.decimals);
	},

	revertPrice: (convertedPrice) => {
		let config			= roundViewInstantSearch.currencyObj,
			originalPrice	= parseFloat(convertedPrice);
		if( !config.isDefault ){
			originalPrice = parseFloat(convertedPrice) / parseFloat(config.rate);
		}
		return originalPrice.toFixed(config.decimals);
	},

	formPriceText: (price) => {
		let config				= roundViewInstantSearch.currencyObj,
			parsedPrice = roundViewInstantSearch.convertPrice(price),
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
		let { min, max }	= roundViewInstantSearch.getPriceRange(product)
		if( min === max ){
			if( product.sale_price > 0 ){
				return `<span class="cbPriceList">${roundViewInstantSearch.formPriceText(product.sale_price)}</span><span class="cbPriceList cbOriginalPrice">${roundViewInstantSearch.formPriceText(product.price)}</span>`
			}else{
				return `<span class="cbPriceList">${roundViewInstantSearch.formPriceText(product.price)}</span>`
			}
		}else{
			let minPrice	= roundViewInstantSearch.formPriceText(min),
				maxPrice	= roundViewInstantSearch.formPriceText(max);
			return `<span class="cbPriceList">${minPrice} - ${maxPrice}</span>`
		}
	},

	priceSlider: async (item) => {
		let minValue = 0,
			maxValue = 0,
			range = 0
		if (item.stats != undefined) {
			minValue = Math.floor(roundViewInstantSearch.convertPrice(item.stats.min));
			maxValue = Math.ceil(roundViewInstantSearch.convertPrice(item.stats.max));
			if( minValue === maxValue ){
				maxValue	= minValue + 1
			}
			range = maxValue - minValue
		}
		roundViewInstantSearch.sliderGap = range > 100 ? parseFloat(range / 100) : 1
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
				rvPriceMinRangeInput.setAttribute("step", roundViewInstantSearch.sliderGap)
				rvPriceMinRangeInput.setAttribute("value", minValue)
				rvPriceMaxRangeInput.setAttribute("type", "range")
				rvPriceMaxRangeInput.setAttribute("min", minValue)
				rvPriceMaxRangeInput.setAttribute("max", maxValue)
				rvPriceMaxRangeInput.setAttribute("step", roundViewInstantSearch.sliderGap)
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
			roundViewInstantSearch.rvsInputRangeDiv = document.querySelectorAll(".rvPriceRangeInputWrap input")
			roundViewInstantSearch.rvsInputProgessDiv = document.querySelector(".rvPriceProgressWrap")
			roundViewInstantSearch.rvsPriceInputBox	= document.querySelectorAll(".rvPriceInputWrapper input")
			roundViewInstantSearch.priceSliderAddEvent()
		}
	},

	priceInputChangeEvent: async(e) => {
		let minPrice = parseInt(roundViewInstantSearch.rvsPriceInputBox[0].value),
			maxPrice = parseInt(roundViewInstantSearch.rvsPriceInputBox[1].value);
		if( minPrice > maxPrice && e.target.className === "rvPriceMinInput" ){
			minPrice	= maxPrice - parseFloat(roundViewInstantSearch.sliderGap)
			roundViewInstantSearch.rvsPriceInputBox[0].value	= Math.floor(minPrice)
		}else if( minPrice < parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].min) ){
			minPrice	= parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].min)
			roundViewInstantSearch.rvsPriceInputBox[0].value	= minPrice
		}else if( minPrice > parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].max) ){
			minPrice	= parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].max) - parseFloat(roundViewInstantSearch.sliderGap)
			roundViewInstantSearch.rvsPriceInputBox[0].value	= Math.floor(minPrice)
		}

		if( minPrice > maxPrice && e.target.className !== "rvPriceMinInput" ){
			maxPrice	= minPrice + parseFloat(roundViewInstantSearch.sliderGap)
			roundViewInstantSearch.rvsPriceInputBox[1].value	= Math.floor(maxPrice)
		}else if( maxPrice > parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].max) ){
			maxPrice	= parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].max)
			roundViewInstantSearch.rvsPriceInputBox[1].value	= maxPrice
		}else if( maxPrice < parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].min) ){
			maxPrice	= parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].min) + parseFloat(roundViewInstantSearch.sliderGap)
			roundViewInstantSearch.rvsPriceInputBox[1].value	= Math.ceil(maxPrice)
		}

		if (maxPrice - minPrice >= roundViewInstantSearch.sliderGap && maxPrice <= parseInt(roundViewInstantSearch.rvsInputRangeDiv[1].max) ) {
			if (e.target.className === "rvPriceMinInput") {
				roundViewInstantSearch.rvsInputRangeDiv[0].value = minPrice;
				roundViewInstantSearch.rvsInputProgessDiv.style.left = (minPrice / roundViewInstantSearch.rvsInputRangeDiv[0].max) * 100 + "%";
			} else {
				roundViewInstantSearch.rvsInputRangeDiv[1].value = maxPrice;
				roundViewInstantSearch.rvsInputProgessDiv.style.right = 100 - (maxPrice / roundViewInstantSearch.rvsInputRangeDiv[1].max) * 100 + "%";
			}
		}
		minPrice = parseInt(roundViewInstantSearch.rvsPriceInputBox[0].value)
		maxPrice = parseInt(roundViewInstantSearch.rvsPriceInputBox[1].value)
		currentUrl = window.location.href,
		searchParams = new URLSearchParams(window.location.search);
		roundViewInstantSearch.priceFilterValue = `${minPrice}..${maxPrice}`
		roundViewInstantSearch.page = 1
		if (searchParams.has('price_range')) {
			searchParams.set('price_range', roundViewInstantSearch.priceFilterValue);
		} else {
			searchParams.append('price_range', roundViewInstantSearch.priceFilterValue);
		}
		if (searchParams.has("page")) {
			searchParams.delete("page")
		}
		let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
		window.history.pushState({}, '', newUrl);
		await roundViewInstantSearch.renderSelectedFilter()
		roundViewInstantSearch.productResults	= {}
		roundViewInstantSearch.findProducts()
	},

	priceSliderAddEvent: async () => {
		roundViewInstantSearch.rvsInputRangeDiv.forEach(input => {
			input.addEventListener("input", roundViewInstantSearch.priceRangeInputEvent);
			input.addEventListener("mousedown", roundViewInstantSearch.priceRangeMouseDown);
		})
		roundViewInstantSearch.rvsPriceInputBox.forEach(input => {
			input.addEventListener("blur", roundViewInstantSearch.priceInputChangeEvent)
		})
		document.addEventListener("mouseup", roundViewInstantSearch.documentMouseUp)
	},

	priceRangeInputEvent: async (e) => {
		let minVal = parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].value),
			maxVal = parseInt(roundViewInstantSearch.rvsInputRangeDiv[1].value);
		if (!roundViewInstantSearch.priceRangeDragging) {
			roundViewInstantSearch.priceRangeDragging = true
		}
		if ((maxVal - minVal) < roundViewInstantSearch.sliderGap) {
			if (e.target.className === "range-min") {
				roundViewInstantSearch.rvsInputRangeDiv[0].value = maxVal - roundViewInstantSearch.sliderGap
			} else {
				roundViewInstantSearch.rvsInputRangeDiv[1].value = minVal + roundViewInstantSearch.sliderGap;
			}
		} else {
			roundViewInstantSearch.rvsPriceInputBox[0].value = minVal;
			roundViewInstantSearch.rvsPriceInputBox[1].value = maxVal;
			roundViewInstantSearch.rvsInputProgessDiv.style.left = ((minVal / roundViewInstantSearch.rvsInputRangeDiv[0].max) * 100) + "%";
			roundViewInstantSearch.rvsInputProgessDiv.style.right = 100 - (maxVal / roundViewInstantSearch.rvsInputRangeDiv[1].max) * 100 + "%";
		}
	},

	priceRangeMouseDown: async () => {
		roundViewInstantSearch.priceRangeDragging = true
	},

	documentMouseUp: async () => {
		if (roundViewInstantSearch.priceRangeDragging) {
			roundViewInstantSearch.priceRangeDragging = false
			let minPrice = parseInt(roundViewInstantSearch.rvsInputRangeDiv[0].value),
				maxPrice = parseInt(roundViewInstantSearch.rvsInputRangeDiv[1].value),
				currentUrl = window.location.href,
				searchParams = new URLSearchParams(window.location.search);
			roundViewInstantSearch.priceFilterValue = `${minPrice}..${maxPrice}`
			roundViewInstantSearch.page = 1
			if (searchParams.has('price_range')) {
				searchParams.set('price_range', roundViewInstantSearch.priceFilterValue);
			} else {
				searchParams.append('price_range', roundViewInstantSearch.priceFilterValue);
			}
			if (searchParams.has("page")) {
				searchParams.delete("page")
			}
			let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
			window.history.pushState({}, '', newUrl);
			await roundViewInstantSearch.renderSelectedFilter()
			roundViewInstantSearch.productResults	= {}
			roundViewInstantSearch.findProducts()
		}
	},

	renderConjunctiveFilter: async (item) => {
		let fieldName = item.field_name,
			searchable	= roundViewInstantSearch.facetItems[fieldName].searchable,
			title		= roundViewInstantSearch.facetItems[fieldName].title,
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
					let rvsFacetFilterListItem = document.createElement("li"),
						listEmptyDiv = document.createElement("div"),
						rvsFacetFilterListItemLabel = document.createElement("label"),
						rvsFacetFilterListItemCount = document.createElement("span")
					rvsFacetFilterListItem.classList.add("rvsFacetFilterListItem")
					if (roundViewInstantSearch.filterList && roundViewInstantSearch.filterList[fieldName] && roundViewInstantSearch.filterList[fieldName].indexOf(facetCounts[i].value) !== -1) {
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
				currentFacetSelector.parentNode.style.display	= "none"
			}
			roundViewInstantSearch.addConjuctiveFilterEvent(selectorTitle)
			roundViewInstantSearch.addConjuctiveInputFilterEvent(selectorTitle)
		}
	},

	addConjuctiveFilterEvent: async (selectorTitle) => {
		let listItemSelector = document.querySelectorAll(`.rvsFacet${selectorTitle}Container .rvsFacetItem`)
		listItemSelector.forEach((item) => {
			item.addEventListener("click", roundViewInstantSearch.conjuctiveFilterClickEvent)
		})
	},

	addConjuctiveInputFilterEvent: async (selectorTitle) => {
		let searchableInput	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchInput`)
		if( searchableInput ){
			searchableInput.addEventListener("keyup", roundViewInstantSearch.conjuctiveFilterInputChange)
		}
		let searchBoxForm	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchForm`)
		if( searchBoxForm ){
			searchBoxForm.addEventListener("submit", function(e){
				e.preventDefault()
			})
		}
		let rvsFacetSearchReset	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchReset`)
		if( rvsFacetSearchReset ){
			rvsFacetSearchReset.addEventListener("click", roundViewInstantSearch.resetConjuctiveInputValue)
		}
	},

	addDisjuctiveInputFilterEvent: async (selectorTitle) => {
		let searchableInput	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchInput`)
		if( searchableInput ){
			searchableInput.addEventListener("keyup", roundViewInstantSearch.disjuctiveFilterInputChange)
		}
		let searchBoxForm	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchForm`)
		if( searchBoxForm ){
			searchBoxForm.addEventListener("submit", function(e){
				e.preventDefault()
			})
		}
		let rvsFacetSearchReset	= document.querySelector(`.rvsFacet${selectorTitle}Container .rvsFacetSearchReset`)
		if( rvsFacetSearchReset ){
			rvsFacetSearchReset.addEventListener("click", roundViewInstantSearch.resetDisjuctiveInputValue)
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
			facetCounts = roundViewInstantSearch.facetValues[type].counts
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
				if (roundViewInstantSearch.filterList && roundViewInstantSearch.filterList[fieldName] && roundViewInstantSearch.filterList[fieldName].indexOf(facetCounts[i].value) !== -1) {
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
		roundViewInstantSearch.addConjuctiveFilterEvent(selectorTitle)
		
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
			currentFacetSelector = document.querySelector(`.rvsFacet${selectorTitle}Container`),
			facetCounts = roundViewInstantSearch.facetValues[type].counts,
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
					if (roundViewInstantSearch.filterList && roundViewInstantSearch.filterList[fieldName] && roundViewInstantSearch.filterList[fieldName].indexOf(facetCounts[i].value) !== -1) {
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
		roundViewInstantSearch.addConjuctiveFilterEvent(selectorTitle)
		
	},

	removeConjuctiveFilterEvent: async (selectorTitle) => {
		let listItemSelector = document.querySelectorAll(`.rvsFacet${selectorTitle}Container .rvsFacetItem`)
		listItemSelector.forEach((item) => {
			item.removeEventListener("click", roundViewInstantSearch.conjuctiveFilterClickEvent)
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
			if (typeof roundViewInstantSearch.filterList[filterBy] === "undefined") {
				roundViewInstantSearch.filterList[filterBy] = []
			}
			let index = roundViewInstantSearch.filterList[filterBy].indexOf(facetValue)
			if (index !== -1) {
				roundViewInstantSearch.filterList[filterBy].splice(index, 1)				
				if( e.target.querySelector('input.rvsFacetFilterListCheckBox') ){
					e.target.querySelector('input.rvsFacetFilterListCheckBox').checked = false
				}
			} else {
				roundViewInstantSearch.filterList[filterBy].push(facetValue)
				if( e.target.querySelector('input.rvsFacetFilterListCheckBox') ){
					e.target.querySelector('input.rvsFacetFilterListCheckBox').checked = true
				}
			}
			let currentUrl = window.location.href,
				searchParams = new URLSearchParams(window.location.search);
			if (index === -1) {
				searchParams.set(`filter_by[${filterBy}][${roundViewInstantSearch.filterList[filterBy].length - 1}]`, facetValue)
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
			roundViewInstantSearch.priceFilterValue	= null
			roundViewInstantSearch.page = 1
			roundViewInstantSearch			
			if( roundViewInstantSearch.filterList[filterBy].length === 0 ){
				delete roundViewInstantSearch.filterList[filterBy]
				roundViewInstantSearch.currentFacetTitle	= ""
			}else{
				roundViewInstantSearch.currentFacetTitle	= filterBy
			}
			await roundViewInstantSearch.renderSelectedFilter()
			roundViewInstantSearch.currentFacetTitle	= filterBy
			roundViewInstantSearch.productResults	= {}
			roundViewInstantSearch.findProducts()
		}
	},

	renderDisjunctiveFilter: async (item) => {
		let fieldName = item.field_name,
			searchable	= roundViewInstantSearch.facetItems[fieldName].searchable,
			title		= roundViewInstantSearch.facetItems[fieldName].title,
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
				facetValueFlag	= false
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
					if (roundViewInstantSearch.filterList && roundViewInstantSearch.filterList[fieldName] && roundViewInstantSearch.filterList[fieldName].indexOf(facetCounts[i].value) !== -1) {
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
				currentFacetSelector.parentNode.style.display	= "none"
			}
			roundViewInstantSearch.addConjuctiveFilterEvent(selectorTitle)
			roundViewInstantSearch.addDisjuctiveInputFilterEvent(selectorTitle)
		}
	},

	renderSelectedFilter: async () => {
		let //clearFacetControl = roundViewInstantSearch.clearFacetsWrapper.querySelector('.rvsControls'),
			rvsClearRefinementBtn = roundViewInstantSearch.selectedFactesWrapper.querySelector('.rvsClearRefinementBtn'),
			selectFacetControl = roundViewInstantSearch.selectedFactesWrapper.querySelector('.rvsControls'),
			selectedFacetList	= roundViewInstantSearch.selectedFactesWrapper.querySelector('.rvsSelectedValuesList')
		if( selectedFacetList ){
			selectedFacetList.innerHTML	= ``
		}
		if (Object.keys(roundViewInstantSearch.filterList).length > 0 || roundViewInstantSearch.priceFilterValue !== null) {
			if (rvsClearRefinementBtn) {
				rvsClearRefinementBtn.classList.remove("rvsClearRefinementBtnDisabled")
				rvsClearRefinementBtn.removeAttribute("disabled")
				rvsClearRefinementBtn.addEventListener("click", roundViewInstantSearch.clearAllFilterEvent)
			}
			if (rvsClearRefinementBtn) {
				rvsClearRefinementBtn.classList.remove("rvsControlNoRefinement")
				rvsClearRefinementBtn.removeAttribute("hidden")

			}
			if (selectFacetControl) {
				selectFacetControl.classList.remove("rvsControlNoRefinement")
				selectFacetControl.removeAttribute("hidden")

			}
			if( roundViewInstantSearch.priceFilterValue !== null ){
				let splitPriceFilter	= roundViewInstantSearch.priceFilterValue.split(".."),
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
			for( let [ key, values ] of Object.entries(roundViewInstantSearch.filterList) ){
				if( typeof roundViewInstantSearch.facetItems[key] !== "undefined" ){
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
						selectedFacetListeItemLabel.innerHTML	= roundViewInstantSearch.facetItems[key].title
						emptyDiv.append(`: ${values[i]}`)
						selectedFacetList.appendChild(selectedFacetListItem)
					}
				}
			}
			roundViewInstantSearch.addSingleSelectedItemEvent()
		} else {
			if (rvsClearRefinementBtn) {
				rvsClearRefinementBtn.classList.add("rvsClearRefinementBtnDisabled")
				rvsClearRefinementBtn.setAttribute("disabled", "")
				rvsClearRefinementBtn.removeEventListener("click", roundViewInstantSearch.clearAllFilterEvent)
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
		roundViewInstantSearch.filterList = {}
		roundViewInstantSearch.priceFilterValue = null
		roundViewInstantSearch.currentFacetTitle	= null
		roundViewInstantSearch.modifyURL()
		roundViewInstantSearch.renderSelectedFilter()
		roundViewInstantSearch.productResults	= {}
		roundViewInstantSearch.findProducts()
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
		let selectedFacetListItemLinks	= roundViewInstantSearch.selectedFactesWrapper.querySelectorAll('.rvsSelectedValuesList > .selectedFacetListItem > a')
		if( selectedFacetListItemLinks ){
			selectedFacetListItemLinks.forEach((item) => {
				item.addEventListener("click", roundViewInstantSearch.removeParticularSelectedFacet)
			})
		}
	},

	removeParticularSelectedFacet: (e) => {
		let filterBy = "",
			facetValue = "",
			currentUrl = window.location.href,
			searchParams = new URLSearchParams(window.location.search);
		roundViewInstantSearch.currentFacetTitle	= ""
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
			roundViewInstantSearch.priceFilterValue	= null
			if( searchParams.has("price_range") ){
				searchParams.delete("price_range")
			}
		}else{
			let index = roundViewInstantSearch.filterList[filterBy] ? roundViewInstantSearch.filterList[filterBy].indexOf(facetValue) : -1
			if (index !== -1) {
				roundViewInstantSearch.filterList[filterBy].splice(index, 1)
				if( Object.keys(roundViewInstantSearch.filterList).length === 1 && roundViewInstantSearch.filterList[filterBy].length === 0 ){
					roundViewInstantSearch.filterList	= {}
				}
				if( searchParams.has(`filter_by[${filterBy}][${index}]`) ){
					searchParams.delete(`filter_by[${filterBy}][${index}]`)
				}
			}
		}
		let newUrl = `${currentUrl.split('?')[0]}?${searchParams.toString()}`;
		window.history.pushState({}, '', newUrl);
		roundViewInstantSearch.renderSelectedFilter()
		roundViewInstantSearch.productResults	= {}
		roundViewInstantSearch.findProducts()
	},

	hitSearchAnalytics: async(searchValue, searchResult, sortObject, facetObject, page) => {
		clearTimeout(roundViewInstantSearch.analyticsAutoCompleteDebounceTime);
		roundViewInstantSearch.analyticsAutoCompleteDebounceTime = setTimeout(async () => {
			try {
				if(!roundViewInstantSearch.sessionID){
					window.searchThree.getSessionID()
					roundViewInstantSearch.sessionID	= window.searchThree.sessionID
				}
				const postData = {
										uniqueId: roundViewInstantSearch.uniqueId,
										searchKey: searchValue,
										searchResult: searchResult,
										sortValue: sortObject,
										facetValue: facetObject,
										page: page,
										sessionId: roundViewInstantSearch.sessionID
									},
					response = await fetch(`${roundViewInstantSearch.analyticsURL}/api/v1/analytics/instantSearchLog`, {
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
		}, 500, searchValue, searchResult, sortObject, facetObject, page)
	},

	// Function to retrieve the session ID
	getSessionID: async () => {
		let cookieID = await roundViewInstantSearch.getCookie('_conversion_box_track_id'),
			storageId = localStorage.getItem('_conversion_box_track_id');
		if (!cookieID && storageId) {
			roundViewInstantSearch.sessionID = storageId
			roundViewInstantSearch.setCookie("_conversion_box_track_id", storageId)
		} else if (!storageId && cookieID) {
			roundViewInstantSearch.sessionID = cookieID
			roundViewInstantSearch.setLocalStorage("_conversion_box_track_id", cookieID)
		} else if (!cookieID && !storageId) {
			roundViewInstantSearch.sessionID = generateUUID()
			roundViewInstantSearch.setCookie("_conversion_box_track_id", roundViewInstantSearch.sessionID)
			roundViewInstantSearch.setLocalStorage("_conversion_box_track_id", roundViewInstantSearch.sessionID)
		} else {
			roundViewInstantSearch.sessionID = cookieID
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

	fetchCategoryById: async (storeFrontToken) => {
		const query = `query categoryById($categoryId: Int!) {
			 site {
			 category(entityId: $categoryId) {
				  metafields(
				  namespace: "conversionbox_bigcommerce"
				  keys: ["cbFacetSortValues"]
				  ) {
				  edges {
						node {
						key
						value
						}
				  }
				  }
			 }
			 }
		}`

		try {
			const bodyRequest = JSON.stringify({
				query: query,
				variables: { categoryId: parseInt(cbCategoryId) },
			})

			const response = await fetch('/graphql', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${storeFrontToken}`,
				},
				body: bodyRequest,
			})

			const jsonResponse = await response.json()
			let edgeValue = jsonResponse.data.site.category.metafields.edges[0]?.node.value

			return edgeValue
		} catch (error) {
			console.error('Unable to fetch category metafields for InstantSearch facets', error)
		}
	}
}
let setTimeOutCounter = 0;
// Start the interval to check for the variable
cbInstaSearchIntervalId = setInterval(function () {
	setTimeOutCounter++
	let searchPageConfigFlag	= false,
		categoryPageConfigFlag	= false
	// Check if the custom variable is defined and has a value
	if( roundviewSearch.searchResultPage && typeof window.conversionBoxSearch !== 'undefined' && typeof window.conversionBoxSearch.config !== "undefined" && typeof window.conversionBoxSearch.config.searchConfig && Object.keys(window.conversionBoxSearch.config.searchConfig).length > 0 ) {
		// Trigger the function if the variable is defined
		pageType				= window.conversionBoxSearch.pageType		
		searchPageConfigFlag	= true
		if( !renderFlag ){
			roundViewInstantSearch.init("instantSearch")
		}
		renderFlag	= true
	}else if( !roundviewSearch.searchResultPage ){
		searchPageConfigFlag	= true
	}

	if( typeof window.conversionBoxCategoryConfig !== 'undefined' && typeof window.conversionBoxCategoryConfig.config !== "undefined" ){
		categoryPageConfigFlag	= true
		if( typeof window.conversionBoxCategoryConfig.categoryId !== "undefined" && window.conversionBoxCategoryConfig.categoryId !== "" ){
			cbCategoryId	= window.conversionBoxCategoryConfig.categoryId
			pageType	= window.conversionBoxCategoryConfig.pageType
			if( !renderFlag ){
				roundViewInstantSearch.init("categoryPage")
			}
			renderFlag	= true
		}
	}else if( setTimeOutCounter === 20 ){
		categoryPageConfigFlag	= true
	}

	if( categoryPageConfigFlag && searchPageConfigFlag ){
		clearInterval(cbInstaSearchIntervalId); // Remove the interval
	}
}, 500);
