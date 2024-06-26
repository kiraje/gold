/*
if(jQuery && !jQuery.fn.live) {
	jQuery.fn.live = function(evt, func) {
		jQuery('body').on(evt, this.selector, func);
	}
}
*/
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(
        /^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i
    );
    return pattern.test(emailAddress);
}

if (typeof String.prototype.trim !== "function") {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    };
}

// Initialize the agent at application startup.
function runFingerprintJS(linkedId, callback) {
    var url = "https://fpcdn.io/v3/0PnODVqIAklaKu32kaGX";
    if (webtype !== "production") {
        url = "https://fpcdn.io/v3/ULN1NTQIrJlfhQhi6AMh";
    }

    return import(url)
        .then((FingerprintJS) =>
            FingerprintJS.load({
                endpoint: "https://fp.jmbullion.com",
            })
        )
        .then((fp) =>
            fp
                .get({
                    linkedId: linkedId,
                    timeout: 2500,
                })
                .catch((e) => console.error("fingerprintJS:" + e.message))
        )
        .catch(function (e) {
            // most likely an error importing the script, e.g. by an AdBlocker
            console.log(e);
        })
        .then(function (r) {
            if (typeof r === "object") {
                r.linkedId = linkedId;
            }

            callback(r);
        });
}

jQuery(document).ready(function ($) {
    var loaderBox =
        '<div id="loaderBox" style="position: relative; top: 50%; left: 50%; padding:0px; margin-top: 0px; margin-left: -50px; "><img src="/images/loader.gif" width="100"></div>';
    var loaderCBox =
        '<div id="loaderCBox" style="position: relative; top: 50%; left: 50%; padding:0px; margin-top: 0px; margin-left: -50px;"><img src="/images/loader.gif" width="100"></div>';
    jQuery("#show-accessories").on("click", function () {
        jQuery(".accessories-table >tbody > tr")
            .not(":first")
            .not(":last")
            .css("display", "block");
        jQuery("#show-more-accessories").css("display", "none");
    });

    jQuery(document).on("keydown", ".qty", function (e) {
        if (
            jQuery.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)
        ) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if (
            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
            (e.keyCode < 96 || e.keyCode > 105)
        ) {
            e.preventDefault();
        }
    });
    /* exclude .needsclick class input as these are klaviyo form input field */
    jQuery(document).on(
        "focus",
        'input[type=text]:not("#CFC-page input[type=text], .fng .subscribe input[type=text]"),input[type=password],input[type=email]:not("#CFC-page input[type=email], .needsclick input[type=email]")',
        function (e) {
            var ph = jQuery(this).attr("placeholder");
            if (ph) {
                jQuery(this).attr("ph", jQuery(this).attr("placeholder"));
                jQuery(this).attr("placeholder", "");
                jQuery(this).css({
                    "padding-top": "20px",
                    position: "relative",
                });
                jQuery(this)
                    .parent()
                    .append('<div class="floating-label">' + ph + "</div>");
                jQuery(this).parent().find(".floating-label").show();
            }
        }
    );

    jQuery(document).on(
        "focusout",
        'input[type=text]:not("#CFC-page input[type=text]"),input[type=password],input[type=email]:not("#CFC-page input[type=email], .needsclick input[type=email]")',
        function (e) {
            if (!jQuery(this).val()) {
                var ph = jQuery(this).siblings(".floating-label").html();
                jQuery(this).attr("placeholder", ph);
                jQuery(this).css({
                    "padding-top": "5px",
                    position: "relative",
                });
                jQuery(this).parent().find(".floating-label").remove();
            }
        }
    );

    // When the user clicks anywhere outside of the modal, close it
    jQuery(".overlayer, .close").on("click", function (e) {
        var divClass = jQuery(this).attr("class");
        //added for timesup modal
        if (divClass == "overlayer overlay_active freeze") {
            return;
        }

        jQuery(".overlayer").removeClass("overlay_active");
        jQuery("#createaccount").hide();
        jQuery("#loginaccount").hide();
        jQuery("#forgotaccount").hide();
        jQuery("#myModal").hide();
        jQuery("#reviewtModal").hide();
        jQuery("#thanksModal").hide();
        jQuery("#modify_echeck_details").hide();
        jQuery("#bank-info-input").hide();
        jQuery("#payment-sent").hide();
    });

    jQuery(".quantity").on("click", ".plus", function (e) {
        jminput = jQuery(this).prev("input.qty");
        var val = parseInt(jminput.val());
        jminput.val(val + 1).change();
    });

    jQuery(".quantity").on("click", ".minus", function (e) {
        jminput = jQuery(this).next("input.qty");
        var val = parseInt(jminput.val());
        if (val > 0) {
            jminput.val(val - 1).change();
        }
    });

    var url = jQuery(location).attr("href");
    if (url.indexOf("#entryResponse") >= 0) {
        var id = url.substring(url.indexOf("#entryResponse") + 14);
        flash(id);
    } else {
        jQuery(".flash-success").delay(12000).slideUp("slow");
    }

    jQuery(document).on("click", ".quickremove", function (e) {
        e.preventDefault();
        var url = templateUrl + "/update-item.php";
        var pid = jQuery(this).attr("rel");
        var data = "pid=" + pid;
        jQuery.post(url, data, function (response) {
            response = jQuery.trim(response);
            if (response != "") {
                jsonResponse = jQuery.parseJSON(response);
                if (jsonResponse.error <= 0) {
                    jQuery("#qc_" + pid).hide();
                    jQuery(".items-in-cart").html(jsonResponse.items);
                    jQuery("#quicksubtotal").html("$" + jsonResponse.subtotal);
                } else {
                }
            }
        });
        return false;
    });

    jQuery("form#jm_cart_login_new").submit(function () {
        var url = templateUrl + "/includes/checkin_new.php";
        var data = jQuery(this).serialize();
        var email = jQuery("#email").val();
        if (!isValidEmailAddress(email)) {
            alert("Please enter a valid email address.");
            jQuery("#email").focus();
            return false;
        }
        jQuery.post(url, data, function (response) {
            response = jQuery.trim(response);
            if (response != "") {
                jsonResponse = jQuery.parseJSON(response);
                if (jsonResponse.error <= 0) {
                    window.location.href = jsonResponse.error_message;
                } else {
                    alert(jsonResponse.error_message);
                }
            }
        });
        return false;
    });

    jQuery("form#jm_cart_login").submit(function () {
        var url = templateUrl + "/includes/checkin.php";

        var userEmail = jQuery("#email").val().trim();
        var userPassword = jQuery("#password").val().trim();
        if (!jQuery(this).find("#jm_message").length)
            jQuery("#jm_cart_login #email")
                .parent()
                .before('<div id="jm_message"></div>');

        if (userEmail == "") {
            jQuery(this).find("#jm_message").css("display", "block");
            jQuery(this).find("#jm_message").html("Please enter your email");
            jQuery("#email").focus();
            return false;
        }

        if (userPassword == "") {
            jQuery(this).find("#jm_message").css("display", "block");
            jQuery(this).find("#jm_message").html("Please enter your password");
            jQuery("#password").focus();
            return false;
        }

        if (userPassword != "" && userPassword.length > 30) {
            jQuery(this).find("#jm_message").css("display", "block");
            jQuery(this)
                .find("#jm_message")
                .html(
                    "Please enter valid password. <a href='/forgot-password/'>Forgot Your Password?</a>"
                );
            jQuery("#password").focus();
            return false;
        }

        jQuery(this).find("#jm_message").remove();

        var data = jQuery(this).serialize();
        jQuery("#jm_cart_login .forgot-password").before(loaderCBox);
        jQuery(".inpSubmit_4").css("display", "none");

        jQuery.post(url, data, function (response) {
            response = jQuery.trim(response);
            if (response != "") {
                jsonResponse = jQuery.parseJSON(response);
                if (
                    jsonResponse.error <= 0 &&
                    (jsonResponse.paypal == 0 || jsonResponse.adminUser == 1)
                ) {
                    window.location.href = jsonResponse.error_message;
                } else if (
                    jsonResponse.error <= 0 &&
                    jsonResponse.paypal == 1
                ) {
                    jQuery(".inpSubmit_4").css("display", "block");
                    jQuery("#loaderCBox").remove();
                    jQuery(".beforePaypal").each(function () {
                        jQuery(this).empty();
                    });
                    jQuery("#pp_name").text(jsonResponse.name);
                    jQuery(".pp_box_login").each(function () {
                        jQuery(this).show();
                    });
                } else {
                    jQuery(".inpSubmit_4").css("display", "block");
                    jQuery("#loaderCBox").remove();
                    alert(jsonResponse.error_message);
                }
            }
        });
        return false;
    });

    jQuery("#searchform").submit(function () {
        var def = "Search Here...";
        if (jQuery("#s").val() == def) {
            return false;
        }
    });

    /* subscription form submitted */
    jQuery("#subscribe_button")
        .unbind()
        .click(function (e) {
            var email = jQuery("#subscribe_newsletter_email").val().trim();
            if (email == "Email Address") {
                email = "";
            }
            if (email == "") {
                alert("Please enter your email address.");
                jQuery("#subscribe_newsletter_email").focus();
                return false;
            }
            if (!isValidEmailAddress(email)) {
                alert("Please enter a valid email address.");
                jQuery("#subscribe_newsletter_email").focus();
                return false;
            }
            jQuery("#subscribe_button").attr("disabled", "disabled");
            var parms = "id=subscribe-form&nameinput=&emailinput=" + email;
            jQuery.ajax({
                type: "POST",
                url: templateUrl + "/includes/bronto/contact.php",
                data: parms,
                success: function (msg) {
                    alert(msg);
                    jQuery("#subscribe_newsletter_email").val("");
                },
                error: function (msg) {
                    alert(
                        "Sorry, something went wrong and we could not record your subscription request. Please try again."
                    );
                },
            });
            setTimeout(function () {
                jQuery("#subscribe_button").removeAttr("disabled");
            }, 2000);

            return false;
        });

    /* chart page subscribe form */
    jQuery("#subscribe_button_chart")
        .unbind()
        .click(function (e) {
            var email = jQuery("#subscribe_newsletter_email_chart")
                .val()
                .trim();
            if (email == "Email Address") {
                email = "";
            }
            if (email == "") {
                alert("Please enter your email address.");
                jQuery("#subscribe_newsletter_email_chart").focus();
                return false;
            }
            if (!isValidEmailAddress(email)) {
                alert("Please enter a valid email address.");
                jQuery("#subscribe_newsletter_email_chart").focus();
                return false;
            }
            jQuery("#subscribe_button_chart").attr("disabled", "disabled");
            var parms =
                "id=subscribe-form&nameinput=&section=chart&emailinput=" +
                email;
            jQuery.ajax({
                type: "POST",
                url: templateUrl + "/includes/bronto/contact.php",
                data: parms,
                success: function (msg) {
                    alert(msg);
                    jQuery("#subscribe_newsletter_email_chart").val("");
                },
                error: function (msg) {
                    alert(
                        "Sorry, something went wrong and we could not record your subscription request. Please try again."
                    );
                },
            });
            setTimeout(function () {
                jQuery("#subscribe_button_chart").removeAttr("disabled");
            }, 2000);

            return false;
        });

    jQuery("#timeset").on("click", function (e) {
        e.preventDefault();
        window.location.reload();
        return false;
    });
    jQuery("#timesetpp").on("click", function (e) {
        e.preventDefault();
        window.location.href = "/cart/";
        return false;
    });

    /* update all WPCF7 "Contact Us" form submissions with the fingerprintJS information*/
    if (jQuery("div.wpcf7").length === 1) {
        wpcf7Form = jQuery("form.wpcf7-form");

        var notExistForm = wpcf7Form.length !== 1;
        if (notExistForm) {
            return;
        }
        if (wpcf7Form[0].baseURI.match(/\/contact\//g)) {
            var notContactForm =
                wpcf7Form[0].baseURI.match(/\/contact\//g).length !== 1;
            if (notContactForm) {
                return;
            }
        }
        var isCompleted = wpcf7Form.find("input#fp_linked_id").length > 0;
        if (isCompleted) {
            // input already added
            return;
        }

        var contactForm = function (result) {
            if (typeof result === "undefined") {
                result = { visitorId: 0 };
            }

            jQuery('<input type="hidden" value="' + result.visitorId + '" />')
                .attr("id", "fp_visitor_id")
                .attr("name", "fp_visitor_id")
                .appendTo(wpcf7Form);
            jQuery('<input type="hidden" value="contact" />')
                .attr("id", "fp_linked_id")
                .attr("name", "fp_linked_id")
                .appendTo(wpcf7Form);
        };

        runFingerprintJS("contact", contactForm);
    }

    /* login form submitted */
    jQuery("#jmlogin")
        .off()
        .on("click", function (e) {
            e.preventDefault();

            jQuery("#jm_message").hide();
            var user_email = jQuery("#jm_user_email").val().trim();
            var user_password = jQuery("#jm_user_password").val().trim();
            var redirect = jQuery("#loginpage").val().trim();
            var params = {};
            window.location.search.replace(
                /[?&]+([^=&]+)=([^&]*)/gi,
                function (str, key, value) {
                    params[key] = value;
                }
            );
            if ("redirect_to" in params) {
                redirect = decodeURIComponent(params.redirect_to);
            } else if (window.location.hash) {
                redirect = redirect + window.location.hash;
            }

            if (user_email == "") {
                jQuery("#jm_message").fadeIn("slow");
                jQuery("#jm_message").html("Please enter your email");
                jQuery("#jm_user_email").focus();
                return false;
            }

            if (user_password == "") {
                jQuery("#jm_message").fadeIn("slow");
                jQuery("#jm_message").html("Please enter your password");
                jQuery("#jm_user_password").focus();
                return false;
            }

            if (user_password != "" && user_password.length > 30) {
                jQuery("#jm_message").fadeIn("slow");
                jQuery("#jm_message").html(
                    "Please enter valid password. <a class='forgotaccounts' href='/forgot-password/'>Forgot Your Password?</a>"
                );
                jQuery("#jm_user_password").focus();
                return false;
            }

            jQuery("#jmlogin").css("display", "none");
            jQuery('div[id^="login"] div.button-section').append(loaderBox);
            var login = function (result) {
                var parms = "&id=jm-ajaxlogin&";

                parms += jQuery("#jm-login-form").serialize();
                if (typeof result === "undefined") {
                    result = { visitorId: 0 };
                }

                parms +=
                    "&fp_visitor_id=" +
                    result.visitorId +
                    "&fp_linked_id=login";

                jQuery.ajax({
                    type: "POST",
                    url: templateUrl + "/includes/login.php",
                    data: parms,
                    success: function (msg) {
                        console.log(msg);
                        var parsedMsg = parseInt(msg);
                        if (parsedMsg == 1) {
                            if (window.location.href.includes("/alert-tools")) {
                                window.top.location.href =
                                    siteUrl +
                                    "/my-account/?action=alerts#tab-5";
                            } else {
                                window.top.location.href = redirect;
                            }
                        } else if (parsedMsg == 9) {
                            window.top.location.href = siteUrl + "/admin/";
                        } else {
                            jQuery("#jmlogin").css("display", "block");
                            jQuery("#loaderBox").remove();
                            jQuery("#jm_message").fadeIn("slow");
                            jQuery("#jm_message").html(msg);
                        }
                    },
                });
            };

            runFingerprintJS("login", login);

            return false;
        });

    /* forgot password form submitted */
    jQuery("#jm_forgot_pass_button")
        .off()
        .on("click", function () {
            var user_email = jQuery("#jm_user_email2").val().trim();
            var is_human = jQuery("#not-a-robot").prop("checked");
            if (user_email == "") {
                jQuery("#jm_message_forgot").fadeIn("slow");
                jQuery("#jm_message_forgot").html(
                    "<span style='width:100%;text-align:center;font-weight:bold;display:block;'>Please enter your email</span>"
                );

                jQuery("#jm_user_email2").focus();
                return false;
            } else if (!is_human) {
                alert("Are you a human?  Check the box and let us know!");
                return false;
            }

            var reset = function (result) {
                if (typeof result === "undefined") {
                    result = { visitorId: 0 };
                }
                var parms = "id=jm-ajaxforgotpassword&";
                parms = parms + jQuery("#jm-forgot-password-form").serialize();
                parms +=
                    "&fp_visitor_id=" +
                    result.visitorId +
                    "&fp_linked_id=reset";

                jQuery("#jm_forgot_pass_button").css("display", "none");
                jQuery("#jm_forgot_pass_button")
                    .parent("div")
                    .append(loaderBox);

                jQuery.ajax({
                    type: "POST",
                    url: "/log-me-in/forgot.php",
                    data: parms,
                    success: function (res) {
                        jres = jQuery.parseJSON(res);
                        if (jres.reset_res == 1) {
                            jQuery("#jm_message_forgot").text(jres.msg);
                            jQuery("#jm-forgot-password-form").hide();
                        } else {
                            alert(jres.msg);
                        }
                        jQuery("#jm_user_email").val("");
                        jQuery("#not-a-robot").prop("checked", false);
                        jQuery("#jm_forgot_pass_button").css(
                            "display",
                            "block"
                        );
                        jQuery("#loaderBox").remove();
                    },
                });
            };

            runFingerprintJS("reset", reset);

            return false;
        });
    /* change account form submitted */
    jQuery("#updatemyacount")
        .off()
        .on("click", function (e) {
            e.preventDefault();

            var firstname = jQuery("#first-name").val().trim();
            var lastname = jQuery("#last-name").val().trim();
            var phone = jQuery("#phone").val().trim();

            if (firstname == "" || lastname == "" || phone == "") {
                alert("Please enter all required fields.");
                return false;
            }

            if (
                jQuery("#first-name").val().trim().length > 52 ||
                jQuery("#last-name").val().trim().length > 52
            ) {
                alert(
                    "First Name or Last Name is longer than the max length of 52 characters"
                );
                return false;
            } else if (
                jQuery("#phone").val().trim().length > 15 ||
                jQuery("#phone-ext").val().trim().length > 10
            ) {
                alert("Phone or Phone Ext is too long!");
                return false;
            }

            var phone = phone.replace(/\D/g, "");
            var phone_length = phone.length;
            var is1800 = phone.startsWith("18");
            if (
                (is1800 && phone_length != 11) ||
                (!is1800 && phone_length != 10)
            ) {
                alert("Please check the format of your phone number.");
                return false;
            }
            var parms = "id=jm-ajaxupdateaccount&";
            parms = parms + jQuery("#jm_update_account").serialize();

            jQuery.ajax({
                type: "POST",
                url: "./assets/wp-content/themes/shared/ajax.php",
                data: parms,
                success: function (msg) {
                    jsonResponse = jQuery.parseJSON(msg);
                    if (jsonResponse.error <= 0) {
                        jQuery(
                            "#accountinfo > .my-account-box > .left-section > .name"
                        ).html(
                            jsonResponse.data["fname"] +
                                " " +
                                jsonResponse.data["lname"]
                        );
                        jQuery(
                            "#accountinfo > .my-account-box > .left-section > .ph-no"
                        ).html(
                            "Phone number: <span>" +
                                jsonResponse.data["phone"] +
                                "</span>"
                        );
                        if (jsonResponse.data["phoneExt"]) {
                            jQuery(
                                "#accountinfo > .my-account-box > .left-section > .ph-no"
                            ).html(
                                "Phone number: <span>" +
                                    jsonResponse.data["phone"] +
                                    " ext. " +
                                    jsonResponse.data["phoneExt"] +
                                    "</span>"
                            );
                        }
                        alert("Account Updated");
                        jQuery(".my-account-box.edit-info-det").removeClass(
                            "active"
                        );
                        jQuery(
                            ".tab-content.current .my-account-box.my-info"
                        ).removeClass("hide-table");
                        jQuery(".my-account-box.change-pwd-det").removeClass(
                            "active"
                        );
                    } else {
                        alert(jsonResponse.error_message);
                    }
                },
            });

            return false;
        });

    jQuery("#updatemypass")
        .off()
        .on("click", function (e) {
            e.preventDefault();

            var prev_pass = jQuery("#pwd").val().trim();
            var new_pass = jQuery("#new-pwd").val().trim();
            var confirm_pass = jQuery("#cpwd").val().trim();

            if (prev_pass == "") {
                alert("Please enter all required fields.");
                jQuery("#pwd").focus();
                return false;
            }
            if (prev_pass != "") {
                if (!isStrongPwd(new_pass)) {
                    alert(
                        "The password must be between 8 to 30 characters with one uppercase letter, one lower case letter, one number (0-9), one symbol (e.g. !@#$%^&*) and no spaces"
                    );
                    jQuery("#new-pwd").focus();
                    return false;
                }
                if (confirm_pass == "") {
                    alert("Please confirm new password.");
                    jQuery("#cpwd").focus();
                    return false;
                }
                if (new_pass != confirm_pass) {
                    alert("Password mismatch. New Passwords did not match.");
                    jQuery("#cpwd").focus();
                    return false;
                }
            }

            var parms = "id=jm-ajaxchangepassword&";
            parms = parms + jQuery("#jm_update_account2").serialize();

            jQuery.ajax({
                type: "POST",
                url: shareUrl + "/ajaxchangepassword.php",
                data: parms,
                success: function (msg) {
                    jsonResponse = jQuery.parseJSON(msg);
                    if (jsonResponse.error <= 0) {
                        alert("Account Updated");
                        jQuery("#jm_update_account2").html(
                            "Please reload this page if you wish to change your password again."
                        );
                        jQuery(".my-info").removeClass("hide-table");
                        jQuery(".my-info").addClass("active");
                        jQuery(".my-account-box.change-pwd-det").addClass(
                            "hide-table"
                        );
                        jQuery(".my-account-box.change-pwd-det").removeClass(
                            "active"
                        );
                    } else {
                        alert(jsonResponse.error_message);
                    }
                    jQuery("#pwd").val("");
                    jQuery("#new-pwd").val("");
                    jQuery("#cpwd").val("");
                },
            });

            return false;
        });

    jQuery("#change_email")
        .off()
        .on("click", function (e) {
            e.preventDefault();

            var new_email = jQuery("#new_email").val().trim();
            var existing_email = jQuery("#existing_email").val().trim();
            var confirm_email = jQuery("#cnew_email").val().trim();

            if (new_email == "" || confirm_email == "") {
                alert("Please enter all required fields.");
                return false;
            }

            if (new_email == existing_email) {
                alert(
                    "Please enter a different email. You can not change to the same email address."
                );
                return false;
            }

            if (existing_email != "") {
                if (new_email != confirm_email) {
                    alert(
                        "New Email field does not match with Confirm New Email field."
                    );
                    jQuery("#new_email").focus();
                    return false;
                } else if (
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                        new_email
                    ) !== true
                ) {
                    alert("You have entered an invalid email address!");
                    jQuery("#new_email").focus();
                    return false;
                }
            } else {
                alert("Previous email could not be found.");
                return false;
            }

            var parms = "id=jm-ajaxchangeemail&";
            parms = parms + jQuery("#jm_update_account3").serialize();

            jQuery.ajax({
                type: "POST",
                url: "./assets/wp-content/themes/shared/ajax.php",
                data: parms,
                success: function (msg) {
                    jsonResponse = jQuery.parseJSON(msg);
                    if (jsonResponse.error == 0) {
                        jQuery("#new_email").val("");
                        jQuery("#cnew_email").val("");
                        jQuery("#form_div").hide();
                        jQuery("#success_div").show();
                    } else {
                        alert(jsonResponse.error_message);
                    }
                },
            });

            return false;
        });

    /* my account form submitted */
    jQuery("#jm-myaccount-form").submit(function () {
        var firstname = jQuery("#jm_cust_first").val().trim();
        var lastname = jQuery("#jm_cust_last").val().trim();

        if (firstname == "") {
            alert("Please enter all requerd (*) fields.");
            jQuery("#jm_cust_first").focus();
            return false;
        }

        if (lastname == "") {
            alert("Please enter all requerd (*) fields.");
            jQuery("#jm_cust_last").focus();
            return false;
        }
    });

    /* register form submitted */
    jQuery(".createaccount")
        .off()
        .on("click", "#jm_register_form_button", function (e) {
            e.preventDefault();
            var firstname = jQuery("#jm_cust_first").val().trim();
            var lastname = jQuery("#jm_cust_last").val().trim();
            var cust_phone = jQuery("#jm_cust_phone").val().trim();
            var emailaddress = jQuery("#jm_cust_email").val().trim();
            var pass = jQuery("#jm_cust_password").val();
            var rpass = jQuery("#jm_cust_retype_password").val();
            var referer = jQuery(
                '#jm-register-form input[name="_wp_http_referer"]'
            ).val();

            if (firstname == "") {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html("Please enter your first name");
                jQuery("#jm_cust_first").focus();
                return false;
            }

            if (lastname == "") {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html("Please enter your last name");
                jQuery("#jm_cust_last").focus();
                return false;
            }

            if (cust_phone == "") {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html(
                    "Please enter your phone number"
                );
                jQuery("#jm_cust_phone").focus();
                return false;
            }
            var cust_phone = cust_phone.replace(/\D/g, "");
            var is1800 = cust_phone.startsWith("18");
            var cust_phone_length = cust_phone.length;
            if (
                (is1800 && cust_phone_length != 11) ||
                (!is1800 && cust_phone_length != 10)
            ) {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html(
                    "Please check your phone number format"
                );
                jQuery("#jm_cust_phone").focus();
                return false;
            }
            if (emailaddress == "") {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html("Please enter your email");
                jQuery("#jm_cust_email").focus();
                return false;
            }

            if (!isValidEmailAddress(emailaddress)) {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html(
                    "Please check your email address"
                );
                jQuery("#jm_cust_email").focus();
                return false;
            }

            if (pass == "") {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html("Please enter your password");
                jQuery("#jm_cust_password").focus();
                return false;
            }

            if (!isStrongPwd(pass)) {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html(
                    "The password must be between 8 to 30 characters with one uppercase letter, one lower case letter, one number (0-9), one symbol (e.g. !@#$%^&*) and no spaces"
                );
                jQuery("#jm_cust_password").val("");
                jQuery("#jm_cust_password").focus();
                return false;
            }

            if (rpass == "") {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html("Please confirm your password");
                jQuery("#jm_cust_retype_password").focus();
                return false;
            }

            if (pass != rpass) {
                jQuery("#jm_message_reg").fadeIn("slow");
                jQuery("#jm_message_reg").html(
                    "Password mismatch. Please try again."
                );
                jQuery("#jm_cust_password").val("");
                jQuery("#jm_cust_retype_password").val("");
                jQuery("#jm_cust_password").focus();
                return false;
            }

            if (jQuery(".agree_to_terms_new").length) {
                var terms = jQuery(".agree_to_terms_new").is(":checked");

                if (terms == false) {
                    alert(
                        "You need to agree to the Terms of Service and the Privacy Policy to continue."
                    );
                    return false;
                }
            }
            if (jQuery("#jm_page").val() == "page") {
                grecaptcha.ready(function () {
                    grecaptcha
                        .execute("6Lels7oaAAAAAEkFndJwxmS77ycIXLNkrdLeKQYg", {
                            action: "jm_create_account",
                        })
                        .then(function (token) {
                            jQuery("#jm-register-form").prepend(
                                "<input type='hidden' name='token' value='" +
                                    token +
                                    "'>"
                            );
                            jQuery("#jm-register-form").prepend(
                                "<input type='hidden' name='action' value='jm_create_account'>"
                            );
                        });
                });
            }

            var registration = function (result) {
                if (typeof result === "undefined") {
                    result = { visitorId: 0 };
                }

                var parms = "id=jm-ajaxregister&";
                parms += jQuery("#jm-register-form").serialize();
                parms +=
                    "&fp_visitor_id=" +
                    result.visitorId +
                    "&fp_linked_id=registration";

                jQuery.ajax({
                    type: "POST",
                    url: "/log-me-in/register.php",
                    data: parms,
                    success: function (msg) {
                        var parsedMsg = parseInt(msg);
                        if (parsedMsg === 1) {
                            if (referer == "/register-app") {
                                window.location.href =
                                    siteUrl + "/price-alert-app/";
                            } else if (
                                referer == "/alert-tools#account" ||
                                referer == "/alert-tools/#account"
                            ) {
                                window.location.href =
                                    siteUrl +
                                    "/my-account/?action=alerts#tab-5";
                            } else {
                                window.location.href = siteUrl + "/my-account/";
                            }
                        } else if (parsedMsg === 2) {
                            jQuery("#jm_cust_password").val("");
                            jQuery("#jm_cust_retype_password").val("");
                            jQuery("#jm_message_reg").fadeIn("slow");
                            jQuery("#jm_message_reg").html(
                                "It seems you already have an account with us. Please contact us for your details."
                            );
                        } else if (parsedMsg === 3) {
                            jQuery("#jm_cust_password").val("");
                            jQuery("#jm_cust_retype_password").val("");
                            jQuery("#jm_message_reg").fadeIn("slow");
                            jQuery("#jm_message_reg").html(
                                "Too many submissions. Please try again later."
                            );
                        } else {
                            jQuery("#jm_cust_password").val("");
                            jQuery("#jm_cust_retype_password").val("");
                            jQuery("#jm_message_reg").html(
                                "There was an error, please double check your details"
                            );
                        }
                    },
                });
            };

            runFingerprintJS("registration", registration);

            return false;
        });

    if (jQuery("#orderbox").length > 0) {
        jQuery(function () {
            var _floating_banner = jQuery("#orderbox");
            var _window = jQuery(window);
            var offset = _floating_banner.offset();
            var topPadding = 0;
            _window.scroll(function () {
                if (_window.scrollTop() > offset.top) {
                    _floating_banner.stop().animate({
                        marginTop:
                            _window.scrollTop() - offset.top + topPadding,
                    });
                } else {
                    _floating_banner.stop().animate({
                        marginTop: 20,
                    });
                }
            });
        });
    }

    jQuery(".img_list li a").on("click", function () {
        var src = jQuery(this).find("img").attr("src");
        src = src.replace("/th_", "/");
        jQuery(".img_show a img").attr("src", src);
        jQuery(".img_show a").attr("href", src);
        return false;
    });

    jQuery(".butn_checkout")
        .off()
        .on("click", function () {
            var paymentType = jQuery(
                "input[name=payment_method]:checked"
            ).val();
            if (paymentType == undefined) {
                alert("Please select a payment method");
                return false;
            }
        });

    jQuery("#accept_new").on("click", function () {
        jQuery("#cart").val(jQuery("#cart-new").val());
        jQuery("#cart_cc").val(jQuery("#cart_cc-new").val());
        jQuery("#checkout-form").submit();
        //parent.jQuery.fancybox.close();
    });

    /* faq */
    jQuery("#faq h2").click(function () {
        if (jQuery(this).next().is(":visible")) {
            jQuery(this).removeClass("open");
        } else {
            jQuery(this).addClass("open");
        }
        jQuery(this).next().slideToggle("normal");
    });

    jQuery("#nameinput").each(function () {
        var def = this.value;
        jQuery(this).focus(function () {
            if (this.value == def) {
                this.value = "";
            }
        });
        jQuery(this).blur(function () {
            if (this.value == "") {
                this.value = def;
            }
        });
    });

    jQuery("#emailinput").each(function () {
        var def = this.value;
        jQuery(this).focus(function () {
            if (this.value == def) {
                this.value = "";
            }
        });
        jQuery(this).blur(function () {
            if (this.value == "") {
                this.value = def;
            }
        });
    });

    jQuery("#optinnameinput").each(function () {
        var def = this.value;
        jQuery(this).focus(function () {
            if (this.value == def) {
                this.value = "";
            }
        });
        jQuery(this).blur(function () {
            if (this.value == "") {
                this.value = def;
            }
        });
    });

    jQuery("#optinemailinput").each(function () {
        var def = this.value;
        jQuery(this).focus(function () {
            if (this.value == def) {
                this.value = "";
            }
        });
        jQuery(this).blur(function () {
            if (this.value == "") {
                this.value = def;
            }
        });
    });

    jQuery(".pagination .jump input").on("change", function () {
        var page = jQuery(this).val();
        jQuery(".pagination .jump a").attr("rel", page);
    });

    /*for product detail tooltip*/
    jQuery(".usps,.toolclose").click(function () {
        jQuery("#stocktip").toggleClass("active");
    });

    jQuery(".crypto-question > i,.crypto-close").click(function () {
        jQuery("#crypto-tooltip").toggleClass("active");
        jQuery(".onsale-crypto-tooltip stock-detail").toggleClass("active");
    });

    jQuery(".onsale-crypto-question > i").click(function () {
        jQuery(this).siblings().toggleClass("active");
    });

    jQuery(".buybackclick,.toolclosebb").click(function () {
        jQuery("#buybacktip").toggleClass("active");
    });
    /*order status page*/
    jQuery(".order-pages .usps i").click(function () {
        jQuery(this).parent().siblings().toggleClass("active");
    });

    jQuery(".tool-tip-area > i").click(function () {
        jQuery(this).parents(".tool-tip").toggleClass("active");
    });

    jQuery(".wishlist-text,.wishlist-toolclose").click(function () {
        jQuery(".hint").toggleClass("active");
    });

    /*Cart page cart toggle end*/
    jQuery(".shipping span.usps").click(function () {
        jQuery(this).next().toggleClass("active");
    });

    jQuery(".tax .to-be-calculated").on("click", function () {
        jQuery(this).next().toggleClass("active");
    });

    jQuery(".gift .to-be-calculated").on("click", function () {
        jQuery(this).next().toggleClass("active");
    });

    jQuery(document).click(function (e) {
        if (
            !jQuery(e.target).is(
                ".fas, .usps, .tax, .stock-detail, .echeck-question, .stock-detail *,.wishlist-text, .calluslink *"
            )
        ) {
            jQuery(".stock-detail").removeClass("active");
            jQuery(".tool-tip").removeClass("active");
            jQuery(".hint").removeClass("active");
        }
    });

    jQuery(document).on("click", ".related-accessory .add-btn", function (e) {
        e.stopPropagation();

        let form = jQuery(this)
            .closest(".accessory-add")
            .find("form.addRelatedAccessoryForm");
        let isTriggerAttached = false;

        jQuery.ajax({
            type: "POST",
            url: shareUrl + "/ajax.php",
            data: form.serialize(),
            dataType: "json",
            success: function (data) {
                console.log(data);
                if ("error" in data) {
                    alert(data.error);
                } else if ("product_id" in data) {
                    jQuery(".popup-close").click();

                    setTimeout(function () {
                        window.location.reload();
                    }, 300);
                }
            },
        });

        return false;
    });

    jQuery(".add-accessories").on("click", function (e) {
        e.stopPropagation();

        let me = jQuery(this);
        let csrf = me.data("csrf");
        let product_id = me.data("product-id");

        jQuery.ajax({
            type: "POST",
            url: shareUrl + "/ajax.php",
            data: {
                csrf: csrf,
                product_id: product_id,
                id: "get-related-products",
            },
            success: function (data) {
                jQuery(".overlayer").addClass("overlay_active");
                jQuery("#accessoriesModal").html(data).show();
            },
        });

        return false;
    });

    jQuery(document).on(
        "click",
        "#accessoriesModal > div > div.popup-close",
        function () {
            jQuery(".overlayer").removeClass("overlay_active");
            jQuery("#accessoriesModal").hide();
        }
    );

    //login and register modals
    jQuery("#createaccounts, #createaccounts_military").on(
        "click",
        function (e) {
            jQuery(".overlayer").addClass("overlay_active");
            jQuery("#createaccountmodal").show();
        }
    );
    jQuery("#loginaccounts").on("click", function (e) {
        jQuery(".overlayer").addClass("overlay_active");
        jQuery("#loginaccount").show();
    });
    jQuery("#waitlistlogin").on("click", function (e) {
        jQuery(".overlayer").addClass("overlay_active");
        jQuery("#loginaccount").show();
    });

    jQuery(".addwaitlistlogin").on("click", function (e) {
        var _redirectUrl = jQuery(this).data("link");
        jQuery("#loginpage").val(_redirectUrl);
        jQuery(".overlayer").addClass("overlay_active");
        jQuery("#loginaccount").show();
    });
    jQuery("#myBtn").on("click", function (e) {
        jQuery(".overlayer").addClass("overlay_active");
        jQuery("#myModal").show();
    });
    jQuery(".overlayer").on("click", function () {
        jQuery("#myModal").hide();
        jQuery("#reviewModal").hide();
        jQuery(".modal").hide();
    });
    jQuery("#notLoggedInBtn").on("click", function (e) {
        jQuery("#loginaccounts").trigger("click");
    });
    jQuery(".login-close").on("click", function (e) {
        jQuery("#loginaccount").hide();
        jQuery(".overlayer").removeClass("overlay_active");
    });
    jQuery(".forgot-close").on("click", function (e) {
        jQuery("#forgotaccount").hide();
        jQuery(".overlayer").removeClass("overlay_active");
    });
    jQuery(".create-close").on("click", function (e) {
        jQuery("#createaccountmodal").hide();
        jQuery(".overlayer").removeClass("overlay_active");
    });

    jQuery("#loginaccount").on("click", ".forgotmodal", function (e) {
        e.preventDefault();
        jQuery("#loginaccount").hide();
        jQuery("#forgotaccount").hide();
        jQuery(".overlayer").removeClass("overlay_active");
    });
    jQuery("#loginaccount").on("click", ".forgotaccounts", function (e) {
        e.preventDefault();
        // autofill email on forgot password form
        jQuery("#jm_user_email2").val(jQuery("#jm_user_email").val());

        jQuery("#loginaccount").hide();
        jQuery("#forgotaccount").show();
    });
    jQuery(".log-in").on("click", function (e) {
        jQuery("#loginaccount").show();
        jQuery("#createaccountmodal").hide();
        jQuery(".overlayer").addClass("overlay_active");
        jQuery("#forgotaccount").hide();
    });
    jQuery("#makeaccount").on("click", function (e) {
        jQuery("#createaccountmodal").show();
        jQuery("#loginaccount").hide();
    });

    //active menu
    $(".main-nav ul.list-inline > li").mouseover(function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });

    $(".main-nav ul.list-inline > li").mouseout(function () {
        $(this).removeClass("active");
    });

    //homepage tab
    $(".tab-menus .tab-links a").on("click", function (e) {
        var currentAttrValue = $(this).attr("href");
        console.log(currentAttrValue);
        $(currentAttrValue).addClass("active").siblings().removeClass("active");
        $(this)
            .parent("li")
            .addClass("active")
            .siblings()
            .removeClass("active");
        e.preventDefault();
    });

    // preload spot bar for the floating header
    $(".floating-spot .spot-prices ul.list-inline").html(
        $(".container>.spot-prices>ul.list-inline").html()
    );

    //fixed header
    var iScrollPos = 0;
    jQuery(window).scroll(function () {
        var iCurScrollPos = jQuery(this).scrollTop();
        if (iCurScrollPos > 225) {
            //185
            jQuery(".header").addClass("fixed");
            jQuery(".floating-spot").css("display", "block");
            jQuery(".cart").insertAfter(".shipping-info");
            jQuery("body").css("padding-top", "106px"); //106
            setTimeout(function () {
                jQuery(".header").addClass("slide");
            }, 0);
        } else {
            jQuery(".header").removeClass("fixed slide");
            jQuery(".floating-spot").css("display", "none");
            jQuery(".cart").insertAfter(".register");
            jQuery("body").css("padding-top", "0px");
        }
    });

    /*for breadcrumb active class*/
    $(".breadcrumb li").click(function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });

    /*for list and grid view action in category page*/
    $(".toolbar .modes .modes-mode").click(function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });

    /*customized drown*/
    $("ul.grid-select").on("click", ".init", function () {
        $(this).closest("ul.grid-select").children("li:not(.init)").toggle();
    });

    var allOptions = $("ul.grid-select").children("li:not(.init)");
    $("ul.grid-select").on("click", " li:not(.init)", function () {
        allOptions.removeClass("selected");
        $(this).addClass("selected");
        $("ul.grid-select").children(".init").html($(this).html());
        allOptions.toggle();
    });

    /*selecting one element in checkbox*/

    $(".payment-selection li input").on("change", function () {
        $(".payment-selection li input").not(this).prop("checked", false);
        $(this).parents("li").addClass("selected");
        $(this).parents("li").siblings().removeClass("selected");
    });

    /*payment-section page*/
    /* JMB-8899 - :not(".waitlist-archives") to exclude myacc -> alert instock list */
    jQuery(
        '.payment-page  .payment-section ul:not(".waitlist-archives") li:nth-child(4)'
    ).addClass("method");

    jQuery("html").click(function (e) {
        //if (($(e.target).attr('class') != 'month') || ($(e.target).attr('class') != 'year'))
        if (!jQuery(e.target).hasClass("init")) {
            //alert('hi');
            jQuery(".select-area ul").each(function () {
                jQuery(this).find("li:not(.init)").hide();
            });
        }
    });

    jQuery("ul.grid-select1").on("click", ".init", function () {
        jQuery(this)
            .closest("ul.grid-select1")
            .children("li:not(.init)")
            .toggle();
    });

    var allOptions1 = jQuery("ul.grid-select1").children("li:not(.init)");
    jQuery("ul.grid-select1").on("click", " li:not(.init)", function () {
        allOptions1.removeClass("selected");
        jQuery(this).addClass("selected");
        jQuery("ul.grid-select1").children(".init").html($(this).html());
        allOptions1.toggle();
    });

    $("ul.grid-select3").on("click", ".init", function () {
        $(this).closest("ul.grid-select3").children("li:not(.init)").toggle();
    });

    var allOptions1 = $("ul.grid-select3").children("li:not(.init)");
    $("ul.grid-select3").on("click", " li:not(.init)", function () {
        allOptions1.removeClass("selected");
        $(this).addClass("selected");
        $("ul.grid-select3").children(".init").html($(this).html());
        allOptions1.toggle();
    });

    $(".payment-section ul.tabs li").click(function () {
        var tab_id = $(this).attr("data-tab");

        $(".payment-section ul.tabs li").removeClass("current");
        $(".payment-section .tab-content").removeClass("current");

        $(this).addClass("current");
        $("#" + tab_id).addClass("current");
    });

    $(".outofstock > i").click(function () {
        $("#outofstocktip.active")
            .not($(this).next("#outofstocktip"))
            .removeClass("active");
        $(this).next("#outofstocktip").toggleClass("active");
    });

    jQuery("table tr.cancellation td i").click(function () {
        jQuery(this).parents("tr").next().toggleClass("activated");
        jQuery(this).parents("tr").toggleClass("activated");
        //jQuery('.action-history').toggleClass('activated');
    });

    jQuery(".address-area  .user-address .button-section.address button").click(
        function () {
            jQuery(".address-area").addClass("hide-table");
            jQuery(".checkout-detail.address-section.new-address").toggleClass(
                "active"
            );
            jQuery(".checkout-detail.address-section.edit-address").removeClass(
                "active"
            );
        }
    );

    jQuery(
        ".checkout-detail.address-section.new-address .button-section.address-button .grey"
    ).click(function () {
        jQuery(".checkout-detail.address-section").removeClass("active");
        jQuery(".address-area").removeClass("hide-table");
    });
    /*ADDRESS PAGE js END*/

    /*checkout page tool tip*/
    $(".tool-area i").click(function () {
        $(this).next().toggleClass("active");
    });

    jQuery(document).on("click", ".recommendshipment", function (e) {
        if (jQuery(e.target).is("div")) {
            jQuery(".rec-tool-tip").toggleClass("active");
            return false;
        } else {
            jQuery(".rec-tool-tip").toggleClass("active");
        }
    });

    $("p.echeck-question").click(function () {
        jQuery(".echeck-tooltip").toggleClass("active");
    });

    /**payment method check-box**/
    jQuery(".credit-card .credit-detail .chk-box input").prop("checked", false);
    jQuery(".credit-card .credit-detail .chk-box input").click(function () {
        if (jQuery(this).is(":checked")) {
            jQuery(this)
                .closest("tr")
                .siblings("tr")
                .find(".chk-box input")
                .prop("checked", false);
        }
    });
    jQuery(".account-details .acct-detail .chk-box input").prop(
        "checked",
        false
    );
    jQuery(".account-details .acct-detail .chk-box input").click(function () {
        if (jQuery(this).is(":checked")) {
            jQuery(this)
                .closest("tr")
                .siblings("tr")
                .find(".chk-box input")
                .prop("checked", false);
        }
    });

    /**print-are***/
    $(".print").click(function () {
        //Hide all other elements other than printarea.
        $("#printarea").show();
        if ($("#my-account-header").length) {
            $("#my-account-header").hide();
            window.print();
            $("#my-account-header").show();
        } else window.print();
    });

    jQuery(".header li.cart").hover(function () {
        jQuery(".cart").toggleClass("active");
    });

    jQuery(".button-hover-tooltip").hover(function () {
        jQuery(".echeck-tooltip-privacy").toggleClass("active");
    });
});

