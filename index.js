
(async function myFunc () {
    
    // const element = document.getElementById("myTable");
    // const refApi = await element.getRefApi();
    // const obj = await refApi.getObject();
    // let objLayout = await obj.getLayout();

    // Build qlik/api config
    const config = {
        authType: "oauth2",
        clientId: "bf494408325438d08169cb6677f8ec29",
        redirectUri: "https://localhost:8080/oauth_callback.html",
        accessTokenStorage: "session",
        // webIntegrationId: "fEHOcO3g9e6shAngibIM9z1toB8lccae", //
        host: "cvh.eu.qlikcloud.com" //TODO: get this automatically if possible
    };


    // =========== custom OAuth flow ==================
    // const customRedirectUri = 'https://localhost:8080/oauth_callback_custom.html'

    // //Trying to get OAuth token using redirect
    // // GENERATING CODE VERIFIER
    // function dec2hex(dec) {
    //     return ("0" + dec.toString(16)).substr(-2);
    // }
    
    // function generateCodeVerifier() {
    //     var array = new Uint32Array(56 / 2);
    //     window.crypto.getRandomValues(array);
    //     return Array.from(array, dec2hex).join("");
    // }
    // function sha256(plain) {
    //     // returns promise ArrayBuffer
    //     const encoder = new TextEncoder();
    //     const data = encoder.encode(plain);
    //     return window.crypto.subtle.digest("SHA-256", data);
    // }
    
    // function base64urlencode(a) {
    //     var str = "";
    //     var bytes = new Uint8Array(a);
    //     var len = bytes.byteLength;
    //     for (var i = 0; i < len; i++) {
    //         str += String.fromCharCode(bytes[i]);
    //     }
    //     return btoa(str)
    //         .replace(/\+/g, "-")
    //         .replace(/\//g, "_")
    //         .replace(/=+$/, "");
    // }
    
    // async function generateCodeChallengeFromVerifier(v) {
    //     var hashed = await sha256(v);
    //     var base64encoded = base64urlencode(hashed);
    //     return base64encoded;
    // }
    // const codeVerifier = generateCodeVerifier();
    // localStorage.setItem("codeVerifier", codeVerifier);
    // const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier)
    // const state = generateCodeVerifier()
    // const headTag = document.getElementsByTagName('HEAD')[0];
    // const metaTag = document.createElement('meta');
    // metaTag.setAttribute("http-equiv", "refresh");
    // metaTag.setAttribute("content", `3;url=https://${config.host}/oauth/authorize?client_id=${config.clientId}&code_challenge_method=S256&redirect_uri=${customRedirectUri}&response_type=code&scope=user_default&state=${state}&code_challenge=${codeChallenge}`);
    // headTag.appendChild(metaTag);
    
    // =========== END custom OAuth flow ===============


    // return
    window.qlikApi.auth.setDefaultHostConfig(config);

    // const { data: mySpaces } = await window.qlikApi.spaces.getSpaces();
    // console.log("mySpaces: ", mySpaces);

    
    // 0. Tests
    // open new app session
    const appSession = window.qlikApi.qix.openAppSession({appId:"633bcf3c-c309-4bc1-9fc3-969bc41aa869", autoResume:true});
    //Tracing websocket events
    const events = appSession.onWebSocketEvent((event) => {
        console.log("event: ", event);
    });
    // // get the "qix document (qlik app)"
    const app = await appSession.getDoc();
    // alternative way for monitoring websocket event
    app.session.rpc.on("closed", (event) => {
        console.log("closed event: ", event);
    })
    app.session.rpc.on("suspended", (event) => {
        console.log("suspended event: ", event);
    })
    app.session.rpc.on("resuming", (event) => {
        console.log("resuming event: ", event);
    })
    app.session.rpc.on("resumed", (event) => {
        console.log("resumed event: ", event);
    })
    // // get a variable
    const myVar = await app.getVariableByName('vShowArch');   // change with your variable name
    // // show current value
    const currentValue = await myVar.getLayout();
    // console.log("current var value: ", currentValue.qNum);
    // // set variable value (number)
    // await myVar.setNumValue(1);                               // change with your variable value. If it is a string, change method to `setStringValue`
    // // show new value
    // const newValue = await myVar.getLayout();
    // console.log("new var value: ", newValue.qNum);
    // //get collections
    // const collections = await window.qlikApi.collections.getCollections();
    // console.log("collections: ", collections);
    
    // //1.Get data from existing filterpane
    // const filterPane = await app.getObject("CvJ");
    // //Get layout
    // const filterPaneLayout = await filterPane.getLayout();
    // //Get listbox within filter pane. It is an array, loop over it if you have more than once
    // const listbox = await app.getObject(filterPaneLayout.qChildList.qItems[0].qInfo.qId);
    
    // //2.Get list box data
    // //Get listbox layout
    // const listboxLayout = await listbox.getLayout();
    // //Read listbox height. This allow me to get all data at once (if they are few) or make more calls for retrieving all data.
    // const listboxHeight = listboxLayout.qListObject.qSize.qcy
    // //We recommend to get more data only when user perform a scroll into your dropdown/select component and you reach end of your current data.
    // //E.g. I will get first 200 rows, then when user scroll down and he is close to end of my 200 rows, perform another getListObjectData, and get
    // //200 rows for populating my dropdown/select component, and so on...
    // //listboxHeight is useful to understand where is my end of data.
    // const listboxDataDef = {
	// 	"qPath": "/qListObjectDef",
	// 	"qPages": [
	// 		{
	// 			"qLeft": 0,
	// 			"qTop": 0,          //Use this to move down along data. 0 is first record.
	// 			"qWidth": 1,       // This is number of column. List box should always have 1 column. Max is 1,000 cells (width * height)
	// 			"qHeight": 200      //This is the number of rows retrieved from engine. Max is 1,000 cells (width * height)
	// 		}
	// 	]
	// };
    // const listboxData = await listbox.getListObjectData(listboxDataDef);
    // console.log("listboxData: ", listboxData[0].qMatrix);

    // //Get current selections
    // const currentSelectionsDef = {
    //     "qInfo": {
    //         "qType": "CurrentSelection"
    //     },
    //     "qSelectionObjectDef": {}
    // }
    // const currentSelections = await app.createSessionObject(currentSelectionsDef);
    // const currentSelectionsLayout = await currentSelections.getLayout();
    // //Show current selections. I'm showing an array which will contain current selections information.
    // //Here we are looking only for which field is selected, not values. 
    // //With current selections object we can see max 6 selected values, then we will se 7 of 20, 11 of 50, and so on
    // //For reading selected values we need to create listbox for each selected fields and then get data
    // console.log("current selections: ", currentSelectionsLayout.qSelectionObject.qSelections);
    // console.log("current selection field: ", currentSelectionsLayout.qSelectionObject.qSelections[0]?.qField);

    // //Get first field as example and create listbox for getting data.
    // //In normal scenario, you should loop over all selected fields and create listbox for each field
    // if(currentSelectionsLayout.qSelectionObject.qSelections[0]?.qField) {
    //     const sessionListboxDef = {
    //         "qInfo": {
    //             "qType": "ListObject"
    //         },
    //         "qListObjectDef": {
    //             "qStateName": "$",
    //             "qLibraryId": "",
    //             "qDef": {
    //                 "qFieldDefs": [
    //                     currentSelectionsLayout.qSelectionObject.qSelections[0].qField
    //                 ],
    //                 "qSortCriterias": [
    //                     {
    //                         "qSortByState": 1
    //                     }
    //                 ]
    //             }
    //         }
    //     }
    //     const sessionListbox = await app.createSessionObject(sessionListboxDef);
    //     const sessionListboxLayout = await sessionListbox.getLayout();
    //     //Read listbox height
    //     const sessionListboxHeight = sessionListboxLayout.qListObject.qSize.qcy
    //     //Same as mentioned for filterpane, we need height for understanding how many values we have. Use this for pagination when need to get all data
    //     const sessionListboxDataDef = {
    //         "qPath": "/qListObjectDef",
    //         "qPages": [
    //             {
    //                 "qLeft": 0,
    //                 "qTop": 0,
    //                 "qWidth": 1,
    //                 "qHeight": 20
    //             }
    //         ]
    //     }
    //     //Method for reading data from field
    //     const sessionListboxData = await sessionListbox.getListObjectData(sessionListboxDataDef);
    //     //Showing values.
    //     //Here you will find, for each value, the current selection state. For selected value you will find qState: "S".
    //     //Use these selected values for creating your url with selections.
    //     console.log(sessionListboxData[0].qMatrix)
    //     //When you have finished with listbox data, destroy it!!!
    //     await app.destroySessionObject(sessionListbox.id);
    // }

    // 2. Getting ODAG session app and connect to it for download dynamic view table date
    // const auditsParams = {
    //     eventTime : '2025-02-20T13:53:37.00Z/2025-02-20T15:53:47.99Z',
    //     eventType: 'com.qlik.v1.app.reload.finished',
    //     sort: '-eventTime',
    //     limit: 1
    // }
    // const audits = await window.qlikApi.audits.getAudits(auditsParams);
    // console.log("audits: ", audits);

    // const sessionAppId = audits.data.data[0].extensions.actor.sub = 'odag' ? audits.data.data[0].extensions.topLevelResourceId : null;

    // if(sessionAppId) {
    //     const appSession = window.qlikApi.qix.openAppSession(sessionAppId);
    //     // //Tracing websocket events
    //     const events = appSession.onWebSocketEvent((event) => {
    //         console.log("event: ", event);
    //     });
    //     // get the "qix document (qlik app)"
    //     const app = await appSession.getDoc();
    //     console.log("app: ", app);
    //     // get table inside dynamic view container
    //     // I should open the selection app and then get container, we skip for the moment.
    //     // const dynamicViewContainer = await app.getObject("PJavkSD");
    //     // const dynamicViewContainerLayout = await dynamicViewContainer.getLayout();
    //     // console.log("dynamicViewContainerLayout: ", dynamicViewContainerLayout);
    //     // const dynamicViewTable = await app.getObject(dynamicViewContainerLayout.children[0].externalReference.masterId);
    //     const dynamicViewTable = await app.getObject("5022dd2b-8903-47d8-b5be-5ce2aaf178dd");
    //     const dynamicViewTableLayout = await dynamicViewTable.getLayout();
    //     const dynamicViewTableData = await dynamicViewTable.getHyperCubeData('/qHyperCubeDef', [{qTop: 0, qLeft: 0, qWidth: 10, qHeight: 10}]);
    //     console.log("dynamicViewTableData: ", dynamicViewTableData);

    // }



    //Test on vis with viewState
    // const element = document.getElementById("barChart");
    // const refApi = await element.getRefApi();
    // const doc = await refApi.getDoc();
    // doc.on('changed', () => console.log('Document was restored'));
    // const chartRefApi = await refApi.getChartRefApi()
    // const viewState = await chartRefApi.getViewState();
    // if (viewState && typeof viewState.getViewState === 'function') {
    //     viewstate = viewState.getViewState();
    //     console.log("viewstate: ",viewstate);
    // }


    //Testing retrieving Qlik cloud resource with OAuth impersonation token
    //  !!!!!!!!!!!!!! Does not work, try with JWT below this part !!!!!!!!!!!!!!!!!!!!!!!
    // const manualToken = 'eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCIsImtpZCI6IlRLODJqTDAwX2tYbFgtWWNITWJ0N1I5bXJyUktnaHN0M2hnVVloLUVGMXcifQ.eyJzdWJUeXBlIjoidXNlciIsInB1cnBvc2UiOiJhY2Nlc3NUb2tlbiIsImp0aSI6IlphN0NHRXp3MEVZR2U2QjluZW9FeEd0SWw0NGZCVVpsIiwiaWF0IjoxNzczMzI2NzEyLCJleHAiOjE3NzMzNDgzMTIsImF1ZCI6Imh0dHBzOi8vY3ZoLmV1LnFsaWtjbG91ZC5jb20iLCJpc3MiOiJxbGlrLmFwaSJ9.6HI6-HWru_DVcE8EQ5Xo3qpIyBR-W-OXyABMF9I9fAZODO5gr-wr2ZHKWh5LGaFG-luUbRTILPg-G5p1H2ffpsJqNmc_BZLexWfeAKSZLWvxratkOfkLEVOYUQAS6GOI';

    // const response = await fetch(`https://${config.host}/api/v1/items`, {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer ${manualToken}`,
    //     },
    //     // Required: allows the browser to store the session cookie returned by Qlik
    //     credentials: 'include'
    // });

    // JWT login
    // const manuelJwtToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkYWQxNmJjLTI0ZDktNDViYS1iOWVlLTgzYTBlNDkyYWQ5ZCJ9.eyJqdGkiOiJkMzVlMGIwNTI0MmQzM2I3YWFlNzk4NmJlZjdiMWU1NCIsInN1YiI6Im9hdXRoX2dlbl90ZXN0dXNlcjJAdGVzdC5jb20iLCJzdWJUeXBlIjoidXNlciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJlbWFpbCI6InRlc3R1c2VyMkB0ZXN0LmNvbSIsIm5hbWUiOiJvYXV0aF9nZW5fdGVzdHVzZXIyQHRlc3QuY29tIiwiaWF0IjoxNzczMzMxMjU4LCJuYmYiOjE3NzMzMzEyNTgsImV4cCI6MTc3MzMzMTMxOCwiYXVkIjoicWxpay5hcGkvbG9naW4vand0LXNlc3Npb24iLCJpc3MiOiJjdmguZXUucWxpa2Nsb3VkLmNvbSJ9.hvyx-TYWO7O_Eu4Ec3YhSI822NfprAR5yHSUYkqilpxaNEyZ9ewxxXCTGYdVnNTwoqQXx65a-8LbPQuATKg7sBI9hq7hgRmxdMsZG2MFlvjsRdqAiI53IPXnSN1tXXxz_-kI05PxUWWDzvfqRxqLdLstGg-Nk5VujdDQX44c80-UgG2cBwPIDG7p8f5z9Z6vGYjNnIjjKh1glVp66aK2Uts4NrhWJ7nBOzbDYsg0UTvVqYpE2s-mIWcd7rky-3GcAnisR2-tMSJqrj1CGmOQ4h_5uv6ReN2yxRd7wKTKfUgq0roIkHo6C6KkK_b05JoYHVzELPWCPmIrbK-8zkn33wW_s-gqMEeQ89ZLvDRsgJDRz6aANljRoRIHxLNXHLl6OTAys6XSSC1E3MhV-pRGJcukzK69J3AdfmVnyRf9FGHpyLrMOL3XkfHzN6_V69GlXIMxctaNDZirsA2PFNNZ_El1NJkO0W1J0jkMhjhoAha0hJjkETldYA27KL7W10ERUoDUztDmxytWIXIAWRQPW0UUx4KazOQGMbAkQ_7z1xAdqxxDZsZ5VH06n9cMeakqpqC4nr-b--_l_Y86skwCPzkSfCyAKO9pniiqgfl24fBGxSGuNNTpdzjpAiD0uLXzLJ3Vn_aaluREndkQMhv2rTF4etFc_qZBC4VRsxNA_K4';
    // const qlikWebIntegrationId = "rC2fFlQmB8_mN-qNXwcmfnKnsxOqmTo9";

    // const response = await fetch(`https://${config.host}/login/jwt-session?qlik-web-integration-id=${qlikWebIntegrationId}`, {
    //     method: "POST",
    //     credentials: 'include', // Important: allows the browser to store the session cookie returned by Qlik
    //     headers: {
    //         "content-type": "application/json",
    //         Authorization: `Bearer ${manuelJwtToken}`,
    //         "qlik-web-integration-id": qlikWebIntegrationId
    //     },
    // });

    // // Qlik sets a session cookie on its domain after a successful /login call.
    
    // if (response.ok) {
    //     const link = document.createElement('a');
    //     link.href = `https://${config.host}/hub`;
    //     link.textContent = 'Go to Qlik Cloud Hub';
    //     document.body.appendChild(link);

    //     // Open the hub in a new tab — the browser sends the session cookie automatically
    //     window.open(`https://${config.host}`, '_blank');
    // }
    // else {
    //     console.error('Failed to authenticate with the provided token. Status:', response.status, response.statusText);
    // }
    

    

}());

// console.log("start");

async function readTable() {
    const element = document.getElementById("myTable");
    const refApi = await element.getRefApi();
    const qlikApp = await refApi.getDoc();
    //clear selections
    await qlikApp.clearAll();
    console.log("refApi", refApi);
    const obj = await refApi.getObject();
    console.log("obj",obj);
}

async function changeViz() {
    //Change viz removing and adding qlik embed tag
    // const element = document.getElementById("qlikChart");
    // //Delete qlik embed viz
    // element.remove()
    // //Append a new one
    // const container = document.getElementById("container");
    // const qlikEmbedViz = `<qlik-embed
    //                         ui="analytics/sheet"
    //                         app-id="c0b1c44e-1735-4eb1-89a5-36dde6247405"
    //                         object-id="jEtEvB"
    //                         id="qlikChart"
    //                         >
    //                     </qlik-embed>`
    // container.insertAdjacentHTML('beforeend', qlikEmbedViz)

    //Change viz changin object prop
    const element = document.getElementById("qlikChart");
    element.setAttribute("object-id", "jEtEvB")
}

