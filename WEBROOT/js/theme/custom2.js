
jQuery(document).ready(function() {

	//Cufon fonts
	var $disable_cufon = jQuery("meta[name=disable_cufon]").attr('content');
	if($disable_cufon !='true') {
			Cufon.replace('h1,h2,h3,h4,h5,#blurb,#site_name,#intro_blurb_title,.dropcap1', { hover: 'true' });
			
			var userAgent = navigator.userAgent.toLowerCase();
		    // Is this a version of IE?
		    if(jQuery.browser.msie){
				var $ieVersion = jQuery.browser.version.substring(0,1);
				if($ieVersion == 7){
					jQuery("#intro_blurb_title span").css({paddingTop:"8px"});
					jQuery(".dropcap1").css({paddingTop:"0px"});
				}
				
				if($ieVersion == 6){
					jQuery(".last").each(function(index) {
						jQuery(this).wrap('<div class="ie6_gallery_fix" />');
						jQuery(".dropcap1").css({paddingTop:"0px"});
					});
				}
		    }
	}

});