function print_order(uri) {
    // remove old printframe if exists
    $("#order_iframe").remove();

    // create new printframe
    var iFrame = $("<iframe></iframe>");
    iFrame
        .attr("id", "order_iframe")
        .attr("name", "order_iframe")
        .attr("src", "about:blank")
        .css("width", "0")
        .css("height", "0")
        .css("position", "absolute")
        .css("left", "-9999px")
        .appendTo($("body:first"));

    // load printframe
    if (iFrame != null && uri != null) {
        iFrame.attr("src", uri);
        iFrame.load(function () {
            // nasty hack to be able to print the frame
            var tempFrame = $("#order_iframe")[0];
            var tempFrameWindow = tempFrame.contentWindow
                ? tempFrame.contentWindow
                : tempFrame.contentDocument.defaultView;

            tempFrameWindow.document.getElementById("jmheader").style.display =
                "none";
            tempFrameWindow.document.getElementById(
                "my-account-header"
            ).style.display = "none";
            tempFrameWindow.document.getElementsByClassName(
                "footer"
            )[0].style.display = "none";

            tempFrameWindow.focus();
            tempFrameWindow.print();
        });
    }
}

function jm_update_prices() {
    var xau = jQuery("#gounce").html();
    var xag = jQuery("#sounce").html();
    var xpt = jQuery("#plounce").html();
    var xpd = jQuery("#pdounce").html();

    jQuery(".fluid").each(function () {
        var metal = jQuery(this).attr("data-metal");
        var metaltype;
        switch (metal) {
            case "XAU":
                metaltype = xau;
                break;
            case "XAG":
                metaltype = xag;
                break;
            case "XPT":
                metaltype = xpt;
                break;
            case "XPD":
                metaltype = xpd;
                break;
        }

        var weight = jQuery(this).attr("data-weight");
        var prem = jQuery(this).attr("data-prem");
        var disc = jQuery(this).attr("data-disc");
        var curprem = jQuery(this).attr("data-curprem");

        if (metaltype) {
            var lowest = metaltype * weight + (prem - disc);
            if (jQuery(this).find(".actual-price").hasClass("discountLine")) {
                var cut_price = metaltype * weight + (curprem - disc);
            }
        }

        if (isNaN(lowest)) {
            lowest = jQuery(this).data("order");
            if (isNaN(lowest)) {
                lowest = 0;
            }

            if (jQuery(this).find(".actual-price").hasClass("discountLine")) {
                cut_price = jQuery(this).data("cut-price");
            }
        } else {
            jQuery(this).attr("data-order", lowest);
            lowest = number_format(lowest, 2);
        }

        jQuery(this)
            .find(".lowest-price")
            .html("$" + lowest);
        if (
            jQuery(this).find(".actual-price").hasClass("discountLine") &&
            cut_price > 0
        ) {
            jQuery(this)
                .find(".actual-price")
                .html("$" + number_format(cut_price, 2));
        }
    });

    if (
        jQuery("#sort0").length &&
        jQuery("#sort0").html() == "Price - Low to High"
    ) {
        jQuery("#sort1").click();
    }
    if (
        jQuery("#sort0").length &&
        jQuery("#sort0").html() == "Price - High to Low"
    ) {
        jQuery("#sort2").click();
    }
}

