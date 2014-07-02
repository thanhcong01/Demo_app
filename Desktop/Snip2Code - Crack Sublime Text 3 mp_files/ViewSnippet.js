/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../typings/zeroclipboard/zeroclipboard.d.ts" />
/// <reference path="../snip2code.ts" />
var copySnipCode;
var copyEmbed;
var clipCopyUrl;

// ---------------------------------------------------------------------------------
function shareOAS(shareType, snippetId, visibility, confirmMsg) {
    switch (visibility) {
        case 'private':
            if (confirm(confirmMsg)) {
                shareSnippet(snippetId, 0, 'Cannot publish this snippet', function (data) {
                    location.reload();
                }, false);
            } else {
                return false;
            }
            break;
        case "protected":
            if (!confirm(confirmMsg))
                return false;
    }

    // track the click of the user:
    var reqUrl = '/Explore/WhoShare?snippetId=' + snippetId + '&thirdparty=' + shareType;
    sendAjaxReq(reqUrl, {}, null, '', '', '', '');

    $('.oas_btn_' + shareType).click();
}

function trackCopy(snippetId, embedded) {
    var reqUrl = '/Explore/WhoCopy';
    if (embedded)
        reqUrl += 'Embed';
    reqUrl += '/' + snippetId;
    sendAjaxReq(reqUrl, {}, null, '', '', '', '');
}

// Setup the click events for shareOneAll buttons
// ---------------------------------------------------------------------------------
function setupClickSOAll(snippetId, visibility, confirmMsg) {
    $('.invisibShare_linkedin').click(function () {
        shareOAS('linkedin', snippetId, visibility, confirmMsg);
    });
    $('.invisibShare_twitter').click(function () {
        shareOAS('twitter', snippetId, visibility, confirmMsg);
    });
    $('.invisibShare_facebook').click(function () {
        shareOAS('facebook', snippetId, visibility, confirmMsg);
    });
    $('.invisibShare_digg').click(function () {
        shareOAS('digg', snippetId, visibility, confirmMsg);
    });
    $('.invisibShare_google_bookmarks').click(function () {
        shareOAS('google_bookmarks', snippetId, visibility, confirmMsg);
    });
    $('.invisibShare_facebook_like_but').click(function () {
        shareOAS('facebook_like_but', snippetId, visibility, confirmMsg);
    });
    $('.invisibShare_linkedin_share_but').click(function () {
        shareOAS('linkedin_share_but', snippetId, visibility, confirmMsg);
    });
    $('.invisibShare_google_plus_one_but').click(function () {
        shareOAS('google_plus_one_but', snippetId, visibility, confirmMsg);
    });
    $('.invisibShare_twitter_tweet_but').click(function () {
        shareOAS('twitter_tweet_but', snippetId, visibility, confirmMsg);
    });
}

