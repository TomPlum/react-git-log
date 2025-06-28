import{r as y,j as t}from"./iframe-t0IRCVA7.js";import{c,u as z,s as g,S as H,L as P,a as w,G as x}from"./StoryHeader-CQEugIqG.js";import"./index-C-rgPfQW.js";const j="_pagination_3vy2g_1",R="_pages_3vy2g_6",D="_pageButton_3vy2g_13",L="_active_3vy2g_18",B="_chevronButton_3vy2g_21",A="_disabled_3vy2g_27",i={pagination:j,pages:R,pageButton:D,active:L,chevronButton:B,disabled:A},v=({theme:e,pageSize:r,currentPage:n,total:d,onChangePage:l})=>{const a=Math.ceil(d/r),m=Array.from({length:a},(o,u)=>u+1),p=y.useMemo(()=>{const u=Math.floor(5.5);let h=Math.max(1,n-u),s=h+11-1;return s>a&&(s=a,h=Math.max(1,s-11+1)),m.slice(h-1,s)},[n,m,a]);return t.jsxs("div",{className:i.pagination,children:[t.jsx("button",{disabled:n===1,className:c(i.chevronButton,{[i.disabled]:n===1}),onClick:()=>l(1),style:{color:e==="dark"?"white":"black"},children:"<<"}),t.jsx("button",{disabled:n===1,className:c(i.chevronButton,{[i.disabled]:n===1}),onClick:()=>l(n-1),style:{color:e==="dark"?"white":"black"},children:"<"}),t.jsx("div",{className:i.pages,children:p.map(o=>t.jsx("button",{onClick:()=>l(o),className:c(i.pageButton,{[i.active]:o===n}),style:{color:e==="dark"?"white":"black"},title:`Go to page ${o}`,children:o},o))}),t.jsx("button",{className:c(i.chevronButton,{[i.disabled]:n===a}),disabled:n===a,onClick:()=>l(n+1),style:{color:e==="dark"?"white":"black"},children:">"}),t.jsx("button",{className:c(i.chevronButton,{[i.disabled]:n===a}),disabled:n===a,onClick:()=>l(a),style:{color:e==="dark"?"white":"black"},children:">>"})]})};try{v.displayName="Pagination",v.__docgenInfo={description:"",displayName:"Pagination",props:{theme:{defaultValue:null,description:"",name:"theme",required:!0,type:{name:"enum",value:[{value:'"light"'},{value:'"dark"'}]}},currentPage:{defaultValue:null,description:"",name:"currentPage",required:!0,type:{name:"number"}},pageSize:{defaultValue:null,description:"",name:"pageSize",required:!0,type:{name:"number"}},total:{defaultValue:null,description:"",name:"total",required:!0,type:{name:"number"}},onChangePage:{defaultValue:null,description:"",name:"onChangePage",required:!0,type:{name:"(pageNumber: number) => void"}},onChangePageSize:{defaultValue:null,description:"",name:"onChangePageSize",required:!0,type:{name:"(pageSize: number) => void"}}}}}catch{}const S=e=>{const[r,n]=y.useState(1),[d,l]=y.useState(20),{theme:a,loading:m,colours:p,entries:o,branch:u,buildUrls:h,repository:s,headCommitHash:G,backgroundColour:C,handleChangeTheme:N,handleChangeColors:q,handleChangeRepository:_}=z({isServerSidePaginated:!0});return t.jsxs("div",{style:{background:C},className:g.container,children:[t.jsx(H,{theme:a,colours:p,repository:s,onChangeTheme:N,onChangeColours:q,onChangeRepository:_,children:t.jsx("div",{style:{marginTop:20},children:t.jsx(v,{theme:a,pageSize:d,currentPage:r,total:(o==null?void 0:o.length)??0,onChangePage:b=>n(b),onChangePageSize:b=>l(b)})})}),m&&t.jsx("div",{className:g.loading,children:t.jsx(P,{theme:a})}),!m&&o&&t.jsxs(w,{...e,theme:a,entries:o.slice(d*(r-1),d*r),branchName:u,colours:p.colors,headCommitHash:G,classes:{containerStyles:{background:C},containerClass:g.gitLogContainer},indexStatus:{added:e.indexStatusFilesAdded,modified:e.indexStatusFilesModified,deleted:e.indexStatusFilesDeleted},urls:h,children:[e.renderStrategy==="html-grid"&&t.jsx(x.GraphHTMLGrid,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize,showCommitNodeHashes:e.showCommitNodeHashes,showCommitNodeTooltips:e.showCommitNodeTooltips}),e.renderStrategy==="canvas"&&t.jsx(x.GraphCanvas2D,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize}),e.showTable&&t.jsx(w.Table,{className:g.table,timestampFormat:e.timestampFormat})]})]})};try{S.displayName="GitLogPagedDemo",S.__docgenInfo={description:"",displayName:"GitLogPagedDemo",props:{showTable:{defaultValue:null,description:"",name:"showTable",required:!0,type:{name:"boolean"}},showCommitNodeHashes:{defaultValue:null,description:`Whether to show the commit hash
to the side of the node in the graph.`,name:"showCommitNodeHashes",required:!0,type:{name:"boolean"}},renderStrategy:{defaultValue:null,description:"",name:"renderStrategy",required:!0,type:{name:"enum",value:[{value:'"html-grid"'},{value:'"canvas"'}]}},branchName:{defaultValue:null,description:`The name of the branch in which the Git log
entries belong to.`,name:"branchName",required:!0,type:{name:"string"}},headCommitHash:{defaultValue:null,description:`The SHA1 hash of the HEAD commit of
the {@link GitLogProps.currentBranchcurrentBranch} that is checked
out in the repository.

Only needs to be passed in if you are
passing in a subset of the Git log
{@link entries} due to managing your
own pagination.
@see {paging} for more info.`,name:"headCommitHash",required:!0,type:{name:"string"}},entries:{defaultValue:null,description:`The git log entries to visualise
on the graph.`,name:"entries",required:!0,type:{name:"GitLogEntry[]"}},filteredCommits:{defaultValue:null,description:`A list of SHA1 commit hashes that belong
to commits that would normally be present
on in the log but have been filtered out
due to something like a search.

The log, and any relevant subcomponents,
will filter these commits out, so they no
longer render, but will change their styling
to make it clear that commits are missing.`,name:"filteredCommits",required:!1,type:{name:"string[] | undefined"}},theme:{defaultValue:null,description:`The variant of the default colour
theme to apply to the log.`,name:"theme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"light"'},{value:'"dark"'}]}},colours:{defaultValue:null,description:`An array of colours used to colour the
log elements such as the graph.

One colour will be used for each column
in the graph. The number of columns is
equal to the maximum number of concurrent
active branches in the log.

If the number of colours passed is not enough,
then the columns will loop back round and start
taking from the beginning of the array again.`,name:"colours",required:!1,type:{name:"string[] | ThemeColours | undefined"}},showHeaders:{defaultValue:null,description:`Whether to show the names of the elements
at the top of the component such as "Graph"
or "Commit message" etc.`,name:"showHeaders",required:!1,type:{name:"boolean | undefined"}},rowSpacing:{defaultValue:{value:"0"},description:`The spacing between the rows of the log.
Affects all elements across the branches,
graph, and table.`,name:"rowSpacing",required:!1,type:{name:"number | undefined"}},urls:{defaultValue:null,description:`A function that returns build URI strings
to link out to the remote repository on
the external Git provider.`,name:"urls",required:!1,type:{name:"GitLogUrlBuilder | undefined"}},defaultGraphWidth:{defaultValue:{value:"300"},description:`The default width of the graph in pixels.

Can be changed dynamically if {@link GraphPropsCommon.enableResize enableResize}
is true.`,name:"defaultGraphWidth",required:!1,type:{name:"number | undefined"}},indexStatus:{defaultValue:null,description:`The status of changed files in the
Git index.`,name:"indexStatus",required:!1,type:{name:"GitLogIndexStatus | undefined"}},showGitIndex:{defaultValue:null,description:`Whether to show the Git index
"pseudo-commit" entry at the top
of the log above the HEAD commit.

Represents the local working directory
and Git index of the currently checked-out
branch. Can optionally show metadata of
file statuses via {@link indexStatus}`,name:"showGitIndex",required:!1,type:{name:"boolean | undefined"}},onSelectCommit:{defaultValue:null,description:`A callback function invoked when a commit
is selected from the graph or log table.

The commit is undefined if it has been
unselected.
@param commit Details of the selected commit.`,name:"onSelectCommit",required:!1,type:{name:"((commit?: Commit | undefined) => void) | undefined"}},onPreviewCommit:{defaultValue:null,description:`A callback function invoked when a commit
is previewed from the graph or log table.

The commit is undefined if a commit stops
being previewed (e.g. the user has stopped
hovering their mouse over a row).
@param commit Details of the previewed commit.`,name:"onPreviewCommit",required:!1,type:{name:"((commit?: Commit | undefined) => void) | undefined"}},enableSelectedCommitStyling:{defaultValue:{value:"true"},description:`Enables the row styling across the log
elements when a commit is selected.`,name:"enableSelectedCommitStyling",required:!1,type:{name:"boolean | undefined"}},enablePreviewedCommitStyling:{defaultValue:{value:"true"},description:`Enables the row styling across the log
elements when a commit is being previewed.`,name:"enablePreviewedCommitStyling",required:!1,type:{name:"boolean | undefined"}},classes:{defaultValue:null,description:`CSS Classes to pass to various underlying
elements for custom styling.`,name:"classes",required:!1,type:{name:"GitLogStylingProps | undefined"}},showCommitNodeTooltips:{defaultValue:null,description:`Whether to show tooltips when hovering
over a commit node in the graph.`,name:"showCommitNodeTooltips",required:!1,type:{name:"boolean | undefined"}},node:{defaultValue:null,description:`Overrides the commit nodes with a
custom implementation.`,name:"node",required:!1,type:{name:"CustomCommitNode | undefined"}},highlightedBackgroundHeight:{defaultValue:null,description:`The height, in pixels, of the background
colour of a row that is being previewed
or has been selected.

You probably only want to set this if
you have passed a custom row implementation
into the table component that has a different
height from the default.`,name:"highlightedBackgroundHeight",required:!1,type:{name:"number | undefined"}},nodeTheme:{defaultValue:null,description:`The theme to apply the commit node
elements in the graph.`,name:"nodeTheme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"plain"'}]}},enableResize:{defaultValue:{value:"false"},description:`Enables the graphs horizontal width
to be resized.`,name:"enableResize",required:!1,type:{name:"boolean | undefined"}},nodeSize:{defaultValue:null,description:`The diameter, in pixels, of the
commit node elements rendered on
the graph.`,name:"nodeSize",required:!1,type:{name:"number | undefined"}},orientation:{defaultValue:null,description:`The orientation of the graph.

Normal mode draws the graph from
left to right, so the checked-out
branch is on the left-hand side.

Flipped mode inverts the graph
in the y-axios so it's drawn from
right to left with the checked-out
branch on the right-hand side.`,name:"orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"normal"'},{value:'"flipped"'}]}},timestampFormat:{defaultValue:{value:"ISO-8601"},description:`A timestamp format string passed to DayJS
to format the timestamps of the commits
in the log table.`,name:"timestampFormat",required:!1,type:{name:"string | undefined"}},row:{defaultValue:null,description:`Overrides the table row
with a custom implementation.

Your custom row elements height
should be divisible by 2 so it
renders inline with the graph
nodes.

Passing this in also causes the
table container to no longer use
a CSS Grid. This gives you the option
to use any styling yourself such as
flex-box.

Some properties are injected into the
wrapping element of your custom row
element to ensure basic layout functions
as expected.`,name:"row",required:!1,type:{name:"CustomTableRow | undefined"}},className:{defaultValue:null,description:`A class name passed to the tables'
wrapping container element.`,name:"className",required:!1,type:{name:"string | undefined"}},styles:{defaultValue:null,description:`A React CSS styling object passed to
the various elements of the table.`,name:"styles",required:!1,type:{name:"GitLogTableStylingProps | undefined"}}}}}catch{}const W={title:"GitLogPaged",component:w,parameters:{layout:"fullscreen"},args:{entries:[],showTable:!0,branchName:"release",showCommitNodeHashes:!1,showHeaders:!0,enableResize:!1,enablePreviewedCommitStyling:!0,enableSelectedCommitStyling:!0,nodeTheme:"default",showGitIndex:!0,renderStrategy:"html-grid",nodeSize:20,orientation:"normal",onSelectCommit:e=>{console.info(`Selected commit ${e==null?void 0:e.hash}`)},defaultGraphWidth:120,rowSpacing:0},argTypes:{entries:{name:"Git Log Entries",table:{category:"Required Props"}},branchName:{name:"Branch Name",table:{category:"Required Props"}},showCommitNodeHashes:{name:"Show Commit Hashes",table:{category:"Visibility"}},showTable:{name:"Show Table",table:{category:"Visibility"}},showHeaders:{name:"Show Headers",type:"boolean",table:{category:"Visibility"}},nodeTheme:{name:"Node Style",table:{category:"Visibility"},control:"radio",options:{Default:"default",Plain:"plain"}},showGitIndex:{name:"Show Git Index",type:"boolean",table:{category:"Visibility"}},renderStrategy:{name:"Graph Render Strategy",table:{category:"Visibility"},control:"radio",options:{"HTML Grid":"html-grid",Canvas2D:"canvas"}},enableSelectedCommitStyling:{name:"Enable Selection Styling",type:"boolean",table:{category:"Visibility"}},enablePreviewedCommitStyling:{name:"Enable Preview Styling",type:"boolean",table:{category:"Visibility"}},enableResize:{name:"Enable Resize",table:{category:"Dimensions"}},rowSpacing:{name:"Row Spacing",table:{category:"Dimensions"},control:{type:"range",min:0,max:50}},defaultGraphWidth:{name:"Graph Width",table:{category:"Dimensions"},control:{type:"range",min:0,max:500}},nodeSize:{name:"Graph Node Size",table:{category:"Dimensions"},control:{type:"range",min:8,max:30,step:2}},orientation:{name:"Graph Orientation",table:{category:"Dimensions"},control:"radio",options:{Normal:"normal",Flipped:"flipped"}},onSelectCommit:{name:"onSelectCommit",table:{category:"Callback Functions"}},onPreviewCommit:{name:"onPreviewCommit",table:{category:"Callback Functions"}},theme:{table:{disable:!0}},colours:{table:{disable:!0}},urls:{table:{disable:!0}},classes:{table:{disable:!0}},indexStatus:{table:{disable:!0}},headCommitHash:{table:{disable:!0}}}},f={render:e=>t.jsx(S,{...e})};var T,V,k;f.parameters={...f.parameters,docs:{...(T=f.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: args => <GitLogPagedDemo {...args} />
}`,...(k=(V=f.parameters)==null?void 0:V.docs)==null?void 0:k.source}}};const M=["Demo"];export{f as Demo,M as __namedExportsOrder,W as default};