function jm_update_prices_buyback() {
    var xau = jQuery("#gounce").html();
    var xag = jQuery("#sounce").html();
    var xpt = jQuery("#plounce").html();
    var xpd = jQuery("#pdounce").html();

    jQuery(".tab-cols").each(function () {
        var metal = jQuery(this).attr("data-type");
        if (metal == "XAU") {
            var metaltype = xau;
        }
        if (metal == "XAG") {
            var metaltype = xag;
        }
        if (metal == "XPT") {
            var metaltype = xpt;
        }
        if (metal == "XPD") {
            var metaltype = xpd;
        }

        var weight = jQuery(this).attr("data-weight");
        var price = jQuery(this).attr("data-price");
        var fixedPrice = jQuery(this).attr("data-fixed-price");

        if (fixedPrice == "1") {
            var lowest = parseFloat(price);
        } else {
            var lowest = parseFloat(metaltype * weight) + parseFloat(price);
        }

        lowest = number_format(lowest, 2);

        jQuery(this)
            .find(".lowest")
            .html("$" + lowest);
    });
}

function jm_update_prices_list() {
    var xau = jQuery("#gounce").html();
    var xag = jQuery("#sounce").html();
    var xpt = jQuery("#plounce").html();
    var xpd = jQuery("#pdounce").html();

    jQuery(".tab-cols").each(function () {
        var weight = jQuery(this).attr("data-weight");
        var prem = jQuery(this).attr("data-prem");
        var disc = jQuery(this).attr("data-disc");
        var disc1 = jQuery(this).attr("data-disc1");
        var disc2 = jQuery(this).attr("data-disc2");
        var type = jQuery(this).attr("data-type");

        if (jQuery(this).is(".fluid")) {
            var metal = jQuery(this).attr("data-metal");
            if (metal == "XAU") {
                var metaltype = xau;
            }
            if (metal == "XAG") {
                var metaltype = xag;
            }
            if (metal == "XPT") {
                var metaltype = xpt;
            }
            if (metal == "XPD") {
                var metaltype = xpd;
            }
            var prod_base = metaltype * weight;

            if (type == "bitcoin") {
                var lowest = prod_base + (prem - disc);
                lowest = number_format(lowest * disc1, 2);
            } else if (type == "card") {
                var lowest = prod_base + (prem - disc);
                lowest = number_format(lowest * disc2, 2);
            } else {
                var lowest = number_format(prod_base + (prem - disc), 2);
            }
        } else {
            var prod_base = parseFloat(jQuery(this).attr("data-order"));
            if (type == "bitcoin") {
                var lowest = prod_base - disc;
                lowest = number_format(lowest * disc1, 2);
            } else if (type == "card") {
                var lowest = prod_base - disc;
                lowest = number_format(lowest * disc2, 2);
            } else {
                var lowest = number_format(prod_base - disc, 2);
            }
        }

        jQuery(this).html("$" + lowest);
    });
}