// ---------------------------------------------------------------------------------
function setupEmbedPanel(clipEmbed, tooltip) {
    // This is required to get ZeroClipboard to work on IE
    // it makes sure the flash movie is correctly positioned on top of the Copy button
    if (navigator.appName == 'Microsoft Internet Explorer') {
        $('#copyToClipFrame').css('position', 'relative');
    }

    function recalEmbedDivHeight() {
        //CG: compute the real height of the rawCodeEmbed div:
        //3 rows: 47px; 2 rows: 31px;
        var embedPanelHeight = 25 + 44 + $('#rawCodeEmbed').height();
        $('#codeEmbedPanel').animate({
            height: embedPanelHeight + 'px'
        }, 800, 'easeInOutQuart', function () {
            clipEmbed = new ZeroClipboard($('#codeEmbedDiv').get(), { hoverClass: "codeEmbedFrameHover", activeClass: "codeEmbedFrameHover" });

            //track the copy actions of the user:
            clipEmbed.on('complete', function (client, args) {
                trackCopy($(this).data('snippetId'), true);
            });
        });
    }

    $('.codeEmbed').prop('title', tooltip);
    $('#embedBt').click(function () {
        if ($('#codeEmbedPanel').height() <= 2) {
            recalEmbedDivHeight();
        } else
            $('#codeEmbedPanel').animate({ height: '1px' }, 200, 'linear');
    });

    $('#inputEmbedWidth').keydown(filterAlpha);
    $('#inputEmbedHeight').keydown(filterAlpha);
    $('#inputEmbedStartLine').keydown(filterAlpha);
    $('#inputEmbedEndLine').keydown(filterAlpha);

    $('#inputEmbedWidth').keyup(function () {
        $('#embedWidth').html($(this).val());
        clipEmbed.setText($('#rawCodeEmbed').text());
    });
    $('#inputEmbedHeight').keyup(function () {
        $('#embedHeight').html($(this).val());
        clipEmbed.setText($('#rawCodeEmbed').text());
    });

    function computeStartEndLine() {
        var result = '';
        var somethingFound = false;

        if (($('#inputEmbedStartLine').val() != '') && ($('#inputEmbedStartLine').val() != 'undefined')) {
            result = '?startLine=' + $('#inputEmbedStartLine').val();
            somethingFound = true;
        }
        if (($('#inputEmbedEndLine').val() != '') && ($('#inputEmbedEndLine').val() != 'undefined')) {
            if (!somethingFound)
                result = '?';
            else
                result += '&amp;';
            result += 'endLine=' + $('#inputEmbedEndLine').val();
        }

        return result;
    }

    $('#inputEmbedStartLine').keyup(function () {
        $('#embedStartEndLines').html(computeStartEndLine());
        recalEmbedDivHeight();
        clipEmbed.setText($('#rawCodeEmbed').text());
    });
    $('#inputEmbedEndLine').keyup(function () {
        $('#embedStartEndLines').html(computeStartEndLine());
        recalEmbedDivHeight();
        clipEmbed.setText($('#rawCodeEmbed').text());
    });
}

function s2cPageResize() {
    if (copySnipCode)
        copySnipCode.reposition();
    if (copyEmbed)
        copyEmbed.reposition();
    if (clipCopyUrl)
        clipCopyUrl.reposition();
}

// Plus and Minus one voting callbacks
// ---------------------------------------------------------------------------------
function voteSnippet(snippetId, vote) {
    rateSnippet(snippetId, vote, function (newRating) {
        var v = $('#votes').data('votes');
        if (newRating > -10000)
            v = newRating;
        else
            v += vote;

        $('#votes').data('votes', v);
        if (v < 999)
            $('#votes').text(v);
    });
}

