
(async function myFunc () {
    console.log("date picker element: ",document.querySelector('.qlik-daterangepicker'));
    // const element = document.getElementById("myTable");
    // const refApi = await element.getRefApi();
    // const obj = await refApi.getObject();
    // let objLayout = await obj.getLayout();

    // Build qlik/api config
    const config = {
        authType: "oauth2",
        host: "cvh.eu.qlikcloud.com",
        clientId: "bf494408325438d08169cb6677f8ec29",
        redirectUri: "https://localhost:8080/oauth_callback.html",
        accessTokenStorage: "session"
    };

    window.qlikApi.auth.setDefaultHostConfig(config);

    const { data: mySpaces } = await window.qlikApi.spaces.getSpaces();
    console.log("mySpaces: ", mySpaces);

    // open new app session
    const appSession = window.qlikApi.qix.openAppSession("633bcf3c-c309-4bc1-9fc3-969bc41aa869");
    // get the "qix document (qlik app)"
    const app = await appSession.getDoc();
    // get a variable
    // const myVar = await app.getVariableByName('vShowArch');   // change with your variable name
    // // show current value
    // const currentValue = await myVar.getLayout();
    // console.log("current var value: ", currentValue.qNum);
    // // set variable value (number)
    // await myVar.setNumValue(1);                               // change with your variable value. If it is a string, change method to `setStringValue`
    // // show new value
    // const newValue = await myVar.getLayout();
    // console.log("new var value: ", newValue.qNum);
    // //get collections
    // const collections = await window.qlikApi.collections.getCollections();
    // console.log("collections: ", collections);
    
    //1.Get data from existing filterpane
    const filterPane = await app.getObject("CvJ");
    //Get layout
    const filterPaneLayout = await filterPane.getLayout();
    //Get listbox within filter pane. It is an array, loop over it if you have more than once
    const listbox = await app.getObject(filterPaneLayout.qChildList.qItems[0].qInfo.qId);
    
    //2.Get list box data
    //Get listbox layout
    const listboxLayout = await listbox.getLayout();
    //Read listbox height. This allow me to get all data at once (if they are few) or make more calls for retrieving all data.
    const listboxHeight = listboxLayout.qListObject.qSize.qcy
    //We recommend to get more data only when user perform a scroll into your dropdown/select component and you reach end of your current data.
    //E.g. I will get first 200 rows, then when user scroll down and he is close to end of my 200 rows, perform another getListObjectData, and get
    //200 rows for populating my dropdown/select component, and so on...
    //listboxHeight is useful to understand where is my end of data.
    const listboxDataDef = {
		"qPath": "/qListObjectDef",
		"qPages": [
			{
				"qLeft": 0,
				"qTop": 0,          //Use this to move down along data. 0 is first record.
				"qWidth": 1,       // This is number of column. List box should always have 1 column. Max is 1,000 cells (width * height)
				"qHeight": 200      //This is the number of rows retrieved from engine. Max is 1,000 cells (width * height)
			}
		]
	};
    const listboxData = await listbox.getListObjectData(listboxDataDef);
    console.log("listboxData: ", listboxData[0].qMatrix);

    //Get current selections
    const currentSelectionsDef = {
        "qInfo": {
            "qType": "CurrentSelection"
        },
        "qSelectionObjectDef": {}
    }
    const currentSelections = await app.createSessionObject(currentSelectionsDef);
    const currentSelectionsLayout = await currentSelections.getLayout();
    //Show current selections. I'm showing an array which will contain current selections information.
    //Here we are looking only for which field is selected, not values. 
    //With current selections object we can see max 6 selected values, then we will se 7 of 20, 11 of 50, and so on
    //For reading selected values we need to create listbox for each selected fields and then get data
    console.log("current selections: ", currentSelectionsLayout.qSelectionObject.qSelections);
    console.log("current selection field: ", currentSelectionsLayout.qSelectionObject.qSelections[0]?.qField);

    //Get first field as example and create listbox for getting data.
    //In normal scenario, you should loop over all selected fields and create listbox for each field
    if(currentSelectionsLayout.qSelectionObject.qSelections[0]?.qField) {
        const sessionListboxDef = {
            "qInfo": {
                "qType": "ListObject"
            },
            "qListObjectDef": {
                "qStateName": "$",
                "qLibraryId": "",
                "qDef": {
                    "qFieldDefs": [
                        currentSelectionsLayout.qSelectionObject.qSelections[0].qField
                    ],
                    "qSortCriterias": [
                        {
                            "qSortByState": 1
                        }
                    ]
                }
            }
        }
        const sessionListbox = await app.createSessionObject(sessionListboxDef);
        const sessionListboxLayout = await sessionListbox.getLayout();
        //Read listbox height
        const sessionListboxHeight = sessionListboxLayout.qListObject.qSize.qcy
        //Same as mentioned for filterpane, we need height for understanding how many values we have. Use this for pagination when need to get all data
        const sessionListboxDataDef = {
            "qPath": "/qListObjectDef",
            "qPages": [
                {
                    "qLeft": 0,
                    "qTop": 0,
                    "qWidth": 1,
                    "qHeight": 20
                }
            ]
        }
        //Method for reading data from field
        const sessionListboxData = await sessionListbox.getListObjectData(sessionListboxDataDef);
        //Showing values.
        //Here you will find, for each value, the current selection state. For selected value you will find qState: "S".
        //Use these selected values for creating your url with selections.
        console.log(sessionListboxData[0].qMatrix)
        //When you have finished with listbox data, destroy it!!!
        await app.destroySessionObject(sessionListbox.id);
    }


    //Test on vis with viewState
    // const element = document.getElementById("qlikTable");
    // const refApi = await element.getRefApi();
    // const chartRefApi = await refApi.getChartRefApi()
    // const viewState = await chartRefApi.getViewState();
    // if (viewState && typeof viewState.getViewState === 'function') {
    //     viewstate = viewState.getViewState();
    //     console.log("viewstate: ",viewstate);
    // }

}());

// console.log("start");

async function readTable() {
    const element = document.getElementById("myTable");
    const refApi = await element.getRefApi();
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

