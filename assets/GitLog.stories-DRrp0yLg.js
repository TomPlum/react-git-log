import{j as o}from"./jsx-runtime-EKYJJIwR.js";import{N as a,u as C,s as n,S,L as T}from"./StoryHeader-Bcb3fheY.js";import"./index-BCtMShv3.js";import"./index-BqCLlfdy.js";import"./index-D-fs5e6L.js";import"./QueryClientProvider-BryXDp-x.js";const f={title:"GitLog",component:a,parameters:{layout:"fullscreen"},args:{entries:[],showTable:!0,currentBranch:"release",showBranchesTags:!0,showCommitNodeHashes:!1,showCommitNodeTooltips:!1,showHeaders:!0,showGitIndex:!0,enableResize:!1,nodeTheme:"default",nodeSize:20,orientation:"normal",onSelectCommit:e=>{console.info(`Selected commit ${e==null?void 0:e.hash}`)},githubRepositoryUrl:"https://github.com/TomPlum/sleep",defaultGraphWidth:200,rowSpacing:0,page:0,pageSize:200},argTypes:{entries:{name:"Git Log Entries",table:{category:"Required Props"}},currentBranch:{name:"Current Branch",table:{category:"Required Props"}},showCommitNodeHashes:{name:"Show Commit Hashes",table:{category:"Visibility"}},showTable:{name:"Show Table",table:{category:"Visibility"}},showBranchesTags:{name:"Show Branches / Tags",table:{category:"Visibility"}},showHeaders:{name:"Show Headers",table:{category:"Visibility"}},showCommitNodeTooltips:{name:"Show Commit Tooltips",table:{category:"Visibility"}},githubRepositoryUrl:{name:"Github Repository",table:{category:"Visibility"}},nodeTheme:{name:"Node Style",table:{category:"Visibility"},control:"radio",options:{Default:"default",Plain:"plain"}},showGitIndex:{name:"Show Git Index",table:{category:"Visibility"}},pageSize:{name:"Page Size",table:{category:"Pagination"},control:{type:"range",min:1,max:300}},page:{name:"Page Number",table:{category:"Pagination"},control:{type:"range",min:0,max:50}},enableResize:{name:"Enable Resize",table:{category:"Dimensions"}},rowSpacing:{name:"Row Spacing",table:{category:"Dimensions"},control:{type:"range",min:0,max:50}},defaultGraphWidth:{name:"Graph Width",table:{category:"Dimensions"},control:{type:"range",min:100,max:500}},nodeSize:{name:"Graph Node Size",table:{category:"Dimensions"},control:{type:"range",min:8,max:30,step:2}},orientation:{name:"Graph Orientation",table:{category:"Dimensions"},control:"radio",options:{Normal:"normal",Flipped:"flipped"}},onSelectCommit:{name:"onSelectCommit",table:{category:"Callback Functions"}}}},t={render:e=>{const{theme:s,loading:r,colours:l,entries:i,branch:c,repository:p,backgroundColour:m,handleChangeTheme:b,handleChangeColors:y,handleChangeRepository:u}=C();return o.jsxs("div",{style:{background:m},className:n.container,children:[o.jsx(S,{theme:s,colours:l,repository:p,onChangeTheme:b,onChangeColours:y,onChangeRepository:u}),r&&o.jsx("div",{className:n.loading,children:o.jsx(T,{theme:s})}),!r&&i&&o.jsxs(a,{...e,colours:l.colors,entries:i,theme:s,currentBranch:c,paging:{page:e.page??0,size:e.pageSize??i.length},classes:{containerStyles:{background:m},containerClass:n.gitLogContainer},indexStatus:{added:2,modified:5,deleted:1},children:[e.showBranchesTags&&o.jsx(a.Tags,{}),o.jsx(a.Graph,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize,showCommitNodeHashes:e.showCommitNodeHashes,showCommitNodeTooltips:e.showCommitNodeTooltips}),e.showTable&&o.jsx(a.Table,{className:n.table,timestampFormat:e.timestampFormat})]})]})}};var h,d,g;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: args => {
    const {
      theme,
      loading,
      colours,
      entries,
      branch,
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

        {!loading && entries && <GitLog {...args} colours={colours.colors} entries={entries} theme={theme} currentBranch={branch} paging={{
        page: args.page ?? 0,
        size: args.pageSize ?? entries.length
      }} classes={{
        containerStyles: {
          background: backgroundColour
        },
        containerClass: styles.gitLogContainer
      }} indexStatus={{
        added: 2,
        modified: 5,
        deleted: 1
      }}>
            {args.showBranchesTags && <GitLog.Tags />}

            <GitLog.Graph nodeSize={args.nodeSize} nodeTheme={args.nodeTheme} orientation={args.orientation} enableResize={args.enableResize} showCommitNodeHashes={args.showCommitNodeHashes} showCommitNodeTooltips={args.showCommitNodeTooltips} />

            {args.showTable && <GitLog.Table className={styles.table} timestampFormat={args.timestampFormat} />}
          </GitLog>}
      </div>;
  }
}`,...(g=(d=t.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const H=["Demo"];export{t as Demo,H as __namedExportsOrder,f as default};
