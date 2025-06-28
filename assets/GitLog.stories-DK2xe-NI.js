import{j as n}from"./iframe-t0IRCVA7.js";import{u as w,s as t,S as v,L as x,G as a}from"./StoryHeader-CQEugIqG.js";import"./index-C-rgPfQW.js";const S=e=>{const{theme:o,loading:i,colours:s,entries:l,branch:m,buildUrls:h,repository:d,backgroundColour:u,handleChangeTheme:c,handleChangeColors:g,handleChangeRepository:r}=w();return n.jsxs("div",{style:{background:u},className:t.container,children:[n.jsx(v,{theme:o,colours:s,repository:d,onChangeTheme:c,onChangeColours:g,onChangeRepository:r}),i&&n.jsx("div",{className:t.loading,children:n.jsx(x,{theme:o})}),!i&&l&&n.jsxs(a,{...e,colours:s.colors,entries:l,theme:o,currentBranch:m,paging:{page:e.page??0,size:e.pageSize??l.length},classes:{containerStyles:{background:u},containerClass:t.gitLogContainer},indexStatus:{added:e.indexStatusFilesAdded,modified:e.indexStatusFilesModified,deleted:e.indexStatusFilesDeleted},urls:h,children:[e.showBranchesTags&&n.jsx(a.Tags,{}),e.renderStrategy==="html-grid"&&n.jsx(a.GraphHTMLGrid,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize,showCommitNodeHashes:e.showCommitNodeHashes,showCommitNodeTooltips:e.showCommitNodeTooltips}),e.renderStrategy==="canvas"&&n.jsx(a.GraphCanvas2D,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize}),e.showTable&&n.jsx(a.Table,{className:t.table,timestampFormat:e.timestampFormat})]})]})};try{S.displayName="GitLogDemo",S.__docgenInfo={description:"",displayName:"GitLogDemo",props:{pageSize:{defaultValue:null,description:"",name:"pageSize",required:!1,type:{name:"number | undefined"}},page:{defaultValue:null,description:"",name:"page",required:!1,type:{name:"number | undefined"}},showTable:{defaultValue:null,description:"",name:"showTable",required:!0,type:{name:"boolean"}},showBranchesTags:{defaultValue:null,description:"",name:"showBranchesTags",required:!0,type:{name:"boolean"}},showCommitNodeHashes:{defaultValue:null,description:`Whether to show the commit hash
to the side of the node in the graph.`,name:"showCommitNodeHashes",required:!0,type:{name:"boolean"}},renderStrategy:{defaultValue:null,description:"",name:"renderStrategy",required:!0,type:{name:"enum",value:[{value:'"html-grid"'},{value:'"canvas"'}]}},indexStatusFilesModified:{defaultValue:null,description:"",name:"indexStatusFilesModified",required:!0,type:{name:"number"}},indexStatusFilesAdded:{defaultValue:null,description:"",name:"indexStatusFilesAdded",required:!0,type:{name:"number"}},indexStatusFilesDeleted:{defaultValue:null,description:"",name:"indexStatusFilesDeleted",required:!0,type:{name:"number"}},currentBranch:{defaultValue:null,description:`The name of the branch that is
currently checked out.`,name:"currentBranch",required:!0,type:{name:"string"}},paging:{defaultValue:null,description:`Optional paging information to show
a window of the given size from the
set of git log entries.

This property assumes you are using
client-side pagination and that the
given {@link entries} include the
entire Git log history for the
repository.

If you wish to use server-side pagination
and manage the state yourself, use the
{@link GitLogPaged } variation of the
component.`,name:"paging",required:!1,type:{name:"GitLogPaging | undefined"}},entries:{defaultValue:null,description:`The git log entries to visualise
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
the various elements of the table.`,name:"styles",required:!1,type:{name:"GitLogTableStylingProps | undefined"}}}}}catch{}const I={title:"GitLog",component:a,parameters:{layout:"fullscreen"},args:{entries:[],showTable:!0,currentBranch:"release",showBranchesTags:!0,showCommitNodeHashes:!1,showCommitNodeTooltips:!1,enablePreviewedCommitStyling:!0,enableSelectedCommitStyling:!0,showHeaders:!0,showGitIndex:!0,enableResize:!1,nodeTheme:"default",renderStrategy:"html-grid",nodeSize:20,orientation:"normal",onSelectCommit:e=>{console.info(`Selected commit ${e==null?void 0:e.hash}`)},defaultGraphWidth:120,rowSpacing:0,page:0,pageSize:200,indexStatusFilesModified:5,indexStatusFilesAdded:2,indexStatusFilesDeleted:1},argTypes:{entries:{name:"Git Log Entries",table:{category:"Required Props"}},currentBranch:{name:"Current Branch",table:{category:"Required Props"}},showCommitNodeHashes:{name:"Show Commit Hashes",table:{category:"Visibility"}},showTable:{name:"Show Table",table:{category:"Visibility"}},showBranchesTags:{name:"Show Branches / Tags",table:{category:"Visibility"}},showHeaders:{name:"Show Headers",type:"boolean",table:{category:"Visibility"}},showCommitNodeTooltips:{name:"Show Commit Tooltips",table:{category:"Visibility"}},nodeTheme:{name:"Node Style",table:{category:"Visibility"},control:"radio",options:{Default:"default",Plain:"plain"}},showGitIndex:{name:"Show Git Index",type:"boolean",table:{category:"Visibility"}},renderStrategy:{name:"Graph Render Strategy",table:{category:"Visibility"},control:"radio",options:{"HTML Grid":"html-grid",Canvas2D:"canvas"}},enableSelectedCommitStyling:{name:"Enable Selection Styling",type:"boolean",table:{category:"Visibility"}},enablePreviewedCommitStyling:{name:"Enable Preview Styling",type:"boolean",table:{category:"Visibility"}},pageSize:{name:"Page Size",table:{category:"Pagination"},control:{type:"range",min:1,max:300}},page:{name:"Page Number",table:{category:"Pagination"},control:{type:"range",min:0,max:50}},enableResize:{name:"Enable Resize",table:{category:"Dimensions"}},rowSpacing:{name:"Row Spacing",table:{category:"Dimensions"},control:{type:"range",min:0,max:50}},defaultGraphWidth:{name:"Graph Width",table:{category:"Dimensions"},control:{type:"range",min:100,max:500}},nodeSize:{name:"Graph Node Size",table:{category:"Dimensions"},control:{type:"range",min:8,max:30,step:2}},orientation:{name:"Graph Orientation",table:{category:"Dimensions"},control:"radio",options:{Normal:"normal",Flipped:"flipped"}},onSelectCommit:{name:"onSelectCommit",table:{category:"Callback Functions"}},onPreviewCommit:{name:"onPreviewCommit",table:{category:"Callback Functions"}},indexStatusFilesModified:{name:"Modified Files",type:{name:"number"},table:{category:"Git Index Status"}},indexStatusFilesAdded:{name:"Added Files",type:{name:"number"},table:{category:"Git Index Status"}},indexStatusFilesDeleted:{name:"Deleted Files",type:{name:"number"},table:{category:"Git Index Status"}},paging:{table:{disable:!0}},theme:{table:{disable:!0}},colours:{table:{disable:!0}},urls:{table:{disable:!0}},classes:{table:{disable:!0}},indexStatus:{table:{disable:!0}}}},b={render:e=>n.jsx(S,{...e})},y=()=>{const{theme:e,loading:o,colours:i,entries:s,branch:l,buildUrls:m,repository:h,backgroundColour:d,handleChangeTheme:u,handleChangeColors:c,handleChangeRepository:g}=w();return n.jsxs("div",{style:{background:d},className:t.container,children:[n.jsx(v,{theme:e,colours:i,repository:h,onChangeTheme:u,onChangeColours:c,onChangeRepository:g}),o&&n.jsx("div",{className:t.loading,children:n.jsx(x,{theme:e})}),!o&&s&&n.jsxs(a,{colours:i.colors,entries:s,theme:e,currentBranch:l,showGitIndex:!1,rowSpacing:80,classes:{containerStyles:{background:d},containerClass:t.gitLogContainer},indexStatus:{added:2,modified:5,deleted:1},urls:m,children:[n.jsx(a.GraphHTMLGrid,{highlightedBackgroundHeight:120}),n.jsx(a.Table,{className:t.table,row:({commit:r,backgroundColour:C})=>{var p;return n.jsxs("div",{className:t.customRow,style:{color:e==="dark"?"white":"black",backgroundColor:C},children:[n.jsx("div",{className:t.top,children:n.jsx("p",{className:t.message,children:r.message})}),n.jsxs("div",{className:t.bottom,children:[n.jsx("p",{className:t.author,style:{color:e==="dark"?"rgb(203,203,203)":"rgb(56,56,56)"},children:(p=r.author)==null?void 0:p.name}),n.jsxs("p",{className:t.hash,style:{color:e==="dark"?"white":"rgb(56,56,56)",background:e==="dark"?"grey":"rgb(224,224,224)"},children:["#",r.hash]})]})]})}})]})]})},T=["millie","neo","millie_neo","neo_banana","neo_2","bella"],f=()=>{const{theme:e,loading:o,colours:i,entries:s,branch:l,buildUrls:m,repository:h,backgroundColour:d,handleChangeTheme:u,handleChangeColors:c,handleChangeRepository:g}=w();return n.jsxs("div",{style:{background:d},className:t.container,children:[n.jsx(v,{theme:e,colours:i,repository:h,onChangeTheme:u,onChangeColours:c,onChangeRepository:g}),o&&n.jsx("div",{className:t.loading,children:n.jsx(x,{theme:e})}),!o&&s&&n.jsxs(a,{colours:i.colors,entries:s,theme:e,currentBranch:l,classes:{containerStyles:{background:d},containerClass:t.gitLogContainer},indexStatus:{added:2,modified:5,deleted:1},urls:m,children:[n.jsx(a.GraphHTMLGrid,{nodeSize:25,node:({nodeSize:r,colour:C,isIndexPseudoNode:p,rowIndex:H})=>n.jsx("div",{className:t.Node,style:{width:r,height:r,background:`url('https://placecats.com/${T[H%T.length]}/50/50?fit=contain&position=top') 50% 50%`,border:`2px ${p?"dotted":"solid"} ${C}`}})}),n.jsx(a.Table,{className:t.table})]})]})};var k,G,N;b.parameters={...b.parameters,docs:{...(k=b.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: args => <GitLogDemo {...args} />
}`,...(N=(G=b.parameters)==null?void 0:G.docs)==null?void 0:N.source}}};var V,q,L;y.parameters={...y.parameters,docs:{...(V=y.parameters)==null?void 0:V.docs,source:{originalSource:`() => {
  const {
    theme,
    loading,
    colours,
    entries,
    branch,
    buildUrls,
    repository,
    backgroundColour,
    handleChangeTheme,
    handleChangeColors,
    handleChangeRepository
  } = useStoryState();
  return <div style={{
    background: backgroundColour
  }} className={styles.container}>
      <StoryHeader theme={theme} colours={colours} repository={repository} onChangeTheme={handleChangeTheme} onChangeColours={handleChangeColors} onChangeRepository={handleChangeRepository} />

      {loading && <div className={styles.loading}>
          <Loading theme={theme} />
        </div>}

      {!loading && entries && <GitLog colours={colours.colors} entries={entries} theme={theme} currentBranch={branch} showGitIndex={false} rowSpacing={80} classes={{
      containerStyles: {
        background: backgroundColour
      },
      containerClass: styles.gitLogContainer
    }} indexStatus={{
      added: 2,
      modified: 5,
      deleted: 1
    }} urls={buildUrls}>
          <GitLog.GraphHTMLGrid highlightedBackgroundHeight={120} />

          <GitLog.Table className={styles.table} row={({
        commit,
        backgroundColour
      }) => <div className={styles.customRow} style={{
        color: theme === 'dark' ? 'white' : 'black',
        backgroundColor: backgroundColour
      }}>
                <div className={styles.top}>
                  <p className={styles.message}>
                    {commit.message}
                  </p>
                </div>

                <div className={styles.bottom}>
                  <p className={styles.author} style={{
            color: theme === 'dark' ? 'rgb(203,203,203)' : 'rgb(56,56,56)'
          }}>
                    {commit.author?.name}
                  </p>

                  <p className={styles.hash} style={{
            color: theme === 'dark' ? 'white' : 'rgb(56,56,56)',
            background: theme === 'dark' ? 'grey' : 'rgb(224,224,224)'
          }}>
                    #{commit.hash}
                  </p>
                </div>
              </div>} />
        </GitLog>}
    </div>;
}`,...(L=(q=y.parameters)==null?void 0:q.docs)==null?void 0:L.source}}};var R,j,z;f.parameters={...f.parameters,docs:{...(R=f.parameters)==null?void 0:R.docs,source:{originalSource:`() => {
  const {
    theme,
    loading,
    colours,
    entries,
    branch,
    buildUrls,
    repository,
    backgroundColour,
    handleChangeTheme,
    handleChangeColors,
    handleChangeRepository
  } = useStoryState();
  return <div style={{
    background: backgroundColour
  }} className={styles.container}>
      <StoryHeader theme={theme} colours={colours} repository={repository} onChangeTheme={handleChangeTheme} onChangeColours={handleChangeColors} onChangeRepository={handleChangeRepository} />

      {loading && <div className={styles.loading}>
          <Loading theme={theme} />
        </div>}

      {!loading && entries && <GitLog colours={colours.colors} entries={entries} theme={theme} currentBranch={branch} classes={{
      containerStyles: {
        background: backgroundColour
      },
      containerClass: styles.gitLogContainer
    }} indexStatus={{
      added: 2,
      modified: 5,
      deleted: 1
    }} urls={buildUrls}>
          <GitLog.GraphHTMLGrid nodeSize={25} node={({
        nodeSize,
        colour,
        isIndexPseudoNode,
        rowIndex
      }) => <div className={styles.Node} style={{
        width: nodeSize,
        height: nodeSize,
        background: \`url('https://placecats.com/\${nodeImages[rowIndex % nodeImages.length]}/50/50?fit=contain&position=top') 50% 50%\`,
        border: \`2px \${isIndexPseudoNode ? 'dotted' : 'solid'} \${colour}\`
      }} />} />

          <GitLog.Table className={styles.table} />
        </GitLog>}
    </div>;
}`,...(z=(j=f.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};const B=["Demo","CustomTableRow","CustomCommitNode"];export{f as CustomCommitNode,y as CustomTableRow,b as Demo,B as __namedExportsOrder,I as default};