// ---------------------------------------------------------------------------------
function setupMainButtonsAndDialogs(snippetId, snippetNameUrl, embedTooltip) {
    var $dlgButton;
    var selCount = 0;

    ZeroClipboard.config({ moviePath: '/Scripts/ZeroClipboard.swf' });

    $("#shareDialog").dialog({
        autoOpen: false,
        modal: true,
        width: 540,
        height: 475,
        show: {
            effect: "blind",
            duration: 200
        },
        buttons: [{
                id: "share-ok",
                disabled: true,
                text: "Share",
                click: function () {
                    var snippetId = $("#shareDialog").data("snippetId");
                    var toGroup = -1;
                    $('.groupInfo.selected').each(function () {
                        toGroup = $(this).data('groupId');
                    });
                    if (toGroup <= 0) {
                        alert("Please select a group");
                    } else {
                        shareSnippet(snippetId, toGroup, 'Error while trying to share this Snippet.\n', function (data) {
                            $("#shareDialog").dialog('close');
                            window.location.href = '/Snippet/' + snippetId + '/' + snippetNameUrl;
                        }, true);
                    }
                }
            }]
    });

    $("#publishDialog").dialog({
        autoOpen: false,
        modal: true,
        width: 540,
        height: 490,
        show: {
            effect: "blind",
            duration: 200
        },
        buttons: [{
                id: "publish-ok",
                disabled: true,
                text: "Publish",
                click: function () {
                    var snippetId = $("#publishDialog").data("snippetId");
                    var channelIds = new Array();
                    $('.groupInfo.selected').each(function () {
                        channelIds.push($(this).data('channelId'));
                    });
                    publishSnippet(snippetId, channelIds, function () {
                        window.location.href = '/Snippet/' + snippetId + '/' + snippetNameUrl;
                        ;
                    }, function (jqXHR, msg) {
                        $("#publishDialog").dialog('close');
                        alert('Error while trying to publish this Snippet.\n' + msg);
                    });
                }
            }]
    });

    $('.groupInfo').click(function () {
        var isSingleChoice = $(this).data("singlechoice");
        if (isSingleChoice) {
            $('.groupInfo').removeClass('selected');
        }

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            selCount--;
        } else {
            $(this).addClass('selected');
            selCount++;
        }
        if ($dlgButton && selCount > 0)
            $dlgButton.button("enable");
        else
            $dlgButton.button("disable");
    });

    $(".publishBt").click(function () {
        $dlgButton = $('#publish-ok');
        $dlgButton.button('disable');
        selCount = 0;
        $('.groupInfo').removeClass('selected');
        $("#publishDialog").data("snippetId", $(this).data("snippetId")).dialog("open");
    });

    $("#shareBt").click(function () {
        $dlgButton = $('#share-ok');
        $dlgButton.button('disable');
        selCount = 0;
        $('.groupInfo').removeClass('selected');
        $("#shareDialog").data("snippetId", $(this).data("snippetId")).dialog("open");
    });

    $("#unshareBt").click(function () {
        var snippetId = $(this).data("snippetId");
        var toGroup = $(this).data("toGroup");
        if (confirm('Are you sure you want to unshare this snippet? Your precious pearl of wisdom will not be available any more to the members of the group!') == true) {
            shareSnippet(snippetId, toGroup, 'Cannot unshare this snippet', function () {
                location.reload();
            }, true);
        }
        return false;
    });

    $("#moveBt").click(function () {
        $dlgButton = $('#share-ok');
        $dlgButton.button('disable');
        var selCount = 0;
        $('.groupInfo').removeClass('selected');
        $("#shareDialog").data("snippetId", $(this).data("snippetId")).dialog("open");
    });

    $('#voteUp').click(function () {
        if (!$('#voteUp').hasClass('voted')) {
            voteSnippet(snippetId, 1);
            $('#voteUp').addClass('voted');
            $('#voteDown').removeClass('voted');
        }
    });
    $('#voteDown').click(function () {
        if (!$('#voteDown').hasClass('voted')) {
            voteSnippet(snippetId, -1);
            $('#voteDown').addClass('voted');
            $('#voteUp').removeClass('voted');
        }
    });

    // ---------------------------------------------------------------------------------
    $("#unpublishBt").click(function () {
        var snippetId = $(this).data("snippetId");
        var toGroup = $(this).data("toGroup");
        if (confirm('Are you sure you want to unpublish this snippet? Your precious pearl of wisdom will not be available any more to the world!') == true) {
            shareSnippet(snippetId, toGroup, 'Cannot unpublish this snippet', function () {
                location.reload();
            }, true);
        }
        return false;
    });

    // ---------------------------------------------------------------------------------
    $(".channelUnpublish").click(function () {
        var snippetId = $(this).data("snippetId");
        var channelId = $(this).data("channelId");
        var $channelElement = $(this).parent();
        unpublishSnippet(snippetId, channelId, function (msg) {
            setTimeout(function () {
                $channelElement.animate({ opacity: 0.0, height: 0 }, 200, 'linear', function () {
                    $channelElement.hide();
                });
            }, 500);
        });
    });

    // ---------------------------------------------------------------------------------
    $('.snipLink').click(function () {
        var snippetId = $(this).data('snippetId');
        window.location.href = '/Snippet/' + snippetId;
    });

    setupEmbedPanel(copyEmbed, embedTooltip);

    // Zero Clipboard setup
    copySnipCode = new ZeroClipboard($('#copyToClipBt').get(), { hoverClass: "s2cButtonHover", activeClass: "s2cButtonActive" });

    //track the copy actions of the user:
    copySnipCode.on('complete', function (client, args) {
        trackCopy($(this).data('snippetId'), false);
    });

    copySnipCode.on('noflash', function (client, args) {
        // No flash supported, unglue to prevent js errors
        //alert('Hey, seems that Flash player is not installed on your browser: "Copy" feature will not work!');
        client.unglue($('#copyToClipBt'));
        $('#copyToClipBt').css('display', 'none');
    });
}
//# sourceMappingURL=ViewSnippet.js.map
