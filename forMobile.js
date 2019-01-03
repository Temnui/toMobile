let mQuantityOfProducts = 0; // don`t forget add feature save current state of basket
let mCampainNumber = '';
let mDescription = '';
let mDescriptionBody = '<br><div id="mDescriptionBody"></div>';
let mTopText = '';
let mBody = document.getElementsByTagName('body');
// uncomment next lie on prod, now old body is visible
// document.getElementById('mOldBody').style.display = "none";
/* Begin test for mobile */
// noinspection JSUnresolvedFunction
$(document).ready(function() {
    /*if (localStorage.getItem('mobileOrder') == 'true') {
        mStart();
    }*/
    // variable declaration for mobile
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    // mobile mCheck
    // uncomment next lie on prod now we check only for repAcctNumber
    // noinspection JSUnresolvedVariable
    let repAcctNumber = AvonAnalyticsObjex.Profile.repAcct;
    let checkAcctNumber = false;
    if (repAcctNumber === '22444856' || repAcctNumber === '29838218' || repAcctNumber === '17841221' || repAcctNumber === '8610786' || repAcctNumber === '26227353') {
        checkAcctNumber = true;
    }
    if (isMobile.any() && (/loginMain/.test(window.location.pathname)) && (/qaf/.test(window.location.hostname))) {
        // if user use mobile device on loginMain.page, we show him mobile version with bottom button "go to desktop view"
        if (localStorage.getItem('mobileOrder') == null) { // if mobileOrder == null - then we know that is the first visit and we switch to mobile view
            localStorage.setItem('mobileOrder', 'true');
            mStart();
        } else if (localStorage.getItem('mobileOrder') === 'false') {
            // if false, then we know that on previous time, choose desktop view, so we ask him did he want go to mobile
            if (confirm("Перейти в режим сдачи заказа для мобильного?")) {
                localStorage.setItem('mobileOrder', 'true');
                mStart();
            } else {
                localStorage.setItem('mobileOrder', 'false');
            }
        } else if (localStorage.getItem('mobileOrder') === 'true') {
            mStart();
        }
    } else if (isMobile.any() && (checkAcctNumber)) { //check rep account number and for mobile of course
        if (localStorage.getItem('mobileOrder') !== 'true') {
            if (confirm("Перейти в режим сдачи заказа для мобильного?")) {
                localStorage.setItem('mobileOrder', 'true');
                mStart();
            } else {
                localStorage.setItem('mobileOrder', 'false');
            }
        } else {
            mStart();
        }
    }
});
/* End test for mobile */
// isNumeric(n) returns true when n is only digit
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function mAddToOrder() {
    let mCheck = false;
    let mLinenumber = document.getElementById('mLinenumber').value;
    let mQuantity = document.getElementById('mQuantity').value;
    // mCheck for correct data
    if (mLinenumber.length === 5 && isNumeric(mLinenumber)) {
        mCheck = true;
    } else {
        mCheck = false;
        alert('Код продукту має бути п\'ятизначним числом');
    }
    if (mQuantity.length <= 3 && isNumeric(mQuantity)) {
        mCheck = true;
    } else {
        alert('Кількість має бути числом від 1 до 999');
        mCheck = false;
    }
    // do when data is correct
    if (mCheck) {
        document.getElementById('newItems[' + mQuantityOfProducts + '].campaignnr').value = mCampainNumber;
        // noinspection JSUnresolvedFunction
        validateProductNoAndQty(this, 'newItems[' + mQuantityOfProducts + '].campaignnr');
        document.getElementById('newItems[' + mQuantityOfProducts + '].linenumber').value = mLinenumber;
        document.getElementById('newItems[' + mQuantityOfProducts + '].quantity').value = mQuantity;
        mQuantityOfProducts += 1;
        sessionStorage.setItem('mQuantityOfProducts', mQuantityOfProducts);
        // noinspection JSUnresolvedFunction
        populateDescriptions();
    }
}

//add prototype to string for ability replace all in string

