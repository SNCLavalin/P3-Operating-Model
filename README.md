# P3-Operating-Model
P3 Operating Model - Dynamic Workflow

P3 Operating Model - Dynamic Workflow


-----------------------------------------------------
GitHub Access

username: SNCLavalin
password: SNClavalin2017
recovery e-mail: p3operatingmodel@gmail.com

Gmail Access

username: p3operatingmodel@gmail.com
password: SNClavalin2017


-----------------------------------------------------

Data Repository : https://github.com/SNCLavalin/P3-Operating-Model

Gist (Back-End) : https://gist.github.com/SNCLavalin/162e57c94a31658d4a8139d314f452ae

Web page (Front-End): http://bl.ocks.org/SNCLavalin/raw/162e57c94a31658d4a8139d314f452ae/


-----------------------------------------------------

Project Description

Goal is to create a complete mapping of a typical P3 process and to be able to present this mapping in a visually 
interesting way both internally and to external partners.
A macro enabled excel file exists for back-end users to easily modify the underlying data.

-----------------------------------------------------

INSTRUCTIONS

**To modify the html/javascript/CSS of the webpage**

- Sign in to the SNC Lavalin Github profile (username and passowrd above)
- Go to the P3 Operating Model Gist page (https://gist.github.com/SNCLavalin/162e57c94a31658d4a8139d314f452ae)
- Click on "Edit" in the top right section of the screen to modify code
- Save changes


**To View modified web page**


- Go to http://bl.ocks.org/SNCLavalin/raw/162e57c94a31658d4a8139d314f452ae/


**To modify the csv/data points**

- Go to the P3 Operating Model Repository (https://github.com/SNCLavalin/P3-Operating-Model)
- Download "P3 -CSV Generation Tool 0.1.xlsm" to your computer

This file is a macro enabled workbook that contains the underlying data for the P3 Model. It contains the following fields:

* name		Unique index for each line. Each level of the tree structure is indicated by a period (".") in the index.(e.g Phases-> I- Pre-RFQ -> Commercial -> Strategic Pursuit Commitee has index 1.1.04.01.00.00.00.00 )
* parent	Index of parent node. Used to indicate the level directly above the level of the current node.
* LABEL		Name/Label of the node in the tree
* DESCRIPTION	Can type a more detailed description of the node here to display when hovering in web page.
* LEAD		Name of Lead division, will display when hovering in web page (double click to open form)
* PARTICIPANTS	Name of participants seperated by semicolon, will display when hovering in web page (double click to open form)
* LINE		Color for the lines of this node (http://bl.ocks.org/d3noob/raw/11313583/)
* TYPE		Type of data (Action/Decision, Division, Document Preparation, Header, Meeting, Milestone, Process, Review, Root, Section) (drop down menu in cell)
* ICON		Address of image file that will replace the default circle for the node
* LINK		Hyperlink to documentation for process (put javascript:void(0) by default if there is no file. Otherwise write down the hyperlink e.g http://infozone.snclavalin.com/en/files/create-wbs-oracle_en.pdf )
* HYPERLINK	Label for the Hyperlink (By default put "_", otherwise write a label like "Document" or "Process" or "Global HSSE Policy 2018")

**The rest are just some additional data used for formatting**
	
* WIDTH
* HEIGHT
* LINK_TYPE
* LEN
* POSITION2
* POSITION1

**To upload the modified data points**

 - Click on the "Upload" button.The .csv will be saved by default to "C:\Users\Public\Documents\data\treeData.csv" (You can change this in the VBA code if you wish)
 - Go to the P3 Operating Model Gist (https://gist.github.com/SNCLavalin/162e57c94a31658d4a8139d314f452ae)
 - Click on Edit, navigate to the treeData.csv section and copy paste the data from the "C:\Users\Public\Documents\data\treeData.csv" file that was just created
 - Save changes


