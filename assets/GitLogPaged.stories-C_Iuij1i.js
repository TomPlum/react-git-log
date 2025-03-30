import{j as a}from"./jsx-runtime-EKYJJIwR.js";import{c as g,_ as y,u as k,s as p,S as P,L as R}from"./StoryHeader-IeJWOdXA.js";import{r as S}from"./index-BCtMShv3.js";import"./index-BqCLlfdy.js";import"./index-D-fs5e6L.js";import"./QueryClientProvider-BryXDp-x.js";const j="_pagination_3vy2g_1",H="_pages_3vy2g_6",B="_pageButton_3vy2g_13",G="_active_3vy2g_18",V="_chevronButton_3vy2g_21",L="_disabled_3vy2g_27",s={pagination:j,pages:H,pageButton:B,active:G,chevronButton:V,disabled:L},N=({theme:e,pageSize:l,currentPage:o,total:m,onChangePage:i})=>{const t=Math.ceil(m/l),d=Array.from({length:t},(n,c)=>c+1),u=S.useMemo(()=>{const c=Math.floor(5.5);let h=Math.max(1,o-c),r=h+11-1;return r>t&&(r=t,h=Math.max(1,r-11+1)),d.slice(h-1,r)},[o,d,t]);return a.jsxs("div",{className:s.pagination,children:[a.jsx("button",{disabled:o===1,className:g(s.chevronButton,{[s.disabled]:o===1}),onClick:()=>i(1),style:{color:e==="dark"?"white":"black"},children:"<<"}),a.jsx("button",{disabled:o===1,className:g(s.chevronButton,{[s.disabled]:o===1}),onClick:()=>i(o-1),style:{color:e==="dark"?"white":"black"},children:"<"}),a.jsx("div",{className:s.pages,children:u.map(n=>a.jsx("button",{onClick:()=>i(n),className:g(s.pageButton,{[s.active]:n===o}),style:{color:e==="dark"?"white":"black"},title:`Go to page ${n}`,children:n},n))}),a.jsx("button",{className:g(s.chevronButton,{[s.disabled]:o===t}),disabled:o===t,onClick:()=>i(o+1),style:{color:e==="dark"?"white":"black"},children:">"}),a.jsx("button",{className:g(s.chevronButton,{[s.disabled]:o===t}),disabled:o===t,onClick:()=>i(t),style:{color:e==="dark"?"white":"black"},children:">>"})]})};try{N.displayName="Pagination",N.__docgenInfo={description:"",displayName:"Pagination",props:{theme:{defaultValue:null,description:"",name:"theme",required:!0,type:{name:"ThemeMode"}},currentPage:{defaultValue:null,description:"",name:"currentPage",required:!0,type:{name:"number"}},pageSize:{defaultValue:null,description:"",name:"pageSize",required:!0,type:{name:"number"}},total:{defaultValue:null,description:"",name:"total",required:!0,type:{name:"number"}},onChangePage:{defaultValue:null,description:"",name:"onChangePage",required:!0,type:{name:"(pageNumber: number) => void"}},onChangePageSize:{defaultValue:null,description:"",name:"onChangePageSize",required:!0,type:{name:"(pageSize: number) => void"}}}}}catch{}const $={title:"GitLogPaged",component:y,parameters:{layout:"fullscreen"},args:{entries:[],showTable:!0,branchName:"release",showCommitNodeHashes:!1,showCommitNodeTooltips:!1,showHeaders:!0,enableResize:!1,nodeTheme:"default",onSelectCommit:e=>{console.info(`Selected commit ${e==null?void 0:e.hash}`)},githubRepositoryUrl:"https://github.com/TomPlum/sleep",defaultGraphWidth:120,rowSpacing:0},argTypes:{entries:{name:"Git Log Entries",table:{category:"Required Props"}},branchName:{name:"Branch Name",table:{category:"Required Props"}},showCommitNodeHashes:{name:"Show Commit Hashes",table:{category:"Visibility"}},showTable:{name:"Show Table",table:{category:"Visibility"}},showHeaders:{name:"Show Headers",table:{category:"Visibility"}},showCommitNodeTooltips:{name:"Show Commit Tooltips",table:{category:"Visibility"}},githubRepositoryUrl:{name:"Github Repository",table:{category:"Visibility"}},nodeTheme:{name:"Node Style",table:{category:"Visibility"},control:"radio",options:{Default:"default",Plain:"plain"}},enableResize:{name:"Enable Resize",table:{category:"Dimensions"}},rowSpacing:{name:"Row Spacing",table:{category:"Dimensions"},control:{type:"range",min:0,max:50}},defaultGraphWidth:{name:"Graph Width",table:{category:"Dimensions"},control:{type:"range",min:0,max:500}},onSelectCommit:{name:"onSelectCommit",table:{category:"Callback Functions"}}}},b={render:e=>{const[l,o]=S.useState(1),[m,i]=S.useState(20),{theme:t,loading:d,colours:u,entries:n,branch:c,repository:h,headCommitHash:r,backgroundColour:w,handleChangeTheme:f,handleChangeColors:x,handleChangeRepository:z}=k({isServerSidePaginated:!0});return a.jsxs("div",{style:{background:w},className:p.container,children:[a.jsx(P,{theme:t,colours:u,repository:h,onChangeTheme:f,onChangeColours:x,onChangeRepository:z,children:a.jsx("div",{style:{marginTop:20},children:a.jsx(N,{theme:t,pageSize:m,currentPage:l,total:(n==null?void 0:n.length)??0,onChangePage:C=>o(C),onChangePageSize:C=>i(C)})})}),d&&a.jsx("div",{className:p.loading,children:a.jsx(R,{theme:t})}),!d&&n&&a.jsxs(y,{...e,theme:t,entries:n.slice(m*(l-1),m*l),branchName:c,colours:u.colors,headCommitHash:r,classes:{containerStyles:{background:w},containerClass:p.gitLogContainer},children:[a.jsx(y.Graph,{nodeTheme:e.nodeTheme,enableResize:e.enableResize,showCommitNodeHashes:e.showCommitNodeHashes,showCommitNodeTooltips:e.showCommitNodeTooltips}),e.showTable&&a.jsx(y.Table,{className:p.table,timestampFormat:e.timestampFormat})]})]})}};var T,v,_;b.parameters={...b.parameters,docs:{...(T=b.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
      }}>
            <GitLogPaged.Graph nodeTheme={args.nodeTheme} enableResize={args.enableResize} showCommitNodeHashes={args.showCommitNodeHashes} showCommitNodeTooltips={args.showCommitNodeTooltips} />

            {args.showTable && <GitLogPaged.Table className={styles.table} timestampFormat={args.timestampFormat} />}
          </GitLogPaged>}
      </div>;
  }
}`,...(_=(v=b.parameters)==null?void 0:v.docs)==null?void 0:_.source}}};const U=["Demo"];export{b as Demo,U as __namedExportsOrder,$ as default};
