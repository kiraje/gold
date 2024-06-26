window.SearchSpringInit = function() {
var self = this;

// springboard generated variables
var modules = {};
modules.enabled = true;

// springboard generated variables for autocomplete/default
modules.autocomplete = {
	input: 'input.searchspring-query',
	action: '',
	autoPosition: false,
	limit: 6, 
	deepSearch: true,	
	trendingSearches : true,
	trendingLimit    : 10,
	trendingVerbiage : 'Trending Searches'
};

this.importer.include('autocomplete2', modules.autocomplete);

//AC term suggestions
this.on('afterBootstrap', function($scope) {
    // If there are terms, but no q or results (meaning trending searches are available)
    // Focus on the first term to display results
    $scope.$watch('ac.terms', function() {
        var checkAcTerms = checkLength($scope.ac.terms);
        var checkAcResults = checkLength($scope.ac.results);

        if (checkAcTerms && !checkAcResults && !$scope.ac.input) {
            $scope.ac.terms[0].preview();
        }
    });
});

// Function to check if elements are present
function checkLength(element) {
    return (element && element.length) ? element.length : false;
}

// Disable intellisuggest elevations in AutoComplete (like search results)
this.on('beforeSearch', function($req) {
	$req['intellisuggest'] = 0;
});

this.on('afterSearch', function($scope) {
	// live pricing scripts
	var livePricing;

	// build out live pricing url
	var livePricingUrl = '/live-pricing.php?ids=';
	var livePricingIds = [];

	angular.forEach($scope.results, function(result) {
		// live pricing
		livePricingIds.push(result.uid);
		result.displayPrice = result.price;

		// Update rating values
		if (result.rating) {
			result.displayRating = Math.floor(result.rating);
		}

		// Create badge array
		result.badges = [];

		if (result.on_sale && (result.on_sale * 1 == 1)) {
			result.badges.push({text : 'On Sale', filename: 'onsale-ribbon-search.png'});
		}
		if (result.pre_sale && (result.pre_sale * 1 == 1)) {
			result.badges.push({text : 'Pre-sale', filename: 'presale-ribbon-search.png'});
		}
	});

	// get live pricing values
	if (livePricingIds.length) {
		livePricingUrl = livePricingUrl + encodeURIComponent(livePricingIds);

		// get prices from live-pricing script
		angular.injector(['ng']).invoke(function($http) {
			$http({
				method: 'GET',
				url: livePricingUrl
			}).success(function(data) {
				angular.forEach($scope.results, function(result) {
					result.displayPrice = data[result.uid];
				});
				$scope.$evalAsync();
			}).error(function() {
				return;
			});
		});
	}
});

// Get Autocomplete query for tracking
var acQuery;
this.on('afterSearch', function($scope){
	if($scope.moduleName == 'autocomplete') { 
		acQuery = $scope.q;
		
		var trackedQuery = acQuery;
		for(var i = 0; i < $scope.filterSummary.length;i++) {
			trackedQuery += "-" + $scope.filterSummary[i].label;
		}
		
		if (typeof ga == 'function') {
			ga('send', 'event', 'SearchSpring-Autocomplete', 'Search', trackedQuery, $scope.pagination.totalResults);
		}
	}
});


// Autocomplete Analytics
this.on('afterBootstrap', function($scope) {
	$scope.acTermClick = function() {
		if (typeof ga == 'function') {
			ga('send', 'event', 'SearchSpring-Autocomplete', 'Term Click', '');
		}
	};

	$scope.acProductClick = function() {
		if (typeof ga == 'function') {
			ga('send', 'event', 'SearchSpring-Autocomplete', 'Product Click', '');
			ga('send', 'pageview', '//www.jmbullion.com/search/?q='+ encodeURIComponent(acQuery));
		}
	};

	$scope.acFacetClick = function() {
		if (typeof ga == 'function') {
			ga('send', 'event', 'SearchSpring-Autocomplete', 'Facet Click', '');
		}
	};
});

this.on('_afterAutocompleteSearch', function() {
	if (typeof ga == 'function') {
		ga('send', 'event', 'SearchSpring-Autocomplete', 'Show', '');
		return self.on.UNBIND;
	}
});

this.on('autocompleteZeroTerms', function(zeroQuery) {
	if (typeof ga == 'function') {
		ga('send', 'event', 'SearchSpring-Autocomplete', 'Search', zeroQuery, 0);
	}
});

// apparently this causes a double request which intermittently duplicates stock status
// this.importer.include('v2translator');
};
SearchSpring.Catalog.templates.promises.receive.resolve('<!-- Empty Page Target --><script type="text/ss-template" name="Empty Page Target" module="search" target=".ss-empty-page-target"></script><!-- AutoComplete --><script type="text/ss-template" name="AutoComplete" target="[ss-autocomplete]">	<div class="ss-ac-container" ng-show="ac.visible" ng-class="{\'no-terms\': ac.terms.length == 0}">		<div id="ss-ac-terms" ng-show="ac.terms">			<ul class="ss-list">				<li ng-repeat="term in ac.terms" class="ss-list-option" ng-class="{\'ss-active\': term.active}">					<a ng-if="term.label.toLowerCase().trim() != \'capsule\'" ng-bind-html="term.label | trusted" ss-no-ps ss-nav-selectable ng-focus="term.preview()" href="{{ term.url }}" ng-click="acTermClick()" class="ss-list-link"></a>				</li>			</ul>		</div>		<div id="ss-ac-content">			<div id="ss-ac-facets" ng-show="ac.facets">				<div ng-repeat="facet in ac.facets | filter:{ type: \'!slider\' } | limitTo:3" ng-switch="facet.type" ng-if="facet.values.length" id="ss-ac-{{ facet.field }}" class="ss-ac-facet-container" ng-class="{\'ss-ac-facet-container-list\': (facet.type != \'grid\' || facet.type != \'palette\' || !facet.type), \'ss-ac-facet-container-palette\': facet.type == \'palette\', \'ss-ac-facet-container-grid\': facet.type == \'grid\'}">					<h4 class="ss-title">{{ facet.label }}</h4>					<ul ng-switch-when="grid" class="ss-grid">						<li ng-repeat="value in facet.values | limitTo:6" class="ss-grid-option">							<a href="" ng-click="value.preview(); acFacetClick();" ss-nav-selectable ss-no-ps class="ss-grid-link" ng-class="{\'ss-active\': value.active}">								<div class="ss-grid-block">									<div class="ss-grid-value">										<div class="ss-grid-label">{{ value.label }}</div>									</div>								</div>							</a>						</li>					</ul>					<ul ng-switch-when="palette" class="ss-palette">						<li ng-repeat="value in facet.values | limitTo:6" class="ss-palette-option">							<a href="" ng-click="value.preview(); acFacetClick();" ss-nav-selectable ss-no-ps class="ss-palette-link" ng-class="{\'ss-active\': value.active}" alt="{{ value.label }}">								<div class="ss-palette-block">									<div ng-style="{\'background-color\': value.label.toLowerCase() }" class="ss-palette-color ss-palette-color-{{ value.paletteClass }}"></div>								</div>								<div class="ss-palette-label">{{ value.label }}</div>							</a>						</li>					</ul>					<ul ng-switch-default class="ss-list">						<li ng-repeat="value in facet.values | limitTo:5" class="ss-list-option">							<a href="" ng-click="value.preview(); acFacetClick();" ss-nav-selectable ss-no-ps class="ss-list-link ss-checkbox" ng-class="{\'ss-active\': value.active}">{{ value.label }}</a>						</li>					</ul>				</div>				<div ng-if="ac.merchandising.content.left.length > 0" id="ss-ac-merch-left" class="ss-ac-merchandising" ss-merchandising="ac.left"></div>			</div>			<div id="ss-ac-results">				<h4 class="ss-title">See Results for <span class="ss-results-title-query">"{{ ac.q }}"</span></h4>				<div ng-if="ac.merchandising.content.header.length > 0" id="ss-ac-merch-header" class="ss-ac-merchandising" ss-merchandising="ac.header"></div>				<div ng-if="ac.merchandising.content.banner.length > 0" id="ss-ac-merch-banner" class="ss-ac-merchandising" ss-merchandising="ac.banner"></div>				<!-- Items -->				<ul class="ss-ac-item-container">					<li class="ss-ac-item" ng-repeat="result in ac.results | limitTo:ac.pagination.perPage">						<a ng-href="{{ result.url }}" ng-click="acProductClick()" ss-no-ps ss-nav-selectable>							<div class="ss-ac-item-image">								<div ng-if="result.badges && result.badges.length > 0" class="ss-badge-container ss-badge-{{ result.badges.length }}">									<img ng-repeat="badge in result.badges" ng-src="//cdn.jmbullion.com/wp-content/themes/JMBullion/images/{{ badge.filename }}" class="ss-badge" alt="{{ badge.text }}" />								</div>								<div class="ss-image-wrapper">									<img ng-src="{{ result.thumbnailImageUrl ? result.thumbnailImageUrl : \'//cdn.searchspring.net/ajax_search/img/default_image.png\' }}" onerror="this.src=\'//cdn.searchspring.net/ajax_search/img/default_image.png\';" alt="{{ result.name }}" title="{{ result.name }}" />								</div>							</div>							<div class="ss-ac-item-details">								<p class="ss-ac-item-name">									{{ result.name.length > 58 ? (result.name.substring(0, 55) + \'...\') : result.name }}								</p>								<p class="ss-ac-item-rating">									<span ng-if="result.displayRating && (result.displayRating * 1 > 2.99)" class="ss-ac-item-rating-container">										<img class="ss-ac-item-rating-image" ng-src="//cdn.jmbullion.com/wp-content/themes/JMBullion/images/{{ result.displayRating }}-small-star.jpg" alt="Rated {{ result.rating }}" />										<span class="ss-ac-item-rating-count" ng-if="result.ratingCount">({{ result.ratingCount }})</span>									</span>								</p>								<p ng-if="result.displayPrice && result.instock == 1" class="ss-ac-item-price">									<span class="ss-ac-from-price">From:</span>									<span class="ss-ac-item-regular">${{ result.displayPrice | number:2 }}</span>								</p>								<p ng-if="!result.displayPrice || result.instock == 0" class="ss-ac-item-price">&nbsp;</p>							</div>						</a>					</li>				</ul>				<div ng-if="ac.merchandising.content.footer.length > 0" id="ss-ac-merch-footer" class="ss-ac-merchandising" ss-merchandising="ac.footer"></div>			</div>			<div id="ss-ac-see-more" ng-class="{\'ss-ac-see-more-padding\': ac.facets.length}">				<a href="{{ ac.location.remove(\'perpage\').url() }}" ng-click="ac.visible = false; acTermClick();" class="ss-ac-see-more-link" ss-nav-selectable ss-no-ps>					See {{ ac.pagination.totalResults > 1 ? \'More\':\'\' }} Result{{ ac.pagination.totalResults > 1 ? \'s\' : \'\' }} for "{{ ac.q }}"				</a>			</div>		</div>	</div></script>');
