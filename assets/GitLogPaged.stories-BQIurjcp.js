import{j as a}from"./jsx-runtime-EKYJJIwR.js";import{c as g,E as y,u as k,s as u,S as P,L as R}from"./StoryHeader-CAC4xEvk.js";import{r as C}from"./index-BCtMShv3.js";import"./index-BqCLlfdy.js";import"./index-D-fs5e6L.js";import"./QueryClientProvider-BryXDp-x.js";const j="_pagination_3vy2g_1",G="_pages_3vy2g_6",H="_pageButton_3vy2g_13",B="_active_3vy2g_18",V="_chevronButton_3vy2g_21",L="_disabled_3vy2g_27",s={pagination:j,pages:G,pageButton:H,active:B,chevronButton:V,disabled:L},N=({theme:e,pageSize:l,currentPage:o,total:d,onChangePage:i})=>{const t=Math.ceil(d/l),m=Array.from({length:t},(n,c)=>c+1),p=C.useMemo(()=>{const c=Math.floor(5.5);let h=Math.max(1,o-c),r=h+11-1;return r>t&&(r=t,h=Math.max(1,r-11+1)),m.slice(h-1,r)},[o,m,t]);return a.jsxs("div",{className:s.pagination,children:[a.jsx("button",{disabled:o===1,className:g(s.chevronButton,{[s.disabled]:o===1}),onClick:()=>i(1),style:{color:e==="dark"?"white":"black"},children:"<<"}),a.jsx("button",{disabled:o===1,className:g(s.chevronButton,{[s.disabled]:o===1}),onClick:()=>i(o-1),style:{color:e==="dark"?"white":"black"},children:"<"}),a.jsx("div",{className:s.pages,children:p.map(n=>a.jsx("button",{onClick:()=>i(n),className:g(s.pageButton,{[s.active]:n===o}),style:{color:e==="dark"?"white":"black"},title:`Go to page ${n}`,children:n},n))}),a.jsx("button",{className:g(s.chevronButton,{[s.disabled]:o===t}),disabled:o===t,onClick:()=>i(o+1),style:{color:e==="dark"?"white":"black"},children:">"}),a.jsx("button",{className:g(s.chevronButton,{[s.disabled]:o===t}),disabled:o===t,onClick:()=>i(t),style:{color:e==="dark"?"white":"black"},children:">>"})]})};try{N.displayName="Pagination",N.__docgenInfo={description:"",displayName:"Pagination",props:{theme:{defaultValue:null,description:"",name:"theme",required:!0,type:{name:"ThemeMode"}},currentPage:{defaultValue:null,description:"",name:"currentPage",required:!0,type:{name:"number"}},pageSize:{defaultValue:null,description:"",name:"pageSize",required:!0,type:{name:"number"}},total:{defaultValue:null,description:"",name:"total",required:!0,type:{name:"number"}},onChangePage:{defaultValue:null,description:"",name:"onChangePage",required:!0,type:{name:"(pageNumber: number) => void"}},onChangePageSize:{defaultValue:null,description:"",name:"onChangePageSize",required:!0,type:{name:"(pageSize: number) => void"}}}}}catch{}const W={title:"GitLogPaged",component:y,parameters:{layout:"fullscreen"},args:{entries:[],showTable:!0,branchName:"release",showCommitNodeHashes:!1,showCommitNodeTooltips:!1,showHeaders:!0,enableResize:!1,nodeTheme:"default",showGitIndex:!0,nodeSize:20,orientation:"normal",onSelectCommit:e=>{console.info(`Selected commit ${e==null?void 0:e.hash}`)},githubRepositoryUrl:"https://github.com/TomPlum/sleep",defaultGraphWidth:120,rowSpacing:0},argTypes:{entries:{name:"Git Log Entries",table:{category:"Required Props"}},branchName:{name:"Branch Name",table:{category:"Required Props"}},showCommitNodeHashes:{name:"Show Commit Hashes",table:{category:"Visibility"}},showTable:{name:"Show Table",table:{category:"Visibility"}},showHeaders:{name:"Show Headers",table:{category:"Visibility"}},showCommitNodeTooltips:{name:"Show Commit Tooltips",table:{category:"Visibility"}},githubRepositoryUrl:{name:"Github Repository",table:{category:"Visibility"}},nodeTheme:{name:"Node Style",table:{category:"Visibility"},control:"radio",options:{Default:"default",Plain:"plain"}},showGitIndex:{name:"Show Git Index",table:{category:"Visibility"}},enableResize:{name:"Enable Resize",table:{category:"Dimensions"}},rowSpacing:{name:"Row Spacing",table:{category:"Dimensions"},control:{type:"range",min:0,max:50}},defaultGraphWidth:{name:"Graph Width",table:{category:"Dimensions"},control:{type:"range",min:0,max:500}},nodeSize:{name:"Graph Node Size",table:{category:"Dimensions"},control:{type:"range",min:8,max:30,step:2}},orientation:{name:"Graph Orientation",table:{category:"Dimensions"},control:"radio",options:{Normal:"normal",Flipped:"flipped"}},onSelectCommit:{name:"onSelectCommit",table:{category:"Callback Functions"}}}},b={render:e=>{const[l,o]=C.useState(1),[d,i]=C.useState(20),{theme:t,loading:m,colours:p,entries:n,branch:c,repository:h,headCommitHash:r,backgroundColour:w,handleChangeTheme:x,handleChangeColors:_,handleChangeRepository:f}=k({isServerSidePaginated:!0});return a.jsxs("div",{style:{background:w},className:u.container,children:[a.jsx(P,{theme:t,colours:p,repository:h,onChangeTheme:x,onChangeColours:_,onChangeRepository:f,children:a.jsx("div",{style:{marginTop:20},children:a.jsx(N,{theme:t,pageSize:d,currentPage:l,total:(n==null?void 0:n.length)??0,onChangePage:S=>o(S),onChangePageSize:S=>i(S)})})}),m&&a.jsx("div",{className:u.loading,children:a.jsx(R,{theme:t})}),!m&&n&&a.jsxs(y,{...e,theme:t,entries:n.slice(d*(l-1),d*l),branchName:c,colours:p.colors,headCommitHash:r,classes:{containerStyles:{background:w},containerClass:u.gitLogContainer},indexStatus:{added:0,modified:2,deleted:3},children:[a.jsx(y.Graph,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize,showCommitNodeHashes:e.showCommitNodeHashes,showCommitNodeTooltips:e.showCommitNodeTooltips}),e.showTable&&a.jsx(y.Table,{className:u.table,timestampFormat:e.timestampFormat})]})]})}};var T,v,z;b.parameters={...b.parameters,docs:{...(T=b.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: args => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const {
      theme,
      loading,
      colours,
      entries,
      branch,
      repository,
      headCommitHash,
      backgroundColour,
      handleChangeTheme,
      handleChangeColors,
      handleChangeRepository
    } = useStoryState({
      isServerSidePaginated: true
    });
    return <div style={{
      background: backgroundColour
    }} className={styles.container}>
        <StoryHeader theme={theme} colours={colours} repository={repository} onChangeTheme={handleChangeTheme} onChangeColours={handleChangeColors} onChangeRepository={handleChangeRepository}>
          <div style={{
          marginTop: 20
        }}>
            <Pagination theme={theme} pageSize={pageSize} currentPage={pageNumber} total={entries?.length ?? 0} onChangePage={newPage => setPageNumber(newPage)} onChangePageSize={newSize => setPageSize(newSize)} />
          </div>
        </StoryHeader>

        {loading && <div className={styles.loading}>
            <Loading theme={theme} />
          </div>}

        {!loading && entries && <GitLogPaged {...args} theme={theme} entries={entries.slice(pageSize * (pageNumber - 1), pageSize * pageNumber)} branchName={branch} colours={colours.colors} headCommitHash={headCommitHash} classes={{
        containerStyles: {
          background: backgroundColour
        },
        containerClass: styles.gitLogContainer
      }} indexStatus={{
        added: 0,
        modified: 2,
        deleted: 3
      }}>
            <GitLogPaged.Graph nodeSize={args.nodeSize} nodeTheme={args.nodeTheme} orientation={args.orientation} enableResize={args.enableResize} showCommitNodeHashes={args.showCommitNodeHashes} showCommitNodeTooltips={args.showCommitNodeTooltips} />

            {args.showTable && <GitLogPaged.Table className={styles.table} timestampFormat={args.timestampFormat} />}
          </GitLogPaged>}
      </div>;
  }
}`,...(z=(v=b.parameters)==null?void 0:v.docs)==null?void 0:z.source}}};const $=["Demo"];export{b as Demo,$ as __namedExportsOrder,W as default};
