window.XGD = (rawdata) => {
/*
XGD({
	Nodes: [{"key": string, "label": string, "position": {x: real, y: real}},
			"group": string 0:1, "symbol": url 0:1,
			"color": int32 0:1, "classes": [string ..] 0:n,
			"description": string 0:1, "comment": string 0:1} ..],
	Edges: [{"source": string, "target": string,
			"label": string, "color": int32 0:1, "classes": [string ..] 0:n,
			"description": string 0:1, "comment": string 0:1} ..]
	// predefined classes in Edge: bidirectional, dotted, future, dashed, manual
});
*/

    var Nodes = window.Nodes = {};
    var Edges = window.Edges = {};
    
    /***************************************************************************************************
        Nodes: define nodes
    ***************************************************************************************************/
    
    class Node extends Object {
        constructor() {
            super();
    
            this.position = {x:Math.random()*.70+.15,y:Math.random()*.70+.15};
    
            if (arguments.length==1) {
                if (typeof arguments[0] == "object") {
                    Object.keys(arguments[0]).forEach((k) => {
                        if (k=="group") {
                            if (!Nodes[arguments[0][k]]) {
                                Nodes[arguments[0][k]] = new Nodes(arguments[0][k]);
                            }
                            this[k] = Nodes[arguments[0][k]];
                        } else if (k!="Edges") {
                            this[k] = JSON.parse(JSON.stringify(arguments[0][k]));
                        }
                    });
                    if (!!arguments[0].Edges) {
                        arguments[0].Edges.forEach((df) => {
                            if (!!df.target) {
                                df.source = this;
                            } else {
                                df.target = this;
                            }
                            var ed = new Edge(df);
                            Edges[ed.source.key+'-'+ed.target.key] = ed;
                        });
                    }
                } else if (typeof arguments[0] == "string") {
                    this.key = arguments[0];
                } else {
                    throw 'Node.constructor: Parameter type unknown "' + (typeof arguments[0]) + '"';
                }
            } else {
                throw 'Node.constructor: Parameter structure unknown ' + JSON.stringify(arguments);
            }
            if (!this.key) {
                throw 'Node.constructor: Key missing';
            }
        }
        get isSourceOf() {
            var retval = {};
            Object.keys(Edges).forEach((key) => {
                var df = Edges[key];
                if (df.source === this) {
                    if (Object.keys(retval).includes(df.target.key) == false) {
                        retval[df.target.key] = df;
                    }
                }
            });
            return retval;
        }
        get isTargetOf() {
            var retval = {};
            Object.keys(Edges).forEach((key) => {
                var df = Edges[key];
                if (df.target === this) {
                    if (Object.keys(retval).includes(df.source.key) == false) {
                        retval[df.source.key] = df;
                    }
                }
            });
            return retval;
        }
    }
    
    /***************************************************************************************************
        Edges: define edges
    ***************************************************************************************************/
        
    class Edge extends Object {
        constructor() {
            super();
    
            if (arguments.length==1) {
                if (typeof arguments[0] == "object") {
                    Object.keys(arguments[0]).forEach((k) => {
                        if ((k=="source") || (k=="target")) {
                            if (arguments[0][k].constructor.name == "Node") {
                                this[k] = arguments[0][k];
                            } else if (typeof arguments[0][k] == "object") {
                                this[k] = new Node(arguments[0][k]);
                                Nodes[this[k].key] = this[k];
                            } else {
                                this[k] = Nodes[arguments[0][k]];
                            }
                        } else if (k!="key") {
                            this[k] = JSON.parse(JSON.stringify(arguments[0][k]));
                        }
                    });
                } else if (typeof arguments[0] == "string") {
                    this.source = Nodes[key.split('-')[0]];
                    this.target = Nodes[key.split('-')[1]];
                } else {
                    throw 'Edge.constructor: Parameter type unknown "' + (typeof arguments[0]) + '"';
                }
            } else if (arguments.length == 2) {
                var source = arguments[0];
                var target = arguments[1];
                
                if (typeof source == "object") {
                    this.source = source;
                } else {
                    this.source = Nodes[source];
                }
                if (typeof target == "object") {
                    this.target = target;
                } else {
                    this.target = Nodes[target];
                }
            } else {
                throw 'Edge.constructor: Parameter structure unknown ' + JSON.stringify(arguments);
            }
            
            //if (!this.key) {
            //	throw 'Edge.constructor: Key missing';
            //}
            
            if (!this.source || !this.target) {
                throw "Edge Definition without source or target: " + JSON.stringify(arguments);
            }
            
            if ((typeof this.source != 'object') || (typeof this.target != 'object')) {
                throw "Edge Definition with wrong types: " + JSON.stringify(arguments);
            }
        }
    
        get key() {
            return this.source.key + '-' + this.target.key;
        }
    
        set key(value) {
            this.source = Nodes[value.split('-')[0]];
            this.target = Nodes[value.split('-')[1]];
        }
        
    }
    
    /***************************************************************************************************
        Load data
    ***************************************************************************************************/
    
    rawdata.Nodes.forEach((nd) => Nodes[nd.key] = new Node(nd));
    
    rawdata.Edges.forEach((df) => Edges[df.source+'-'+df.target] = new Edge(df));
    
    /***************************************************************************************************
        Beautify keys to avoid errors in cytoscape if needed
    ***************************************************************************************************/
    
    Object.keys(Nodes).forEach((keyold) => {
        keynew=keyold.replace(/[^a-z0-9]+/gi, "_");
        if (keynew!=keyold) {
            var app = Nodes[keyold];
            app.label=app.label||keyold;
            app.key=keynew;
            Nodes[keynew] = app;
            delete Nodes[keyold];
        }
    });
    Object.keys(Edges).forEach((keyold) => {
        var df = Edges[keyold];
        keynew=df.key;
        if (keynew!=keyold) {
            Edges[keynew] = df;
            delete Edges[keyold];
        }
    });
    
    console.log(Nodes);
    console.log(Edges);
    
    /***************************************************************************************************
        Cytoscape: display graph
    ***************************************************************************************************/
    
    var container = document.getElementById('cy');
    var containerWidth = 1000;
    var containerHeight = 600;
    
    var resizeContainer = (ev) => {
        containerWidth = window.innerWidth*.78;
        containerHeight = window.innerHeight*.93;
        if (!!cy) {
            Object.keys(Nodes).forEach((key) => {
                var app = Nodes[key];
                if (!!app.position) {
                    cy.$('#'+key).position({
                        x: app.position.x*containerWidth,
                        y: app.position.y*containerHeight
                    });
                };
            });
        }
    };
    
    resizeContainer();
    window.addEventListener("resize", resizeContainer);
    
    var cy = window.cy = cytoscape({ // https://js.cytoscape.org/
        container: container,
    
        elements: {
            nodes: 
                Object.keys(Nodes).map((key) => {
                var app = Nodes[key];
                return { 
                    data: {
                        id: key,
                        parent: (app.group||{}).key,
                        symbol: app.symbol,
                        color: app.color,
                        label: app.label||key,
                        iri: app.iri
                    },
                    position: {
                        x: app.position.x*containerWidth,
                        y: app.position.y*containerHeight
                    },
                    classes: (app.classes||[]).concat(["Node"])
                }}),
            edges:
                Object.keys(Edges).map((key) => {
                var df = Edges[key];
                return { 
                    data: {
                        id: key,
                        source: df.source.key,
                        target: df.target.key,
                        color: df.color,
                        label: df.label
                    },
                    classes: (df.classes||[]).concat(["Edge"])
                }})
        },
    
        layout: {
            //name: 'cose'
            //name: 'cola'
            name: 'preset'
        },
    
        style: [
            {
                "selector": "node",
                "style": {
                    "width": "10px",
                    "height": "10px",
                    "label": "data(label)",
                    "font-size": "10pt"
                }
            },
            {
                "selector": "node:parent",
                "style": {
                    "background-color": "lightgrey",
                    "border-color": "grey",
                    "font-size": "12pt"
                }
            },
            {
                "selector": "node.internallink",
                "style": {
                    "shape": "cut-rectangle",
                    "background-color": "lightgrey",
                    "border-color": "green",
                    "border-style": "solid",
                    "border-width": "2px"
                }
            },
            {
                "selector": "node[iri^='http']",
                "style": {
                    "shape": "star",
                    "background-color": "lightgrey",
                    "border-color": "grey",
                    "border-style": "solid",
                    "border-width": "2px"
                }
            },
            {
                "selector": "node[symbol]",
                "style": {
                    "background-color": "transparent",
                    "background-image": "data(symbol)",
                    "background-fit": "contain"
                }
            },
            {
                "selector": "node[color]",
                "style": {
                    "width": "6px",
                    "height": "6px",
                    "background-color": "data(color)"
                }
            },
            {
                "selector": "edge",
                "style": {
                    "width": "1px",
                    "curve-style": "bezier",
                    "opacity": "0.8",
                    "line-color": "#777",
                    "overlay-padding": "3px",
                    "target-arrow-color": "#777",
                    "target-arrow-shape": "triangle",
                    "target-arrow-fill": "filled",
                    "arrow-scale": "1",
                    "source-distance-from-node": "5px",
                    "target-distance-from-node": "5px"
                }
            },
            {
                "selector": "edge.Data-Flow",
                "style": {
                    "opacity": "1"
                }
            },
            {
                "selector": "edge[color]",
                "style": {
                    "line-color": "data(color)",
                    "target-arrow-color": "data(color)"
                }
            },
            {
                "selector": "edge[label]",
                "style": {
                    "label": "data(label)",
                    "text-rotation": "autorotate",
                    "text-margin-x": "0px",
                    "text-margin-y": "0px",
                    "text-halign": "left",
                    "font-size": "8pt",
                    "text-margin-y": "-5"
                }
            },
            {
                "selector": "edge.bidirectional",
                "style": {
                    "source-arrow-color": "#777",
                    "source-arrow-shape": "triangle",
                    "source-arrow-fill": "filled"
                }
            },
            {
                "selector": "edge[color].bidirectional",
                "style": {
                    "source-arrow-color": "data(color)"
                }
            },
            {
                "selector": "edge.dotted, edge.future",
                "style": {
                    "line-style": "dashed",
                    "line-dash-pattern": [3, 6]
                }
            },
            {
                "selector": "edge.dashed, edge.manual",
                "style": {
                    "line-style": "dashed",
                    "line-dash-pattern": [6, 3]
                }
            }
        ],
    
        // initial viewport state:
        //zoom: 1,
        //pan: { x: 0, y: 0 },
    
        // interaction options:
        //minZoom: 1e-50,
        //maxZoom: 1e50,
        zoomingEnabled: true,
        userZoomingEnabled: true,
        wheelSensitivity: 0.1,
        panningEnabled: true,
        userPanningEnabled: true,
        //boxSelectionEnabled: false,
        //selectionType: 'single',
        //touchTapThreshold: 8,
        //desktopTapThreshold: 4,
        //autolock: false,
        //autoungrabify: false,
        //autounselectify: false,
    
        // rendering options:
        //headless: false,
        //styleEnabled: true,
        //hideEdgesOnViewport: false,
        //textureOnViewport: false,
        //motionBlur: false,
        //motionBlurOpacity: 0.2,
        //pixelRatio: 'auto'
    })
    .on("position","node.Node",(ev) => {
        var pos = ev.target.position();
        Nodes[ev.target.data().id].position = {
            x: pos.x/containerWidth,
            y: pos.y/containerHeight
        };
    })
    .on("position","node.Group",(ev) => {
        var pos = ev.target.position();
        Groups[ev.target.data().id].position = {
            x: pos.x/containerWidth,
            y: pos.y/containerHeight
        };
    })
    .on("cxttap", "node[iri]",(ev) => { // right-click
        document.location = ev.target.data().iri;
    })
            
    /***************************************************************************************************
        Vue: data-bound markup
    ***************************************************************************************************/
    
    var data = {
            Nodes: Nodes,
            Edges: Edges,
            SelectedNode: undefined,
            SelectedEdge: undefined,
            EditMode: false
        };
    
    var vue = window.Vue = new Vue({
        el: "#vuecontainer",
        data: data,
        computed: {
            ckys() {return Cookies.get()},
            JSESSION() {return Cookies.get('JSESSION')},
            windowInnerHeight() {
                return window.innerHeight;
            },
            windowInnerWidth() {
                return window.innerWidth;
            }
        },
        methods: {
            nodeAttributeChanged: (ev) => {
                if (!!ev.target) {
                    var nodeKey = ev.target.id.split('.')[0];
                    var attributeKey = ev.target.id.split('.')[1];
                    var oldValue = ev.target._value;
                    var newValue = ev.target.value;
                    if (newValue=='') {
                        delete this.Nodes[nodeKey][attributeKey];
                        cy.nodes('#'+nodeKey).data(attributeKey,null);
                    } else {
                        this.Nodes[nodeKey][attributeKey] = newValue;
                        cy.nodes('#'+nodeKey).data(attributeKey,newValue);
                    }
                    //console.log(ev.target.id+':'+ev.target._value+' to '+ev.target.value);
                }
            },
            newNodeAttribute: (ev) => {
                if (!!ev.target) {
                    //console.log(ev.target.id+'.'+ev.target.value);
                    var nodeKey = ev.target.id.split('.')[0];
                    var attributeKey = ev.target.value;
                    ev.target.value = '';
                    this.Nodes[nodeKey][attributeKey] = '';
                    cy.nodes('#'+nodeKey).data(attributeKey,'');
                    this.SelectedNode = this.Nodes[nodeKey];
                }
            },

            edgeAttributeChanged: (ev) => {
                if (!!ev.target) {
                    var edgeKey = ev.target.id.split('.')[0];
                    var attributeKey = ev.target.id.split('.')[1];
                    var oldValue = ev.target._value;
                    var newValue = ev.target.value;
                    if (newValue=='') {
                        delete this.Edges[edgeKey][attributeKey];
                        cy.edges('#'+edgeKey).data(attributeKey,null);
                    } else {
                        this.Edges[edgeKey][attributeKey] = newValue;
                        cy.edges('#'+edgeKey).data(attributeKey,newValue);
                    }
                    //console.log(ev.target.id+':'+ev.target._value+' to '+ev.target.value);
                }
            },
            newEdgeAttribute: (ev) => {
                if (!!ev.target) {
                    //console.log(ev.target.id+'.'+ev.target.value);
                    var edgeKey = ev.target.id.split('.')[0];
                    var attributeKey = ev.target.value;
                    ev.target.value = '';
                    this.Edges[edgeKey][attributeKey] = '';
                    cy.edges('#'+edgeKey).data(attributeKey,'');
                    this.SelectedEdge = this.Edges[edgeKey];
                }
            },

            rawdata() { return {
                
                Nodes: 
                    Object.keys(this.Nodes).map((key) => {
                        var app = Object.assign({}, this.Nodes[key]);
                        return app; // including unknown attributes
                    }),
    
                Edges: 
                    Object.keys(this.Edges).map((key) => {
                        var df = Object.assign({}, this.Edges[key]);
                        df.source = df.source.key;
                        df.target = df.target.key;
                        return df; // including unknown attributes
                    })
                };
            },
            rawdatahref() {
                return 'data:application/json,XGD('+encodeURIComponent(JSON.stringify(this.rawdata(),null,'\t'))+');'
            }
        }
    });
    
    
    // Interaction cy - Vue
    
    cy.on("select tapstart mousedown","node.Node",(ev) => {
        data.SelectedGroup = undefined;
        data.SelectedNode = Nodes[ev.target.data().id];
        data.SelectedEdge = undefined;
    });
    cy.on("select tapstart mousedown","edge.Edge",(ev) => {
        data.SelectedGroup = undefined;
        data.SelectedNode = undefined;
        data.SelectedEdge = Edges[ev.target.data().source+'-'+ev.target.data().target];
    });
    cy.on("select tapstart mousedown","#cy",(ev) => {
        data.SelectedGroup = undefined;
        data.SelectedNode = undefined;
        data.SelectedEdge = undefined;
    });
    cy.on("unselect","*",(ev) => {
        data.SelectedGroup = undefined;
        data.SelectedNode = undefined;
        data.SelectedEdge = undefined;
    });
    
    }; // end XGD