function number_format(number, decimals, dec_point, thousands_sep) {
    var n = number,
        prec = decimals;

    var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return (Math.round(n * k) / k).toString();
    };

    n = !isFinite(+n) ? 0 : +n;
    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
    var sep = typeof thousands_sep === "undefined" ? "," : thousands_sep;
    var dec = typeof dec_point === "undefined" ? "." : dec_point;

    var s = prec > 0 ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

    var abs = toFixedFix(Math.abs(n), prec);
    var _, i;

    if (abs >= 1000) {
        _ = abs.split(/\D/);
        i = _[0].length % 3 || 3;

        _[0] =
            s.slice(0, i + (n < 0)) +
            _[0].slice(i).replace(/(\d{3})/g, sep + "$1");
        s = _.join(dec);
    } else {
        s = s.replace(".", dec);
    }

    var decPos = s.indexOf(dec);
    if (prec >= 1 && decPos !== -1 && s.length - decPos - 1 < prec) {
        s += new Array(prec - (s.length - decPos - 1)).join(0) + "0";
    } else if (prec >= 1 && decPos === -1) {
        s += dec + new Array(prec).join(0) + "0";
    }
    return s;
}

function getCardType(cardNum) {
    if (!luhnCheck(cardNum)) {
        return "";
    }

    var payCardType = "";
    var regexMap = [
        { regEx: /^4[0-9]{0,}$/, cardType: "VISA" },
        {
            regEx: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$/,
            cardType: "MASTERCARD",
        },
        { regEx: /^3[47][0-9]{0,}$/, cardType: "AMEX" },
        {
            regEX: /^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$/,
            cardType: "DISCOVER",
        },
    ];

    for (var j = 0; j < regexMap.length; j++) {
        if (cardNum.match(regexMap[j].regEx)) {
            payCardType = regexMap[j].cardType;
            break;
        }
    }

    return payCardType;
}

