
jQuery(document).ready(function() {
  window.jmb_wishlist_controll = new jmb_wishlist_controll();
  window.jmb_wishlist_controll.init();
});

var jmb_wishlist_controll = function () {
  
  var self = this;
  
  this.init = function() {
    
//    jmb_wishlist_data.ajax_url
//    jmb_wishlist_data.add
//    jmb_wishlist_data.remove
    
    var items = jQuery('.jmb-wishlist-items');
    if ( items.length > 0 )
    {
      self.ajax_update_price();
    }
    
    var wish_container = jQuery('.jmb-wishlist-items');
    if ( wish_container.length > 0 )
    {
      self.insert_pagi(wish_container);
    }
    
    jQuery('body')
      .on('click', 'a.jmb-wishlist.add', self.add_btn_clicked_stop)
      .on('click', '.jmb-wishlist.add[data-pid]', self.add_btn_clicked)
      .on('click', '.jmb-wishlist.remove[data-item]', self.remove_btn_clicked)
      .on('click', '.jmb-wishlist.add a.login-link', self.show_login_popup)
      .on('click', '.jmb-wishlist-pagi .jmb-next', self.load_next_page)
      .on('click', '.jmb-wishlist-pagi .jmb-prev', self.load_prev_page)
      .on('click', '.jmb-wishlist-pagi .page', self.load_x_page)
  }
  
  this.add_btn_clicked_stop = function(e) 
  {
    e.preventDefault();
  }
  
  this.add_btn_clicked = function(e) 
  {
    e.stopPropagation();
    var el = jQuery(this);
    var wrap = el.closest('.section-jmb-wishlist');
    var pid = el.attr('data-pid');

    var data = {
      action : jmb_wishlist_data.add,
      key : jmb_wishlist_data.key,
      pid : pid
    };
    
    jQuery.ajax({
      url : jmb_wishlist_data.ajax_url,
      data: data,
      dataType: 'json',
      beforeSend: function() {
        self.block_el(wrap);
      },
      complete: function(responce) {
        self.unblock_el(wrap);
      },
      success: function(responce) {
        if ( responce.html.length > 0 )
        {
          wrap.replaceWith( responce.html );
          
          var msg = 'Item successfully added. <a href="/my-account/?action=wishlist#tab-6">View Wishlist</a>';
          self.single_add_message(msg);
        }
      }
    });
    
    
  }
  
  this.remove_btn_clicked = function(e) 
  {
    e.preventDefault();
    e.stopPropagation();
    var el = jQuery(this);
    var wrap = el.closest('.section-jmb-wishlist');
    var pid = el.attr('data-item');

    var data = {
      action : jmb_wishlist_data.remove,
      key : jmb_wishlist_data.key,
      pid : pid
    };
    
    jQuery.ajax({
      url : jmb_wishlist_data.ajax_url,
      data: data,
      dataType: 'json',
      beforeSend: function() {
        self.block_el(wrap);
      },
      complete: function(responce) {
        self.unblock_el(wrap);
      },
      success: function(responce) {
        
        if ( el.parents('.jmb-wishlist-items').length > 0 )
        {
          el.closest('.tab-cols').fadeOut();
          self.load_page(jmb_wishlist_data.pagi_args.current);
        }
        else if ( responce.html.length > 0 )
        {
          wrap.replaceWith( responce.html );
          var msg = 'Item successfully removed. <a href="/my-account/?action=wishlist#tab-6">View Wishlist</a>';
          self.single_add_message(msg);
        }
      }
    });
  }
  
  this.block_el = function(el) 
  {
    el.addClass('blocked');
  }
  
  this.unblock_el = function(el) 
  {
    el.removeClass('blocked');
  }
  
  this.add_comas = function(nStr) 
  {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
  
  this.ajax_update_price = function() 
  {

    var itemIds = [];
    jQuery('.main-btn.addToCart').each(function() {
      itemIds.push(jQuery(this).attr('id'));
    });
    
    jQuery.getJSON("/live-pricing.php?ids=" + encodeURIComponent(itemIds), function(data) {
      // Replace the old prices
      jQuery.each(data,function(key, val) {
        var fixedup = parseFloat(val).toFixed(2); 
        fixedup = self.add_comas(fixedup);

        jQuery('#price_'+key).html('As low as: <strong>$'+fixedup + '</strong>');
      });
    });

    jQuery.getJSON("/search-pre-sale.php?ids=" + encodeURIComponent(itemIds), function(data){
      jQuery.each(data, function(key, val){
        jQuery('#price_'+key).parents('.fluid.tab-cols').append('<div class="ribbon search-product-ribbon"><span>PRESALE</span></div>');
      });	
    });

    jQuery.getJSON("/search-on-sale.php?ids=" + encodeURIComponent(itemIds), function(data){
      jQuery.each(data, function(key, val){
        jQuery('#price_'+key).parents('.fluid.tab-cols').append('<div class="ribbon onsale search-product-ribbon"><span>ON SALE!</span></div>');
      });
    });

//    jQuery.getJSON("/search-upcoming-release.php?ids=" + encodeURIComponent(itemIds), function(data){
//      jQuery.each(data, function(key, val){
//        jQuery('#price_'+key).prev().parent().html(jQuery('#price_'+key).prev().parent().html().replace('As low as:', ''));
//        jQuery('#price_'+key).css('visibility', 'hidden');
//      });
//    });

    jQuery.getJSON("/search-out-of-stock.php?ids=" + encodeURIComponent(itemIds), function(data){
      if (data == null)
        var count = 0;
      else
        var count = Object.keys(data).length;

      if (count > 0) {
        jQuery.each(data, function (key, val) {
          var wrap = jQuery('div.tab-cols[data-wish-item="' + key + '"]');
          if ( wrap.length <= 0  ) { return; }
          
          wrap.find('.add-to-cart').find('input').hide();
          wrap.find('.add-to-cart').find('button').hide();
          wrap.find('a.woocommerce_waitlist').remove();
          jQuery(val).insertBefore( wrap.find('.add-to-cart') );
          wrap.find('.stock-status').html('<i class=\"fas fa-times-circle x-out-of-stock\" aria-hidden=\"true\"></i><b>Out of Stock</b>');
        });
      }

    });

//    jQuery.getJSON("/search-upcoming-release.php?ids=" + encodeURIComponent(itemIds), function(data){
//      jQuery.each(data, function(key, val){
//        jQuery('#price_'+key).prev().parent().html(jQuery('#price_'+key).prev().parent().html().replace('As low as:', ''));
//        jQuery('#price_'+key).css('visibility', 'hidden');
//      });
//    });
  }
  
  this.show_login_popup = function(e) 
  {
    e.preventDefault();
    var loginaccount = jQuery('#loginaccount');
    var overlayer = jQuery('.overlayer');
    
    if ( overlayer.length <=0 && loginaccount.length <= 0 )
    {
      return;
    }
    
    overlayer.addClass('overlay_active');
    loginaccount.show();
  }
  
  this.load_next_page = function(e) 
  {
    e.preventDefault();
    
    if ( jmb_wishlist_data.pagi_args.current < jmb_wishlist_data.pagi_args.pages )
    {
      self.load_page( jmb_wishlist_data.pagi_args.current + 1 );
    }
  }
  
  this.load_prev_page = function(e) 
  {
    e.preventDefault();
    
    if ( jmb_wishlist_data.pagi_args.current > 1 )
    {
      self.load_page( jmb_wishlist_data.pagi_args.current - 1 );
    }
  }
  
  this.load_x_page = function(e) 
  {
    e.preventDefault();
    
    var el = jQuery(this);
    var page = Number.parseInt(el.attr('rel'));
    
    if ( false === Number.isNaN(page) )
    {
      self.load_page(page);
    }
    
  }
  
  this.load_page = function(page) 
  {
    jmb_wishlist_data.pagi_args.current = page;
//    var pagi = jQuery('.jmb-wishlist-pagi');
    var container = jQuery('.tab.jmb-wishlist-items');
    
    var data = {
      action : jmb_wishlist_data.paged,
      key : jmb_wishlist_data.key,
      paged : page
    };
    
    jQuery.ajax({
      url : jmb_wishlist_data.ajax_url,
      data: data,
      dataType: 'json',
      beforeSend: function() {
        if ( container.length > 0 )
        {
          self.block_el(container);
        }
      },
      complete: function(responce) {
        if ( container.length > 0 )
        {
          self.unblock_el(container);
        }
        self.update_pagi_visability();
      },
      success: function(responce) {
        if ( true == responce.result && responce.html.length > 0 )
        {
          
          container.html( responce.html );
          self.ajax_update_price();
          self.insert_pagi( container )
        }
      }
    });
  }
  
  this.insert_pagi = function(before_container) 
  {
    return;
    var pagi = '<div class="jmb-wishlist-pagi"><a href="javascript:void(0)" class="prev">Prev</a><a href="javascript:void(0)" class="next">Next</a></div>';
    jQuery(pagi).appendTo(before_container);
    self.update_pagi_visability();
  }
  
  this.update_pagi_visability = function()
  {
    var pagi = jQuery('.jmb-wishlist-pagi');
    if ( pagi.length <= 0)
    {
      return;
    }
    if ( pagi.find('.page').length > 1 && jQuery('.tab.jmb-wishlist-items').find('.tab-cols:visible').length <= 0)
    {
      self.load_page( jmb_wishlist_data.pagi_args.current - 1 );
      return;
    }
    if ( pagi.find('.page').length <= 1 && jQuery('.tab.jmb-wishlist-items').find('.tab-cols:visible').length <= 0)
    {
      pagi.find('a').hide();
      jQuery('.tab.jmb-wishlist-items').html("<p>No items in your wishlist.</p>");
      return;
    }
    
    pagi.find('a').show();
    if ( jmb_wishlist_data.pagi_args.current <= 1 )
    {
      pagi.find('.prev').hide();
    }
    
    if ( jmb_wishlist_data.pagi_args.current >= jmb_wishlist_data.pagi_args.pages )
    {
      pagi.find('.next').hide();
    }
  }
  
  this.single_add_message = function(msg) 
  {
    
    var item_details = jQuery('.product-detail-region');
    if ( item_details.length > 0 )
    {
      var msg = jQuery( '<div class="woocommerce-message jmb-msg">' + msg + '</div>' );
      item_details.find( '.jmb-msg' ).remove();
      item_details.prepend( msg );
      jQuery('html, body').animate({scrollTop: 0});
    }
    
    
  }
}