function replaceAll(str, searchStr, replaceStr) {
    // escape regexp special characters in search string
    searchStr = searchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return str.replace(new RegExp(searchStr, 'gi'), replaceStr);
}
//end of prototype 

// noinspection JSUnusedGlobalSymbols todo: check if we need this function
function setForDelete(j) {
    document.getElementById('savedCustomers[0].savedCustomerItems[' + j + '].checkedForDel').click();
    // noinspection JSUnresolvedFunction
    setDirtyValue();
    // noinspection JSUnresolvedFunction
    checkUncheckInner();
}

// function for place an order page.
function mCreateBody() {
    mBody[0].innerHTML = '<div id="mobileBody"></div><br><br><div id="mOldBody">' + mBody[0].innerHTML + '</div>';
    if (sessionStorage.getItem('mQuantityOfProducts') == null) {
        sessionStorage.setItem('mQuantityOfProducts', mQuantityOfProducts);
    }
    mQuantityOfProducts = Number(sessionStorage.getItem('mQuantityOfProducts'));
    // noinspection JSUnresolvedVariable
    mCampainNumber = AvonAnalyticsObjex.Profile.campaignInfo;
    mCampainNumber = mCampainNumber.split(":");
    mCampainNumber[1] = mCampainNumber[1].replace("C", "");
    let tempCampNumber = mCampainNumber[1];
    mCampainNumber = mCampainNumber[0] + mCampainNumber[1];
    mTopText = '<div id="mTopText">Кампанія ' + tempCampNumber + ', оберіть код продукту, та кількість:</div><br>';
    //var mSelCampain = '<select id="mSelCampain"><option selected value="' + mCampainNumber + '">' + mCampainNumber.replace('2018', '') + '</option></select>';
    let mInputs = '<input id="mLinenumber" tabindex="1" value="" type="number" size="6" maxlength="5" defaultvalue=""><input id="mQuantity" tabindex="2" value="1" type="text" size="3" maxlength="3" defaultvalue="1">';
    let mButtonAdd = '<button type="button" onclick=\'mAddToOrder();\'>Додати</button>';
    for (i = 0; mQuantityOfProducts >= i; i++) {
        if (document.getElementById('newItems[' + i + '].quantity').value !== 0) {
            let tempQuantity = document.getElementById('newItems[' + i + '].quantity').value;
            mDescription = 'Кількість: ' + tempQuantity + ' ' + document.getElementById('newItems[' + i + '].description.display').innerHTML + '<br>' + mDescription;
        }
    }
    let mCheckout = '<div id="mCheckput"><button type="button" onclick=\'mCheckout();\'>Додати до замовлення</button><div id="mBusket"></div></div>';
    let mGoToDelivery = '<input id="mGoToDelivery" type="submit" value="Оформлення замовлення" onclick="mGoToDeliveryFn()">';
    // noinspection JSUnresolvedFunction
    let mDeleteChecked = '<input id="mDeleteChecked" type="submit" value="Видалити" onclick="updateOrder();">';
    document.getElementById('mobileBody').innerHTML += mTopText + mInputs + mButtonAdd + mDescriptionBody + mCheckout + mDeleteChecked + mGoToDelivery;
    document.getElementById('mDescriptionBody').innerHTML = mDescription;
    // build basket
    let mBusket = '<div id="mBottomHeader">Обрані продукти:</div><table><tbody>';
    let mItemDescription = [];
    let mStringDescription = [];
    let i = 2;
    let j = 0;
    let tempVar = ''; // variable for replacement, what we want to replace
    let tempVar2 = ''; // variable for replacement, on what we replace
    while (document.evaluate('//*[@id="div_0"]/table/tbody/tr[' + i + ']', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue != null) {
        // noinspection JSUnresolvedVariable
        mStringDescription[j] = document.evaluate('//*[@id="div_0"]/table/tbody/tr[' + i + ']', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML;
        tempVar = 'savedCustomers[0].savedCustomerItems[' + j + ']';
        tempVar2 = 'mSavedCustomer[' + j + ']';
        mStringDescription[j] = replaceAll(mStringDescription[j], tempVar, tempVar2);
        mStringDescription[j] = mStringDescription[j].replace('checkUncheckInner\(\)', 'setForDelete\(' + j + '\)');
        // noinspection JSUnresolvedVariable
        mItemDescription[j] = document.evaluate('//*[@id="div_0"]/table/tbody/tr[' + i + ']/td[4]/table/tbody/tr/td[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
        //try delete unnecessary rows in old body to remove duplicate ID`s
        //document.evaluate('//*[@id="div_0"]/table/tbody/tr[' + i + ']', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML = '';
        //document.evaluate('//*[@id="div_0"]/table/tbody/tr[' + i + ']/td[4]/table/tbody/tr/td[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML = '';
        i += 1;
        j += 1;
    }
    for (i = 0; mStringDescription.length > i; i++) {
        mBusket += '<tr><td colspan="7">' + mItemDescription[i] + '</td></tr>' + mStringDescription[i];
    }
    // end build basket
    mBusket += '</tbody></table>';
    document.getElementById('mBusket').innerHTML = mBusket;
}

function mCheckout() {
    mQuantityOfProducts = 0;
    sessionStorage.setItem('mQuantityOfProducts', mQuantityOfProducts);
    // noinspection JSUnresolvedFunction
    updateOrder();
}

// function that allow go back to desktop view
function mUnmobile() {
    localStorage.setItem('mobileOrder', 'false');
    location.reload();
}

// function that create mobile view login page
function mCreateLogin() {
    // noinspection JSUnresolvedVariable
    let lpBecomeRepSl = document.evaluate('/html/body/table/tbody/tr[2]/td/table/tbody/tr/td[1]/span/div/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
    // noinspection JSUnresolvedVariable
    let lpHotOffer = document.evaluate('/html/body/table/tbody/tr[2]/td/table/tbody/tr/td[1]/span/div/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
    let mLoginUserID = document.getElementById('loginuserid').outerHTML;
    // noinspection JSUnusedAssignment
    mLoginUserID = mLoginUserID.replace('id="loginuserid"', 'id="mLoginUserID"');
    let mLoginPassword = document.getElementById('loginpassword').outerHTML;
    // noinspection JSUnusedAssignment
    mLoginPassword = mLoginPassword.replace('id="loginpassword"', 'id="mLoginPassword"');
    let mSubmitBtn = document.getElementById('submitBtn').outerHTML;
    // noinspection JSUnusedAssignment
    mSubmitBtn = mSubmitBtn.replace('id="submitBtn"', 'id="mSubmitBtn"');
    lpBecomeRepSl.id = "lpBecomeRepSl";
    // appendChild
    let div = document.createElement('div');
    div.id = "lpLoginDiv";
    mLoginUserID = '<input type="text" placeholder="Рахунок представника" id="mLoginUserID">';
    mLoginPassword = '<input type="password" placeholder="Пароль" id="mLoginPassword">';
    mSubmitBtn = '<input id="mSubmitBtn" type="submit" value="Продовжити" onclick="mSubmit()">';
    div.innerHTML = '<div id="lpLoginDiv">' + mLoginUserID + mLoginPassword + mSubmitBtn + '</div>' + '<div id="lpBecomeRepSl">' + lpBecomeRepSl + '</div>' + '<div id="lpHotOffer">' + lpHotOffer + '</div>';
    document.body.appendChild(div);
    // end appendChild
    //document.evaluate('/html/body/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display = "none";
    /*
    
    */
}

function mSubmit() {
    document.getElementById('loginuserid').value = document.getElementById('mLoginUserID').value;
    document.getElementById('loginpassword').value = document.getElementById('mLoginPassword').value;
    // noinspection JSUnresolvedFunction
    login();
}

function mPlaceAnOrder() {
    // skip SIM
    if (document.evaluate('/html/body/table/tbody/tr/td/table/tbody/tr[3]/td/table/tbody/tr/td/table/tbody/tr/td/div/table/tbody/tr/td/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue != null) {
        // noinspection JSUnresolvedFunction
        forward();
    }
    //create new basket
    //var mCampainNumber = AvonAnalyticsObject.Profile.campaignInfo.replace(':C', '/');
    // noinspection JSUnresolvedVariable
    let mCampainNumber = AvonAnalyticsObjex.Profile.campaignInfo.replace(':C', '/');
    let newBusket = '<div>Кампанія ' + mCampainNumber + '<br><img id="mCatalogOnPAO" src="http://static.avon.com.ua/REPSuite/static/homepage/img_2018/bro_icon.jpg">' + '<br><input id="mButtonCatalogOnPAO" type="button" value="Розмістити замовлення" onclick="mGoFromPlaceAnOrder()"></div>';
    //end create new basket
    if (document.getElementById('TB_overlay') != null) {
        document.getElementById('TB_overlay').style.display = "none"; // hide gray background
        // noinspection JSUnresolvedVariable
        document.evaluate('//*[@id="TB_overlay"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display = "none";
    }

    if (document.getElementById('TB_window') != null) {
        document.getElementById('TB_window').style.display = "none"; // hide pop-up with question about e-mail
        document.evaluate('//*[@id="TB_window"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML = '<div id="TB_window"></div>';
        // noinspection JSUnresolvedVariable
        document.evaluate('//*[@id="TB_window"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display = "none";
    }

    // noinspection JSUnresolvedVariable
    document.evaluate('/html/body/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display = "none";
    let div = document.createElement('div');
    div.id = "mPlaceAnOrder";
    //div.innerHTML = document.evaluate('//*[@id="highlitePAO_PAO_Header"]/div/table/tbody/tr[3]/td', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML; // default basket
    div.innerHTML = newBusket;
    document.body.appendChild(div);
    let mTextForHelp = 'Some long content';
    if (localStorage.getItem('helpPlaceAnOrder') === 'true') {
        //nothing
    } else {
        mHelpOverlay(mTextForHelp);
    }
}

//function orderEntry() {}
/* notes
blank login data:
document.getElementById('loginuserid').value = "8610786";
document.getElementById('loginpassword').value = "123abc";
login();
*/
/* delete this comment on prod
if (typeof mSriptLoaded !== "undefined") {
    // determined
}
else {
    // not determined
    let script = document.createElement("script");
    script.src = 'https://temnui.com/avontest/forMobile.js';
    document.head.appendChild(script);
    let mSriptLoaded = 1;
}
*/
//  function that start main process for mobile
function mStart() {
    //let mBody = document.getElementsByTagName('body');
    //mBody[0].innerHTML = mBody[0].innerHTML + '<div id="mobileBody"></div>';
    /* Set the ID to the required tags */
    //example: document.evaluate('xpath', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE
    //lp = login page
    // //*[@id="mOldBody"]/table/tbody/tr[2]/td/table/tbody/tr/td[1]/span/div/div[2]
    // /html/body
    /*
    let lpLogin = document.evaluate('/html/body/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML;
    let lpBanner = document.evaluate('/html/body/table/tbody/tr[2]/td/table/tbody/tr/td[1]/span/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML;
    let lpBottomMenu = document.evaluate('/html/body/table/tbody/tr[3]/td/table/tbody/tr[2]/td/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML;
    */
    /* End of set the ID to the required tags */
    // import css
    let tag_css = document.createElement('link');
    tag_css.rel = 'stylesheet';
    tag_css.href = 'http://temnui.com/avontest/forMobile.css'; // css source
    //tag_css.href = 'http://www.avon.com.ua/REPSuite/static/css/forMobile.css'; // css source
    tag_css.type = 'text/css';
    let tag_head = document.getElementsByTagName('head');
    tag_head[0].appendChild(tag_css);
    // end import css
    if (/loginMain/.test(window.location.pathname)) {
        mCreateLogin();
    } else if (/orderEntry.page/.test(window.location.pathname)) {
        mCreateBody();
    } else if (/home.page/.test(window.location.pathname)) {
        location.href = 'PlaceAnOrder.page';
    } else if (/PlaceAnOrder.page/.test(window.location.pathname)) {
        mPlaceAnOrder();
    } else if (/logoutMain.page/.test(window.location.pathname)) {
        location.href = 'PlaceAnOrder.page';
    } else if (/orderSummary.page/.test(window.location.pathname)) {
        mDeliveryPage();
    } else if (/subTotal.page/.test(window.location.pathname)) {
        mSubTotalPage();
    } else if (/orderConfirmation.page/.test(window.location.pathname)) {
        mOrderConfirmationPage();
    }
    //create back to desktop view button
    let mUnmobileButton = '<div class="mMiddle"><input id="mGoToDesktop" type="submit" value="Повна версія сайту" onclick="mUnmobile()"></div>';
    let div = document.createElement('div');
    div.id = "mOrderConfirmationPage";
    div.innerHTML = mUnmobileButton;
    document.body.appendChild(div);
}

// noinspection JSUnusedGlobalSymbols
function mSkipSim() {
    if (localStorage.getItem('mobileOrder') === 'true') {
        // noinspection JSUnresolvedFunction
        $(document).ready(function() {
            // noinspection JSUnresolvedFunction this function we use from teamsite
            forward();
        });
    }
}
// something unknown:
/*function getFromAAO(path) {
    let value = '';
    let newPath = path;
    $(document).ready(function() {
        value = newPath;
        if (newPath == AvonAnalyticsObjex.Profile.campaignInfo) {
            value = value.replace(':C', '/');
        }
    });
    return value;
}*/

let mDetails = '';

function mDeliveryPage() {
    let mDeliveryAddr = '<div id="mDeliveryAddr">Оберіть тип доставки <div onclick="mDeliveryMore();">Детальніше</div></div>';
    let mDeliveryAddrRadio = document.getElementById('deliveryType').outerHTML;
    let mRecipient = document.getElementsByClassName('padding_port_body2')[0];
    // noinspection JSUnusedAssignment
    mRecipient = mRecipient.outerHTML.replace('height="100%"', '');
    //mRecipient = mRecipient.replace('height="100%"', '');
    // noinspection JSUnresolvedFunction
    let mBtnContinue = '<br><div class="mMiddle"><button type="button" onclick="SubmitPagePort(\'orderSummary.page\',99,99,\'No\',\'true\',\'true\');"> Продовжити </button></div>';
    //mDeliveryAddrRadio = mDeliveryAddrRadio.replace('deliveryType', 'mDeliveryType');
    //mDeliveryAddrRadio = mDeliveryAddrRadio.replace(/deliveryTypeSelected/g, 'mdeliveryTypeSelected');
    if (document.getElementsByClassName('padding_port_address_body1')[1] === undefined) {
        mDetails = document.getElementsByClassName('padding_port_address_body1')[0];
        mDetails = mDetails.outerHTML;
    } else {
        mDetails = document.getElementsByClassName('padding_port_address_body1')[0];
        mDetails = mDetails.outerHTML;
    }
    mDeliveryAddrRadio = mDeliveryAddrRadio.replace(/updateDeliveryMethod\(this\)/g, "updateDeliveryMethod(this); updatemDetails();");
    mDeliveryAddrRadio = mDeliveryAddrRadio.replace('input', 'input onmousedown="updatemDetails(\'test\');"');
    let mPayment = document.getElementById('payment_highlighter').outerHTML;
    mPayment = mPayment.replace('payment_highlighter', 'mpayment_highlighter');
    mPayment = mPayment.replace('height="100%"', '');
    mPayment = mPayment.replace('javascript:OpenLearnMorePM', 'mReadMorePM');
    let mContent = mDeliveryAddr + mDeliveryAddrRadio + '<br><div id="mDetails">' + mDetails + '</div>' + mPayment + mBtnContinue; // add mRecipient after mPayment
    div = document.createElement('div');
    div.id = "mDeliveryContent";
    div.innerHTML = mContent;
    document.body.appendChild(div);
    //create popup with delivery details
    let mReadMore = document.getElementsByClassName('LearnMoreDM_txt')[0].outerHTML;
    let mReadMoreClose = '<span id="backArrow" onclick="mDeliveryMore()"><<</span>';
    div = document.createElement('div');
    div.id = "mReadMore";
    div.innerHTML = mReadMoreClose + mReadMore + mReadMoreClose;
    document.body.appendChild(div);
    document.getElementById('mReadMore').style.display = 'none';
    //create popup with payment method details
    let mReadMorePM = document.getElementsByClassName('LearnMorePM_txt')[0].outerHTML;
    let mReadMorePMClose = '<span id="backArrow" onclick="mReadMorePM()"><<</span>';
    let div = document.createElement('div');
    div.id = "mReadMorePM";
    div.innerHTML = mReadMorePMClose + mReadMorePM + mReadMorePMClose;
    document.body.appendChild(div);
    document.getElementById('mReadMorePM').style.display = 'none';
    // auto set number of clients
    document.getElementById('servedCustomerCount').value = '1';
    // noinspection JSUnresolvedFunction
    setDirtyValue();
}

function mReadMorePM() {
    if (document.getElementById('mReadMorePM').style.display === 'none') {
        document.getElementById('mReadMorePM').style.display = 'block';
    } else {
        document.getElementById('mReadMorePM').style.display = 'none';
        window.scrollTo(0, 0);
    }
}

function mDeliveryMore() {
    if (document.getElementById('mReadMore').style.display === 'none') {
        document.getElementById('mReadMore').style.display = 'block';
    } else {
        document.getElementById('mReadMore').style.display = 'none';
        window.scrollTo(0, 0);
    }
}

// noinspection JSUnusedGlobalSymbols
function updatemDetails(value) {
    document.getElementsByClassName('padding_port_address_body1')[1].outerHTML = document.getElementsByClassName('padding_port_address_body1')[0].outerHTML;
    let mUpdateMpayment = document.getElementById('payment_highlighter').outerHTML;
    mUpdateMpayment = mUpdateMpayment.replace('payment_highlighter', 'mpayment_highlighter');
    mUpdateMpayment = mUpdateMpayment.replace('height="100%"', '');
    document.getElementById('mpayment_highlighter').outerHTML = mUpdateMpayment;
    //document.getElementById('mDetails').innerHTML = document.getElementsByClassName('padding_port_address_body1')[0].outerHTML;
    return (value);
}

function mGoToDeliveryFn() {
    location.href = 'orderSummary.page';
}

function mSubTotalPage() {
    let pageHeader = '<h1>Підсумок замовлення</h1>';
    let deliveryTypeH = '<h2>Тип доставки</h2>';
    let deliveryTypeT = 'Ви обрали наступний тип доставки: ';
    // noinspection JSUnresolvedVariable
    let deliveryType = document.evaluate('//*[@id="headerGomac"]/form/table/tbody/tr/td/table[2]/tbody/tr/td[2]/table/tbody/tr[5]/td[6]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
    let deliveryDetailsH = '<h2>Деталі доставки</h2>';
    let deliveryDetailsT = 'Ваше замовлення буде доставлене: ';
    // noinspection JSUnresolvedVariable
    let deliveryDetails = document.evaluate('//*[@id="headerGomac"]/form/table/tbody/tr/td/table[2]/tbody/tr/td[2]/table/tbody/tr[4]/td[11]/div/div[2]/table/tbody/tr[3]/td[2]/div/div[1]/table/tbody/tr[3]/td[1]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
    let deliveryDateT = 'Орієнтована дата доставки: ';
    // noinspection JSUnresolvedVariable
    let deliveryDate = document.evaluate('//*[@id="headerGomac"]/form/table/tbody/tr/td/table[2]/tbody/tr/td[2]/table/tbody/tr[10]/td[17]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
    let paymentMethodH = '<h2>Спосіб оплати</h2>';
    let paymentMethodT = 'Ви обрали наступний спосіб оплати: ';
    // noinspection JSUnresolvedVariable
    let paymentMethod = document.evaluate('//*[@id="headerGomac"]/form/table/tbody/tr/td/table[2]/tbody/tr/td[2]/table/tbody/tr[4]/td[15]/div/div[2]/table/tbody/tr[3]/td[2]/div/div[2]/table/tbody/tr[3]/td[2]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
    let goodsNoDiscountH = '<br><h2>Товари без знижки:</h2>';
    let goodsNoDiscount = '';
    if (document.evaluate('//*[@id="panel_nodiscount"]/div/div[2]/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue !== null) {
        goodsNoDiscount = '<div id="mGoodsNoDiscount">';
        // noinspection JSUnresolvedVariable
        goodsNoDiscount += document.evaluate('//*[@id="panel_nodiscount"]/div/div[2]/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML;
        goodsNoDiscount += '</div>';
    }
    goodsNoDiscount = goodsNoDiscount.replace('<table cellpadding="0"', '<table id="goodsNoDiscount" cellpadding="0"');
    //goodsNoDiscount = goodsNoDiscount + '<br>' + 'Всього за товари без знижки: ' + document.evaluate('//*[@id="goodsNoDiscount"]/tbody/tr[position()=last()-1]/td[2]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
    let goodsFreeH = '';
    let goodsFree = '';
    if (document.evaluate('//*[@id="panel_nocost"]/div/div[2]/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue != null) {
        goodsFreeH = '<h2><br>Безкоштовні товари в цьому замовленні:</h2>';
        goodsFree = '<div id="mGoodsFree">';
        // noinspection JSUnresolvedVariable
        goodsFree += document.evaluate('//*[@id="panel_nocost"]/div/div[2]/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML;
        goodsFree += '</div>';
    }
    let allGoods = '';
    let allGoodsH = '<br><h2>Товари, замовлені в цій кампанії<h2>';
    if (document.evaluate('//*[@id="panel_savedItems"]/div/div[2]/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue !== null) {
        allGoods = '<div id="mAllGoods">';
        // noinspection JSUnresolvedVariable
        allGoods += document.evaluate('//*[@id="panel_savedItems"]/div/div[2]/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML;
        allGoods += '</div>';
    }
    let tempVar = document.getElementById('headerGomac').innerHTML;
    tempVar = tempVar.replace(/style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 12px; line-height: 1.1640625; font-weight: bold;"/g, "class=\"totalSummAll\"");
    document.getElementById('headerGomac').innerHTML = tempVar;
    let totalSummAll = document.getElementsByClassName('totalSummAll');
    let summWithDiscount = totalSummAll[0].innerHTML;
    summWithDiscount = summWithDiscount + ' ' + totalSummAll[1].innerHTML + '<br>';
    let discount = totalSummAll[2].innerHTML;
    discount = discount + ' ' + totalSummAll[3].innerHTML + '<br>';
    let totalSumm = totalSummAll[4].innerHTML;
    totalSumm = totalSumm + ' ' + totalSummAll[5].innerHTML + '<br>';
    let aditionalService = totalSummAll[6].innerHTML;
    aditionalService = aditionalService + ' ' + totalSummAll[7].innerHTML + '<br>';
    let terms = '<p>ВАЖЛИВО! Натискаючи кнопку «Відправити замовлення у Avon» Ви погоджуєтеся з наступним: Ви надаєте ДП «Ейвон Косметікс Юкрейн» згоду на обробку персональних даних на умовах, визначених згодою на обробку персональних даних , яка розміщена тут Ви належним чином повідомлені про включення Ваших персональних даних до бази персональних даних ДП «Ейвон Косметікс Юкрейн», про мету отримання та обробки своїх персональних даних та їх передачу третім особам Ви ознайомлені зі своїми правами як суб’єкта персональних даних та</span></p>';
    //checkbox
    let checkBox = document.getElementById('submissionCheck').outerHTML;
    let submitButton = document.getElementById('subButton').outerHTML;
    checkBox = checkBox.replace('id="submissionCheck"', 'msubmissionCheck" onchange = "mCheckedOnSubtotalPage()"');
    let textCheckBox = '<span id="textCheckBox">Я підтверджую, що ознайомлений з усією наданою інформацією.</span>';
    // create div for page
    let div = document.createElement('div');
    div.id = "mSubTotalPage";
    div.innerHTML = pageHeader + deliveryTypeH + deliveryTypeT + deliveryType + deliveryDetailsH + deliveryDetailsT + deliveryDetails + deliveryDetails + deliveryDateT + deliveryDate + paymentMethodH + paymentMethodT + paymentMethod + allGoodsH + allGoods + goodsNoDiscountH + goodsNoDiscount + goodsFreeH + goodsFree + '<div id="mSubTotal"><div id="mSumms"><p>' + summWithDiscount + discount + totalSumm + aditionalService + '</p></div>' + terms + checkBox + textCheckBox + '<br>' + submitButton + '</div>';
    div.innerHTML = replaceAll(div.innerHTML, 'style="font-family: \'DejaVu Sans\', Arial, Helvetica, sans-serif; color: #000000; font-size: 10px; line-height: 1.1635742;"', 'class = "mMyTable"');
    div.innerHTML = replaceAll(div.innerHTML, 'style="font-family: \'DejaVu Sans\', Arial, Helvetica, sans-serif; color: #000000; font-size: 11px; line-height: 1.1635742;"', 'class = "mMyTable"');
    div.innerHTML = replaceAll(div.innerHTML, 'style="font-family: \'DejaVu Sans\', Arial, Helvetica, sans-serif; color: #000000; font-size: 11px; line-height: 1.1635742; font-weight: bold;"', 'class = "mMyTableHeader"');
    div.innerHTML = replaceAll(div.innerHTML, 'Кількість', 'N');
    document.body.appendChild(div);
    // noinspection JSUnresolvedVariable
    if (document.evaluate('//*[@id="mAllGoods"]/table/tbody/tr[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML != null) {
        document.evaluate('//*[@id="mAllGoods"]/table/tbody/tr[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
    }
    // noinspection JSUnresolvedVariable
    if (document.evaluate('//*[@id="goodsNoDiscount"]/tbody/tr[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML != null) {
        document.evaluate('//*[@id="goodsNoDiscount"]/tbody/tr[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
    }

}

// noinspection JSUnusedGlobalSymbols
function mCheckedOnSubtotalPage() {
    document.getElementById('submissionCheck').checked = true;
}

function mOrderConfirmationPage() {
    let header = '<h1>Замовлення було успішно відправлено</h1>';
    let header2 = '<h2>Деталі замовлення:</h2>';
    // noinspection JSUnresolvedVariable
    let mText = document.evaluate('/html/body/table/tbody/tr/td/table/tbody/tr[3]/td/table/tbody/tr[1]/td/table/tbody/tr/td/div/div/form/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr[1]/td[1]/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML;
    mText = mText.replace('width="375"', 'width="100%"');
    let mGoToHomepage = '<div class="mMiddle"><button class="mMiddleButton" type="button" onclick="window.location.href=\'PlaceAnOrder.page\'">На головну</button></div>';
    // create div for page
    let div = document.createElement('div');
    div.id = "mOrderConfirmationPage";
    div.innerHTML = header + header2 + mText + '<br>' + mGoToHomepage;
    document.body.appendChild(div);
}

function mGoFromPlaceAnOrder() {
    // noinspection JSUnresolvedVariable
    let mCampainNumber = AvonAnalyticsObjex.Profile.campaignInfo.replace(':C', '/');
    // noinspection JSUnresolvedFunction
    submitFormPao(mCampainNumber);
}

function mHelpOverlay(mTextForHelp) {
    let mClose = '<input type="button" value=" X " id="mCloseButton" onClick="mHideHelpOverlay()">';
    let mHelpContent = '<div id="mHelpContent">' + mTextForHelp + '</div>';
    // create div for page
    let div = document.createElement('div');
    div.id = "mHelpOverlay";
    div.innerHTML = mClose + mHelpContent;
    document.body.appendChild(div);
}

function mHideHelpOverlay() {
    document.getElementById('mHelpOverlay').style.display = "none";
    localStorage.setItem('helpPlaceAnOrder', 'true');
}

let meta = document.createElement('meta');
meta.httpEquiv = "X-UA-Compatible";
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
document.getElementsByTagName('head')[0].appendChild(meta);