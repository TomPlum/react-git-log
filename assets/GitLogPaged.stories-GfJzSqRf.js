import{j as a}from"./jsx-runtime-EKYJJIwR.js";import{c as g,t as S,u as R,s as p,S as H,L as j,e as v}from"./StoryHeader-DSzxNSfd.js";import{r as C}from"./index-D4lIrffr.js";import"./index-Dc97iC8r.js";import"./index-DsJinFGm.js";import"./QueryClientProvider-WIWjWkt9.js";const P="_pagination_3vy2g_1",L="_pages_3vy2g_6",B="_pageButton_3vy2g_13",V="_active_3vy2g_18",D="_chevronButton_3vy2g_21",M="_disabled_3vy2g_27",i={pagination:P,pages:L,pageButton:B,active:V,chevronButton:D,disabled:M},N=({theme:e,pageSize:l,currentPage:o,total:d,onChangePage:s})=>{const n=Math.ceil(d/l),m=Array.from({length:n},(t,c)=>c+1),u=C.useMemo(()=>{const c=Math.floor(5.5);let h=Math.max(1,o-c),r=h+11-1;return r>n&&(r=n,h=Math.max(1,r-11+1)),m.slice(h-1,r)},[o,m,n]);return a.jsxs("div",{className:i.pagination,children:[a.jsx("button",{disabled:o===1,className:g(i.chevronButton,{[i.disabled]:o===1}),onClick:()=>s(1),style:{color:e==="dark"?"white":"black"},children:"<<"}),a.jsx("button",{disabled:o===1,className:g(i.chevronButton,{[i.disabled]:o===1}),onClick:()=>s(o-1),style:{color:e==="dark"?"white":"black"},children:"<"}),a.jsx("div",{className:i.pages,children:u.map(t=>a.jsx("button",{onClick:()=>s(t),className:g(i.pageButton,{[i.active]:t===o}),style:{color:e==="dark"?"white":"black"},title:`Go to page ${t}`,children:t},t))}),a.jsx("button",{className:g(i.chevronButton,{[i.disabled]:o===n}),disabled:o===n,onClick:()=>s(o+1),style:{color:e==="dark"?"white":"black"},children:">"}),a.jsx("button",{className:g(i.chevronButton,{[i.disabled]:o===n}),disabled:o===n,onClick:()=>s(n),style:{color:e==="dark"?"white":"black"},children:">>"})]})};try{N.displayName="Pagination",N.__docgenInfo={description:"",displayName:"Pagination",props:{theme:{defaultValue:null,description:"",name:"theme",required:!0,type:{name:"ThemeMode"}},currentPage:{defaultValue:null,description:"",name:"currentPage",required:!0,type:{name:"number"}},pageSize:{defaultValue:null,description:"",name:"pageSize",required:!0,type:{name:"number"}},total:{defaultValue:null,description:"",name:"total",required:!0,type:{name:"number"}},onChangePage:{defaultValue:null,description:"",name:"onChangePage",required:!0,type:{name:"(pageNumber: number) => void"}},onChangePageSize:{defaultValue:null,description:"",name:"onChangePageSize",required:!0,type:{name:"(pageSize: number) => void"}}}}}catch{}const $={title:"GitLogPaged",component:S,parameters:{layout:"fullscreen"},args:{entries:[],showTable:!0,branchName:"release",showCommitNodeHashes:!1,showHeaders:!0,enableResize:!1,nodeTheme:"default",showGitIndex:!0,renderStrategy:"html-grid",nodeSize:20,orientation:"normal",onSelectCommit:e=>{console.info(`Selected commit ${e==null?void 0:e.hash}`)},defaultGraphWidth:120,rowSpacing:0},argTypes:{entries:{name:"Git Log Entries",table:{category:"Required Props"}},branchName:{name:"Branch Name",table:{category:"Required Props"}},showCommitNodeHashes:{name:"Show Commit Hashes",table:{category:"Visibility"}},showTable:{name:"Show Table",table:{category:"Visibility"}},showHeaders:{name:"Show Headers",table:{category:"Visibility"}},nodeTheme:{name:"Node Style",table:{category:"Visibility"},control:"radio",options:{Default:"default",Plain:"plain"}},showGitIndex:{name:"Show Git Index",table:{category:"Visibility"}},renderStrategy:{name:"Graph Render Strategy",table:{category:"Visibility"},control:"radio",options:{"HTML Grid":"html-grid",Canvas2D:"canvas"}},enableResize:{name:"Enable Resize",table:{category:"Dimensions"}},rowSpacing:{name:"Row Spacing",table:{category:"Dimensions"},control:{type:"range",min:0,max:50}},defaultGraphWidth:{name:"Graph Width",table:{category:"Dimensions"},control:{type:"range",min:0,max:500}},nodeSize:{name:"Graph Node Size",table:{category:"Dimensions"},control:{type:"range",min:8,max:30,step:2}},orientation:{name:"Graph Orientation",table:{category:"Dimensions"},control:"radio",options:{Normal:"normal",Flipped:"flipped"}},onSelectCommit:{name:"onSelectCommit",table:{category:"Callback Functions"}}}},b={render:e=>{const[l,o]=C.useState(1),[d,s]=C.useState(20),{theme:n,loading:m,colours:u,entries:t,branch:c,buildUrls:h,repository:r,headCommitHash:_,backgroundColour:z,handleChangeTheme:f,handleChangeColors:k,handleChangeRepository:G}=R({isServerSidePaginated:!0});return a.jsxs("div",{style:{background:z},className:p.container,children:[a.jsx(H,{theme:n,colours:u,repository:r,onChangeTheme:f,onChangeColours:k,onChangeRepository:G,children:a.jsx("div",{style:{marginTop:20},children:a.jsx(N,{theme:n,pageSize:d,currentPage:l,total:(t==null?void 0:t.length)??0,onChangePage:y=>o(y),onChangePageSize:y=>s(y)})})}),m&&a.jsx("div",{className:p.loading,children:a.jsx(j,{theme:n})}),!m&&t&&a.jsxs(S,{...e,theme:n,entries:t.slice(d*(l-1),d*l),branchName:c,colours:u.colors,headCommitHash:_,classes:{containerStyles:{background:z},containerClass:p.gitLogContainer},indexStatus:{added:0,modified:2,deleted:3},urls:h,children:[e.renderStrategy==="html-grid"&&a.jsx(v.GraphHTMLGrid,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize,showCommitNodeHashes:e.showCommitNodeHashes,showCommitNodeTooltips:e.showCommitNodeTooltips}),e.renderStrategy==="canvas"&&a.jsx(v.GraphCanvas2D,{nodeSize:e.nodeSize,nodeTheme:e.nodeTheme,orientation:e.orientation,enableResize:e.enableResize}),e.showTable&&a.jsx(S.Table,{className:p.table,timestampFormat:e.timestampFormat})]})]})}};var w,T,x;b.parameters={...b.parameters,docs:{...(w=b.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
            {args.renderStrategy === 'html-grid' && <GitLog.GraphHTMLGrid nodeSize={args.nodeSize} nodeTheme={args.nodeTheme} orientation={args.orientation} enableResize={args.enableResize} showCommitNodeHashes={args.showCommitNodeHashes} showCommitNodeTooltips={args.showCommitNodeTooltips} />}

            {args.renderStrategy === 'canvas' && <GitLog.GraphCanvas2D nodeSize={args.nodeSize} nodeTheme={args.nodeTheme} orientation={args.orientation} enableResize={args.enableResize} />}

            {args.showTable && <GitLogPaged.Table className={styles.table} timestampFormat={args.timestampFormat} />}
          </GitLogPaged>}
      </div>;
  }
}`,...(x=(T=b.parameters)==null?void 0:T.docs)==null?void 0:x.source}}};const O=["Demo"];export{b as Demo,O as __namedExportsOrder,$ as default};
