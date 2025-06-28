import{j as n}from"./iframe-CSNM2715.js";import{u as x,s as a,S as w,L as T,G as o}from"./StoryHeader-BVd36jqL.js";import"./index-SPKIe_xL.js";const f=e=>{const{theme:t,loading:s,colours:i,entries:l,branch:c,buildUrls:u,repository:d,backgroundColour:m,handleChangeTheme:h,handleChangeColors:g,handleChangeRepository:r}=x();return n.jsxs("div",{style:{background:m},className:a.container,children:[n.jsx(w,{theme:t,colours:i,repository:d,onChangeTheme:h,onChangeColours:g,onChangeRepository:r}),s&&n.jsx("div",{className:a.loading,children:n.jsx(T,{theme:t})}),!s&&l&&n.jsxs(o,{...e,colours:i.colors,entries:l,theme:t,currentBranch:c,paging:{page:e.page??0,size:e.pageSize??l.length},classes:{containerStyles:{background:m},containerClass:a.gitLogContainer},indexStatus:{added:e.indexStatusFilesAdded,modified:e.indexStatusFilesModified,deleted:e.indexStatusFilesDeleted},urls:u,children:[e.showBranchesTags&&n.jsx(o.Tags,{}),e.renderStrategy==="html-grid"&&n.jsx(o.GraphHTMLGrid,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize,showCommitNodeHashes:e.showCommitNodeHashes,showCommitNodeTooltips:e.showCommitNodeTooltips}),e.renderStrategy==="canvas"&&n.jsx(o.GraphCanvas2D,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize}),e.showTable&&n.jsx(o.Table,{className:a.table,timestampFormat:e.timestampFormat})]})]})};try{f.displayName="GitLogDemo",f.__docgenInfo={description:"",displayName:"GitLogDemo",props:{pageSize:{defaultValue:null,description:"",name:"pageSize",required:!1,type:{name:"number | undefined"}},page:{defaultValue:null,description:"",name:"page",required:!1,type:{name:"number | undefined"}},showTable:{defaultValue:null,description:"",name:"showTable",required:!0,type:{name:"boolean"}},showBranchesTags:{defaultValue:null,description:"",name:"showBranchesTags",required:!0,type:{name:"boolean"}},showCommitNodeHashes:{defaultValue:null,description:"",name:"showCommitNodeHashes",required:!0,type:{name:"boolean"}},renderStrategy:{defaultValue:null,description:"",name:"renderStrategy",required:!0,type:{name:"enum",value:[{value:'"html-grid"'},{value:'"canvas"'}]}},indexStatusFilesModified:{defaultValue:null,description:"",name:"indexStatusFilesModified",required:!0,type:{name:"number"}},indexStatusFilesAdded:{defaultValue:null,description:"",name:"indexStatusFilesAdded",required:!0,type:{name:"number"}},indexStatusFilesDeleted:{defaultValue:null,description:"",name:"indexStatusFilesDeleted",required:!0,type:{name:"number"}},nodeTheme:{defaultValue:null,description:`The theme to apply the commit node
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
the various elements of the table.`,name:"styles",required:!1,type:{name:"GitLogTableStylingProps | undefined"}}}}}catch{}const B={title:"GitLog",component:o,parameters:{layout:"fullscreen"},args:{entries:[],showTable:!0,currentBranch:"release",showBranchesTags:!0,showCommitNodeHashes:!1,showCommitNodeTooltips:!1,enablePreviewedCommitStyling:!0,enableSelectedCommitStyling:!0,showHeaders:!0,showGitIndex:!0,enableResize:!1,nodeTheme:"default",renderStrategy:"html-grid",nodeSize:20,orientation:"normal",onSelectCommit:e=>{console.info(`Selected commit ${e==null?void 0:e.hash}`)},defaultGraphWidth:120,rowSpacing:0,page:0,pageSize:200,indexStatusFilesModified:5,indexStatusFilesAdded:2,indexStatusFilesDeleted:1},argTypes:{entries:{name:"Git Log Entries",table:{category:"Required Props"}},currentBranch:{name:"Current Branch",table:{category:"Required Props"}},showCommitNodeHashes:{name:"Show Commit Hashes",table:{category:"Visibility"}},showTable:{name:"Show Table",table:{category:"Visibility"}},showBranchesTags:{name:"Show Branches / Tags",table:{category:"Visibility"}},showHeaders:{name:"Show Headers",type:"boolean",table:{category:"Visibility"}},showCommitNodeTooltips:{name:"Show Commit Tooltips",table:{category:"Visibility"}},nodeTheme:{name:"Node Style",table:{category:"Visibility"},control:"radio",options:{Default:"default",Plain:"plain"}},showGitIndex:{name:"Show Git Index",type:"boolean",table:{category:"Visibility"}},renderStrategy:{name:"Graph Render Strategy",table:{category:"Visibility"},control:"radio",options:{"HTML Grid":"html-grid",Canvas2D:"canvas"}},enableSelectedCommitStyling:{name:"Enable Selection Styling",type:"boolean",table:{category:"Visibility"}},enablePreviewedCommitStyling:{name:"Enable Preview Styling",type:"boolean",table:{category:"Visibility"}},pageSize:{name:"Page Size",table:{category:"Pagination"},control:{type:"range",min:1,max:300}},page:{name:"Page Number",table:{category:"Pagination"},control:{type:"range",min:0,max:50}},enableResize:{name:"Enable Resize",table:{category:"Dimensions"}},rowSpacing:{name:"Row Spacing",table:{category:"Dimensions"},control:{type:"range",min:0,max:50}},defaultGraphWidth:{name:"Graph Width",table:{category:"Dimensions"},control:{type:"range",min:100,max:500}},nodeSize:{name:"Graph Node Size",table:{category:"Dimensions"},control:{type:"range",min:8,max:30,step:2}},orientation:{name:"Graph Orientation",table:{category:"Dimensions"},control:"radio",options:{Normal:"normal",Flipped:"flipped"}},onSelectCommit:{name:"onSelectCommit",table:{category:"Callback Functions"}},onPreviewCommit:{name:"onPreviewCommit",table:{category:"Callback Functions"}},indexStatusFilesModified:{name:"Modified Files",type:{name:"number"},table:{category:"Git Index Status"}},indexStatusFilesAdded:{name:"Added Files",type:{name:"number"},table:{category:"Git Index Status"}},indexStatusFilesDeleted:{name:"Deleted Files",type:{name:"number"},table:{category:"Git Index Status"}},paging:{table:{disable:!0}},theme:{table:{disable:!0}},colours:{table:{disable:!0}},urls:{table:{disable:!0}},classes:{table:{disable:!0}},indexStatus:{table:{disable:!0}}}},b={render:e=>n.jsx(f,{...e})},y=()=>{const{theme:e,loading:t,colours:s,entries:i,branch:l,buildUrls:c,repository:u,backgroundColour:d,handleChangeTheme:m,handleChangeColors:h,handleChangeRepository:g}=x();return n.jsxs("div",{style:{background:d},className:a.container,children:[n.jsx(w,{theme:e,colours:s,repository:u,onChangeTheme:m,onChangeColours:h,onChangeRepository:g}),t&&n.jsx("div",{className:a.loading,children:n.jsx(T,{theme:e})}),!t&&i&&n.jsxs(o,{colours:s.colors,entries:i,theme:e,currentBranch:l,showGitIndex:!1,rowSpacing:80,classes:{containerStyles:{background:d},containerClass:a.gitLogContainer},indexStatus:{added:2,modified:5,deleted:1},urls:c,children:[n.jsx(o.GraphHTMLGrid,{highlightedBackgroundHeight:120}),n.jsx(o.Table,{className:a.table,row:({commit:r,backgroundColour:S})=>{var p;return n.jsxs("div",{className:a.customRow,style:{color:e==="dark"?"white":"black",backgroundColor:S},children:[n.jsx("div",{className:a.top,children:n.jsx("p",{className:a.message,children:r.message})}),n.jsxs("div",{className:a.bottom,children:[n.jsx("p",{className:a.author,style:{color:e==="dark"?"rgb(203,203,203)":"rgb(56,56,56)"},children:(p=r.author)==null?void 0:p.name}),n.jsxs("p",{className:a.hash,style:{color:e==="dark"?"white":"rgb(56,56,56)",background:e==="dark"?"grey":"rgb(224,224,224)"},children:["#",r.hash]})]})]})}})]})]})},N=["millie","neo","millie_neo","neo_banana","neo_2","bella"],C=()=>{const{theme:e,loading:t,colours:s,entries:i,branch:l,buildUrls:c,repository:u,backgroundColour:d,handleChangeTheme:m,handleChangeColors:h,handleChangeRepository:g}=x();return n.jsxs("div",{style:{background:d},className:a.container,children:[n.jsx(w,{theme:e,colours:s,repository:u,onChangeTheme:m,onChangeColours:h,onChangeRepository:g}),t&&n.jsx("div",{className:a.loading,children:n.jsx(T,{theme:e})}),!t&&i&&n.jsxs(o,{colours:s.colors,entries:i,theme:e,currentBranch:l,classes:{containerStyles:{background:d},containerClass:a.gitLogContainer},indexStatus:{added:2,modified:5,deleted:1},urls:c,children:[n.jsx(o.GraphHTMLGrid,{nodeSize:25,node:({nodeSize:r,colour:S,isIndexPseudoNode:p,rowIndex:D})=>n.jsx("div",{className:a.Node,style:{width:r,height:r,background:`url('https://placecats.com/${N[D%N.length]}/50/50?fit=contain&position=top') 50% 50%`,border:`2px ${p?"dotted":"solid"} ${S}`}})}),n.jsx(o.Table,{className:a.table})]})]})};var v,k,G;b.parameters={...b.parameters,docs:{...(v=b.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: args => <GitLogDemo {...args} />
}`,...(G=(k=b.parameters)==null?void 0:k.docs)==null?void 0:G.source}}};var j,R,z;y.parameters={...y.parameters,docs:{...(j=y.parameters)==null?void 0:j.docs,source:{originalSource:`() => {
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
}`,...(z=(R=y.parameters)==null?void 0:R.docs)==null?void 0:z.source}}};var L,V,F;C.parameters={...C.parameters,docs:{...(L=C.parameters)==null?void 0:L.docs,source:{originalSource:`() => {
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
}`,...(F=(V=C.parameters)==null?void 0:V.docs)==null?void 0:F.source}}};const P=["Demo","CustomTableRow","CustomCommitNode"];export{C as CustomCommitNode,y as CustomTableRow,b as Demo,P as __namedExportsOrder,B as default};