function luhnCheck(cardNum) {
    var numericDashRegex = /^[\d]+$/;
    if (!numericDashRegex.test(cardNum)) return false;
    var nCheck = 0,
        nDigit = 0,
        bEven = false;
    var strippedField = cardNum.replace(/\D/g, "");

    for (var n = strippedField.length - 1; n >= 0; n--) {
        var cDigit = strippedField.charAt(n);
        nDigit = parseInt(cDigit, 10);
        if (bEven) {
            if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
    }

    return nCheck % 10 === 0;
}

jQuery(function () {
    jQuery(".card-number input").keyup(function () {
        var thisNum = jQuery(this).val();
        jQuery(".disclaimer").remove();
        jQuery(".card-type-icon img").css("display", "none");
        if (getCardType(thisNum) === "VISA") {
            jQuery(".visa-card").css("display", "block");
        } else if (getCardType(thisNum) === "MASTERCARD") {
            jQuery(".master-card").css("display", "block");
        } else if (getCardType(thisNum) === "AMEX") {
            jQuery(".amex-card").css("display", "block");
            if (jQuery("#is_qc").val() == "0") {
                jQuery("li.addr.active").append(
                    '<span class="disclaimer" style="top:6px;position:relative;font-size:12px;color:gray;">Please note: American Express orders must ship to an address associated with the credit card account.</span>'
                );
            }
        } else if (getCardType(thisNum) === "DISCOVER") {
            jQuery(".discover-card").css("display", "block");
        } else {
            jQuery(".card-type-icon img").css("display", "none");
        }
    });
});

function isStrongPwd(password) {
    var regExp =
        /(?!.*[\s])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/;
    var validPassword = regExp.test(password);
    if (validPassword == true) var validPassword = /^.{8,30}$/.test(password);
    return validPassword;
}

/* **************************************************
 * Phone Formatter script
 ************************************************* */
const isNumericInput = (event) => {
    const key = event.keyCode;
    return (
        event.shiftKey === false && // Disallow shift
        ((key >= 48 && key <= 57) || // Allow number line
            (key >= 96 && key <= 105)) // Allow number pad
    );
};

const isModifierKey = (event) => {
    const key = event.keyCode;
    return (
        key === 35 ||
        key === 36 || // Allow Home, End
        key === 8 ||
        key === 9 ||
        key === 13 ||
        key === 46 || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        // Allow Ctrl/Command + A,C,V,X,Z
        ((event.ctrlKey === true || event.metaKey === true) &&
            (key === 65 ||
                key === 67 ||
                key === 86 ||
                key === 88 ||
                key === 90))
    );
};

const enforceFormat = (event) => {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if (!isNumericInput(event) && !isModifierKey(event)) {
        event.preventDefault();
    }
};

const is1800Number = (number) => {
    return number.substring(0, 2) == 18;
};

const formatToPhone = (event) => {
    if (isModifierKey(event)) {
        return;
    }

    var phone = event.target.value.replace(/\D/g, "").substring(0, 11);
    event.target.value = applyPhoneFormat(phone);
};

const formatPhoneExtension = (event) => {
    if (isModifierKey(event)) {
        return;
    }

    applyPhoneExtensionFormat(event.target);
};

const applyPhoneFormat = (phone) => {
    var formattedPhone = "";
    if (is1800Number(phone)) {
        const one = phone.substring(0, 1);
        const zip = phone.substring(1, 4);
        const middle = phone.substring(4, 7);
        const last = phone.substring(7, 11);

        if (phone.length > 7) {
            formattedPhone = `${one}(${zip}) ${middle}-${last}`;
        } else if (phone.length > 4) {
            formattedPhone = `${one}(${zip}) ${middle}`;
        } else if (phone.length > 0) {
            formattedPhone = `${one}(${zip}`;
        }
    } else if (phone != "") {
        const zip = phone.substring(0, 3);
        const middle = phone.substring(3, 6);
        const last = phone.substring(6, 10);

        if (phone.length > 6) {
            formattedPhone = `(${zip}) ${middle}-${last}`;
        } else if (phone.length > 3) {
            formattedPhone = `(${zip}) ${middle}`;
        } else if (phone.length > 0) {
            formattedPhone = `(${zip}`;
        }
    }
    return formattedPhone;
};

const applyPhoneExtensionFormat = (input) => {
    // Limit to only 8 numbers
    input.value = input.value.replace(/\D/g, "").substring(0, 8);
};

jQuery(document).ready(function () {
    // Enforce phone number formatting
    jQuery(document).on("keydown", "#jm_cust_phone", enforceFormat);
    jQuery(document).on("keyup", "#jm_cust_phone", formatToPhone);
    jQuery(document).on("change", "#jm_cust_phone", formatToPhone);
    jQuery(document).on("blur", "#jm_cust_phone", formatToPhone);

    jQuery(document).on("keydown", "#shipping_phone", enforceFormat);
    jQuery(document).on("keyup", "#shipping_phone", formatToPhone);
    jQuery(document).on("change", "#shipping_phone", formatToPhone);
    jQuery(document).on("blur", "#shipping_phone", formatToPhone);

    jQuery(document).on("keydown", "#billing_phone", enforceFormat);
    jQuery(document).on("keyup", "#billing_phone", formatToPhone);
    jQuery(document).on("change", "#billing_phone", formatToPhone);
    jQuery(document).on("blur", "#billing_phone", formatToPhone);

    jQuery(document).on("keydown", "#phone", enforceFormat);
    jQuery(document).on("keyup", "#phone", formatToPhone);
    jQuery(document).on("change", "#phone", formatToPhone);
    jQuery(document).on("blur", "#phone", formatToPhone);

    jQuery(document).on("keydown", "#cc-phone", enforceFormat);
    jQuery(document).on("keyup", "#cc-phone", formatToPhone);
    jQuery(document).on("change", "#cc-phone", formatToPhone);
    jQuery(document).on("blur", "#cc-phone", formatToPhone);

    // Enforce numeric input for phone extension
    jQuery(document).on("keydown", "#phone-ext", enforceFormat);
    jQuery(document).on("keyup", "#phone-ext", formatPhoneExtension);
    jQuery(document).on("change", "#phone-ext", formatPhoneExtension);
    jQuery(document).on("blur", "#phone-ext", formatPhoneExtension);

    jQuery(document).on("keydown", "#shipping_phone_ext", enforceFormat);
    jQuery(document).on("keyup", "#shipping_phone_ext", formatPhoneExtension);
    jQuery(document).on("change", "#shipping_phone_ext", formatPhoneExtension);
    jQuery(document).on("blur", "#shipping_phone_ext", formatPhoneExtension);

    jQuery(document).on("keydown", "#billing_phone_ext", enforceFormat);
    jQuery(document).on("keyup", "#billing_phone_ext", formatPhoneExtension);
    jQuery(document).on("change", "#billing_phone_ext", formatPhoneExtension);
    jQuery(document).on("blur", "#billing_phone_ext", formatPhoneExtension);
});

function htmlEncode(str) {
    return String(str).replace(/[^\w. ]/gi, function (c) {
        return "&#" + c.charCodeAt(0) + ";";
    });
}

const doReponsiveStyles = (maxWidth, setter) => {
    const windowWidth = window.innerWidth;
    if (windowWidth <= maxWidth) {
        setter();
    }
};
