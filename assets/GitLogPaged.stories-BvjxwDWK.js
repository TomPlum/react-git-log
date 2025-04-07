import{j as a}from"./jsx-runtime-EKYJJIwR.js";import{c as g,E as y,u as P,s as p,S as j,L as G}from"./StoryHeader-BFpNeWau.js";import{r as C}from"./index-BCtMShv3.js";import"./index-BqCLlfdy.js";import"./index-D-fs5e6L.js";import"./QueryClientProvider-BryXDp-x.js";const H="_pagination_3vy2g_1",R="_pages_3vy2g_6",B="_pageButton_3vy2g_13",V="_active_3vy2g_18",L="_chevronButton_3vy2g_21",q="_disabled_3vy2g_27",s={pagination:H,pages:R,pageButton:B,active:V,chevronButton:L,disabled:q},N=({theme:e,pageSize:l,currentPage:o,total:d,onChangePage:i})=>{const t=Math.ceil(d/l),m=Array.from({length:t},(n,c)=>c+1),u=C.useMemo(()=>{const c=Math.floor(5.5);let h=Math.max(1,o-c),r=h+11-1;return r>t&&(r=t,h=Math.max(1,r-11+1)),m.slice(h-1,r)},[o,m,t]);return a.jsxs("div",{className:s.pagination,children:[a.jsx("button",{disabled:o===1,className:g(s.chevronButton,{[s.disabled]:o===1}),onClick:()=>i(1),style:{color:e==="dark"?"white":"black"},children:"<<"}),a.jsx("button",{disabled:o===1,className:g(s.chevronButton,{[s.disabled]:o===1}),onClick:()=>i(o-1),style:{color:e==="dark"?"white":"black"},children:"<"}),a.jsx("div",{className:s.pages,children:u.map(n=>a.jsx("button",{onClick:()=>i(n),className:g(s.pageButton,{[s.active]:n===o}),style:{color:e==="dark"?"white":"black"},title:`Go to page ${n}`,children:n},n))}),a.jsx("button",{className:g(s.chevronButton,{[s.disabled]:o===t}),disabled:o===t,onClick:()=>i(o+1),style:{color:e==="dark"?"white":"black"},children:">"}),a.jsx("button",{className:g(s.chevronButton,{[s.disabled]:o===t}),disabled:o===t,onClick:()=>i(t),style:{color:e==="dark"?"white":"black"},children:">>"})]})};try{N.displayName="Pagination",N.__docgenInfo={description:"",displayName:"Pagination",props:{theme:{defaultValue:null,description:"",name:"theme",required:!0,type:{name:"ThemeMode"}},currentPage:{defaultValue:null,description:"",name:"currentPage",required:!0,type:{name:"number"}},pageSize:{defaultValue:null,description:"",name:"pageSize",required:!0,type:{name:"number"}},total:{defaultValue:null,description:"",name:"total",required:!0,type:{name:"number"}},onChangePage:{defaultValue:null,description:"",name:"onChangePage",required:!0,type:{name:"(pageNumber: number) => void"}},onChangePageSize:{defaultValue:null,description:"",name:"onChangePageSize",required:!0,type:{name:"(pageSize: number) => void"}}}}}catch{}const W={title:"GitLogPaged",component:y,parameters:{layout:"fullscreen"},args:{entries:[],showTable:!0,branchName:"release",showCommitNodeHashes:!1,showCommitNodeTooltips:!1,showHeaders:!0,enableResize:!1,nodeTheme:"default",showGitIndex:!0,nodeSize:20,orientation:"normal",onSelectCommit:e=>{console.info(`Selected commit ${e==null?void 0:e.hash}`)},defaultGraphWidth:120,rowSpacing:0},argTypes:{entries:{name:"Git Log Entries",table:{category:"Required Props"}},branchName:{name:"Branch Name",table:{category:"Required Props"}},showCommitNodeHashes:{name:"Show Commit Hashes",table:{category:"Visibility"}},showTable:{name:"Show Table",table:{category:"Visibility"}},showHeaders:{name:"Show Headers",table:{category:"Visibility"}},showCommitNodeTooltips:{name:"Show Commit Tooltips",table:{category:"Visibility"}},nodeTheme:{name:"Node Style",table:{category:"Visibility"},control:"radio",options:{Default:"default",Plain:"plain"}},showGitIndex:{name:"Show Git Index",table:{category:"Visibility"}},enableResize:{name:"Enable Resize",table:{category:"Dimensions"}},rowSpacing:{name:"Row Spacing",table:{category:"Dimensions"},control:{type:"range",min:0,max:50}},defaultGraphWidth:{name:"Graph Width",table:{category:"Dimensions"},control:{type:"range",min:0,max:500}},nodeSize:{name:"Graph Node Size",table:{category:"Dimensions"},control:{type:"range",min:8,max:30,step:2}},orientation:{name:"Graph Orientation",table:{category:"Dimensions"},control:"radio",options:{Normal:"normal",Flipped:"flipped"}},onSelectCommit:{name:"onSelectCommit",table:{category:"Callback Functions"}}}},b={render:e=>{const[l,o]=C.useState(1),[d,i]=C.useState(20),{theme:t,loading:m,colours:u,entries:n,branch:c,buildUrls:h,repository:r,headCommitHash:x,backgroundColour:w,handleChangeTheme:_,handleChangeColors:f,handleChangeRepository:k}=P({isServerSidePaginated:!0});return a.jsxs("div",{style:{background:w},className:p.container,children:[a.jsx(j,{theme:t,colours:u,repository:r,onChangeTheme:_,onChangeColours:f,onChangeRepository:k,children:a.jsx("div",{style:{marginTop:20},children:a.jsx(N,{theme:t,pageSize:d,currentPage:l,total:(n==null?void 0:n.length)??0,onChangePage:S=>o(S),onChangePageSize:S=>i(S)})})}),m&&a.jsx("div",{className:p.loading,children:a.jsx(G,{theme:t})}),!m&&n&&a.jsxs(y,{...e,theme:t,entries:n.slice(d*(l-1),d*l),branchName:c,colours:u.colors,headCommitHash:x,classes:{containerStyles:{background:w},containerClass:p.gitLogContainer},indexStatus:{added:0,modified:2,deleted:3},urls:h,children:[a.jsx(y.Graph,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize,showCommitNodeHashes:e.showCommitNodeHashes,showCommitNodeTooltips:e.showCommitNodeTooltips}),e.showTable&&a.jsx(y.Table,{className:p.table,timestampFormat:e.timestampFormat})]})]})}};var v,T,z;b.parameters={...b.parameters,docs:{...(v=b.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: args => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const {
      theme,
      loading,
      colours,
      entries,
      branch,
      buildUrls,
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
      }} urls={buildUrls}>
            <GitLogPaged.Graph nodeSize={args.nodeSize} nodeTheme={args.nodeTheme} orientation={args.orientation} enableResize={args.enableResize} showCommitNodeHashes={args.showCommitNodeHashes} showCommitNodeTooltips={args.showCommitNodeTooltips} />

            {args.showTable && <GitLogPaged.Table className={styles.table} timestampFormat={args.timestampFormat} />}
          </GitLogPaged>}
      </div>;
  }
}`,...(z=(T=b.parameters)==null?void 0:T.docs)==null?void 0:z.source}}};const $=["Demo"];export{b as Demo,$ as __namedExportsOrder,W as default};
