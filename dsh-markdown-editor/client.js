/* @local/dsh-markdown-editor — bundles Vditor 4.0.1 (MIT); see THIRD-PARTY-NOTICES.md */
(()=>{var Pi=Object.create;var dr=Object.defineProperty;var ji=Object.getOwnPropertyDescriptor;var Bi=Object.getOwnPropertyNames;var Ui=Object.getPrototypeOf,zi=Object.prototype.hasOwnProperty;var Wi=(Je,Q)=>()=>{try{return Q||Je((Q={exports:{}}).exports,Q),Q.exports}catch(F){throw Q=0,F}};var Fi=(Je,Q,F,ft)=>{if(Q&&typeof Q=="object"||typeof Q=="function")for(let ne of Bi(Q))!zi.call(Je,ne)&&ne!==F&&dr(Je,ne,{get:()=>Q[ne],enumerable:!(ft=ji(Q,ne))||ft.enumerable});return Je};var Vi=(Je,Q,F)=>(F=Je!=null?Pi(Ui(Je)):{},Fi(Q||!Je||!Je.__esModule?dr(F,"default",{value:Je,enumerable:!0}):F,Je));var fr=Wi((en,_n)=>{(function(Q,F){typeof en=="object"&&typeof _n=="object"?_n.exports=F():typeof define=="function"&&define.amd?define([],F):typeof en=="object"?en.Vditor=F():Q.Vditor=F()})(en,function(){return(()=>{var Je={132:(ne=>{var k=function(){this.Diff_Timeout=1,this.Diff_EditCost=4,this.Match_Threshold=.5,this.Match_Distance=1e3,this.Patch_DeleteThreshold=.5,this.Patch_Margin=4,this.Match_MaxBits=32},T=-1,N=1,A=0;k.Diff=function(c,p){return[c,p]},k.prototype.diff_main=function(c,p,l,g){typeof g>"u"&&(this.Diff_Timeout<=0?g=Number.MAX_VALUE:g=new Date().getTime()+this.Diff_Timeout*1e3);var b=g;if(c==null||p==null)throw new Error("Null input. (diff_main)");if(c==p)return c?[new k.Diff(A,c)]:[];typeof l>"u"&&(l=!0);var h=l,y=this.diff_commonPrefix(c,p),E=c.substring(0,y);c=c.substring(y),p=p.substring(y),y=this.diff_commonSuffix(c,p);var w=c.substring(c.length-y);c=c.substring(0,c.length-y),p=p.substring(0,p.length-y);var f=this.diff_compute_(c,p,h,b);return E&&f.unshift(new k.Diff(A,E)),w&&f.push(new k.Diff(A,w)),this.diff_cleanupMerge(f),f},k.prototype.diff_compute_=function(c,p,l,g){var b;if(!c)return[new k.Diff(N,p)];if(!p)return[new k.Diff(T,c)];var h=c.length>p.length?c:p,y=c.length>p.length?p:c,E=h.indexOf(y);if(E!=-1)return b=[new k.Diff(N,h.substring(0,E)),new k.Diff(A,y),new k.Diff(N,h.substring(E+y.length))],c.length>p.length&&(b[0][0]=b[2][0]=T),b;if(y.length==1)return[new k.Diff(T,c),new k.Diff(N,p)];var w=this.diff_halfMatch_(c,p);if(w){var f=w[0],u=w[1],s=w[2],S=w[3],D=w[4],C=this.diff_main(f,s,l,g),H=this.diff_main(u,S,l,g);return C.concat([new k.Diff(A,D)],H)}return l&&c.length>100&&p.length>100?this.diff_lineMode_(c,p,g):this.diff_bisect_(c,p,g)},k.prototype.diff_lineMode_=function(c,p,l){var g=this.diff_linesToChars_(c,p);c=g.chars1,p=g.chars2;var b=g.lineArray,h=this.diff_main(c,p,!1,l);this.diff_charsToLines_(h,b),this.diff_cleanupSemantic(h),h.push(new k.Diff(A,""));for(var y=0,E=0,w=0,f="",u="";y<h.length;){switch(h[y][0]){case N:w++,u+=h[y][1];break;case T:E++,f+=h[y][1];break;case A:if(E>=1&&w>=1){h.splice(y-E-w,E+w),y=y-E-w;for(var s=this.diff_main(f,u,!1,l),S=s.length-1;S>=0;S--)h.splice(y,0,s[S]);y=y+s.length}w=0,E=0,f="",u="";break}y++}return h.pop(),h},k.prototype.diff_bisect_=function(c,p,l){for(var g=c.length,b=p.length,h=Math.ceil((g+b)/2),y=h,E=2*h,w=new Array(E),f=new Array(E),u=0;u<E;u++)w[u]=-1,f[u]=-1;w[y+1]=0,f[y+1]=0;for(var s=g-b,S=s%2!=0,D=0,C=0,H=0,G=0,J=0;J<h&&!(new Date().getTime()>l);J++){for(var me=-J+D;me<=J-C;me+=2){var ke=y+me,ve;me==-J||me!=J&&w[ke-1]<w[ke+1]?ve=w[ke+1]:ve=w[ke-1]+1;for(var Pe=ve-me;ve<g&&Pe<b&&c.charAt(ve)==p.charAt(Pe);)ve++,Pe++;if(w[ke]=ve,ve>g)C+=2;else if(Pe>b)D+=2;else if(S){var Te=y+s-me;if(Te>=0&&Te<E&&f[Te]!=-1){var _e=g-f[Te];if(ve>=_e)return this.diff_bisectSplit_(c,p,ve,Pe,l)}}}for(var De=-J+H;De<=J-G;De+=2){var Te=y+De,_e;De==-J||De!=J&&f[Te-1]<f[Te+1]?_e=f[Te+1]:_e=f[Te-1]+1;for(var Ke=_e-De;_e<g&&Ke<b&&c.charAt(g-_e-1)==p.charAt(b-Ke-1);)_e++,Ke++;if(f[Te]=_e,_e>g)G+=2;else if(Ke>b)H+=2;else if(!S){var ke=y+s-De;if(ke>=0&&ke<E&&w[ke]!=-1){var ve=w[ke],Pe=y+ve-ke;if(_e=g-_e,ve>=_e)return this.diff_bisectSplit_(c,p,ve,Pe,l)}}}}return[new k.Diff(T,c),new k.Diff(N,p)]},k.prototype.diff_bisectSplit_=function(c,p,l,g,b){var h=c.substring(0,l),y=p.substring(0,g),E=c.substring(l),w=p.substring(g),f=this.diff_main(h,y,!1,b),u=this.diff_main(E,w,!1,b);return f.concat(u)},k.prototype.diff_linesToChars_=function(c,p){var l=[],g={};l[0]="";function b(w){for(var f="",u=0,s=-1,S=l.length;s<w.length-1;){s=w.indexOf(`
`,u),s==-1&&(s=w.length-1);var D=w.substring(u,s+1);(g.hasOwnProperty?g.hasOwnProperty(D):g[D]!==void 0)?f+=String.fromCharCode(g[D]):(S==h&&(D=w.substring(u),s=w.length),f+=String.fromCharCode(S),g[D]=S,l[S++]=D),u=s+1}return f}var h=4e4,y=b(c);h=65535;var E=b(p);return{chars1:y,chars2:E,lineArray:l}},k.prototype.diff_charsToLines_=function(c,p){for(var l=0;l<c.length;l++){for(var g=c[l][1],b=[],h=0;h<g.length;h++)b[h]=p[g.charCodeAt(h)];c[l][1]=b.join("")}},k.prototype.diff_commonPrefix=function(c,p){if(!c||!p||c.charAt(0)!=p.charAt(0))return 0;for(var l=0,g=Math.min(c.length,p.length),b=g,h=0;l<b;)c.substring(h,b)==p.substring(h,b)?(l=b,h=l):g=b,b=Math.floor((g-l)/2+l);return b},k.prototype.diff_commonSuffix=function(c,p){if(!c||!p||c.charAt(c.length-1)!=p.charAt(p.length-1))return 0;for(var l=0,g=Math.min(c.length,p.length),b=g,h=0;l<b;)c.substring(c.length-b,c.length-h)==p.substring(p.length-b,p.length-h)?(l=b,h=l):g=b,b=Math.floor((g-l)/2+l);return b},k.prototype.diff_commonOverlap_=function(c,p){var l=c.length,g=p.length;if(l==0||g==0)return 0;l>g?c=c.substring(l-g):l<g&&(p=p.substring(0,l));var b=Math.min(l,g);if(c==p)return b;for(var h=0,y=1;;){var E=c.substring(b-y),w=p.indexOf(E);if(w==-1)return h;y+=w,(w==0||c.substring(b-y)==p.substring(0,y))&&(h=y,y++)}},k.prototype.diff_halfMatch_=function(c,p){if(this.Diff_Timeout<=0)return null;var l=c.length>p.length?c:p,g=c.length>p.length?p:c;if(l.length<4||g.length*2<l.length)return null;var b=this;function h(C,H,G){for(var J=C.substring(G,G+Math.floor(C.length/4)),me=-1,ke="",ve,Pe,Te,_e;(me=H.indexOf(J,me+1))!=-1;){var De=b.diff_commonPrefix(C.substring(G),H.substring(me)),Ke=b.diff_commonSuffix(C.substring(0,G),H.substring(0,me));ke.length<Ke+De&&(ke=H.substring(me-Ke,me)+H.substring(me,me+De),ve=C.substring(0,G-Ke),Pe=C.substring(G+De),Te=H.substring(0,me-Ke),_e=H.substring(me+De))}return ke.length*2>=C.length?[ve,Pe,Te,_e,ke]:null}var y=h(l,g,Math.ceil(l.length/4)),E=h(l,g,Math.ceil(l.length/2)),w;if(!y&&!E)return null;E?y?w=y[4].length>E[4].length?y:E:w=E:w=y;var f,u,s,S;c.length>p.length?(f=w[0],u=w[1],s=w[2],S=w[3]):(s=w[0],S=w[1],f=w[2],u=w[3]);var D=w[4];return[f,u,s,S,D]},k.prototype.diff_cleanupSemantic=function(c){for(var p=!1,l=[],g=0,b=null,h=0,y=0,E=0,w=0,f=0;h<c.length;)c[h][0]==A?(l[g++]=h,y=w,E=f,w=0,f=0,b=c[h][1]):(c[h][0]==N?w+=c[h][1].length:f+=c[h][1].length,b&&b.length<=Math.max(y,E)&&b.length<=Math.max(w,f)&&(c.splice(l[g-1],0,new k.Diff(T,b)),c[l[g-1]+1][0]=N,g--,g--,h=g>0?l[g-1]:-1,y=0,E=0,w=0,f=0,b=null,p=!0)),h++;for(p&&this.diff_cleanupMerge(c),this.diff_cleanupSemanticLossless(c),h=1;h<c.length;){if(c[h-1][0]==T&&c[h][0]==N){var u=c[h-1][1],s=c[h][1],S=this.diff_commonOverlap_(u,s),D=this.diff_commonOverlap_(s,u);S>=D?(S>=u.length/2||S>=s.length/2)&&(c.splice(h,0,new k.Diff(A,s.substring(0,S))),c[h-1][1]=u.substring(0,u.length-S),c[h+1][1]=s.substring(S),h++):(D>=u.length/2||D>=s.length/2)&&(c.splice(h,0,new k.Diff(A,u.substring(0,D))),c[h-1][0]=N,c[h-1][1]=s.substring(0,s.length-D),c[h+1][0]=T,c[h+1][1]=u.substring(D),h++),h++}h++}},k.prototype.diff_cleanupSemanticLossless=function(c){function p(D,C){if(!D||!C)return 6;var H=D.charAt(D.length-1),G=C.charAt(0),J=H.match(k.nonAlphaNumericRegex_),me=G.match(k.nonAlphaNumericRegex_),ke=J&&H.match(k.whitespaceRegex_),ve=me&&G.match(k.whitespaceRegex_),Pe=ke&&H.match(k.linebreakRegex_),Te=ve&&G.match(k.linebreakRegex_),_e=Pe&&D.match(k.blanklineEndRegex_),De=Te&&C.match(k.blanklineStartRegex_);return _e||De?5:Pe||Te?4:J&&!ke&&ve?3:ke||ve?2:J||me?1:0}for(var l=1;l<c.length-1;){if(c[l-1][0]==A&&c[l+1][0]==A){var g=c[l-1][1],b=c[l][1],h=c[l+1][1],y=this.diff_commonSuffix(g,b);if(y){var E=b.substring(b.length-y);g=g.substring(0,g.length-y),b=E+b.substring(0,b.length-y),h=E+h}for(var w=g,f=b,u=h,s=p(g,b)+p(b,h);b.charAt(0)===h.charAt(0);){g+=b.charAt(0),b=b.substring(1)+h.charAt(0),h=h.substring(1);var S=p(g,b)+p(b,h);S>=s&&(s=S,w=g,f=b,u=h)}c[l-1][1]!=w&&(w?c[l-1][1]=w:(c.splice(l-1,1),l--),c[l][1]=f,u?c[l+1][1]=u:(c.splice(l+1,1),l--))}l++}},k.nonAlphaNumericRegex_=/[^a-zA-Z0-9]/,k.whitespaceRegex_=/\s/,k.linebreakRegex_=/[\r\n]/,k.blanklineEndRegex_=/\n\r?\n$/,k.blanklineStartRegex_=/^\r?\n\r?\n/,k.prototype.diff_cleanupEfficiency=function(c){for(var p=!1,l=[],g=0,b=null,h=0,y=!1,E=!1,w=!1,f=!1;h<c.length;)c[h][0]==A?(c[h][1].length<this.Diff_EditCost&&(w||f)?(l[g++]=h,y=w,E=f,b=c[h][1]):(g=0,b=null),w=f=!1):(c[h][0]==T?f=!0:w=!0,b&&(y&&E&&w&&f||b.length<this.Diff_EditCost/2&&y+E+w+f==3)&&(c.splice(l[g-1],0,new k.Diff(T,b)),c[l[g-1]+1][0]=N,g--,b=null,y&&E?(w=f=!0,g=0):(g--,h=g>0?l[g-1]:-1,w=f=!1),p=!0)),h++;p&&this.diff_cleanupMerge(c)},k.prototype.diff_cleanupMerge=function(c){c.push(new k.Diff(A,""));for(var p=0,l=0,g=0,b="",h="",y;p<c.length;)switch(c[p][0]){case N:g++,h+=c[p][1],p++;break;case T:l++,b+=c[p][1],p++;break;case A:l+g>1?(l!==0&&g!==0&&(y=this.diff_commonPrefix(h,b),y!==0&&(p-l-g>0&&c[p-l-g-1][0]==A?c[p-l-g-1][1]+=h.substring(0,y):(c.splice(0,0,new k.Diff(A,h.substring(0,y))),p++),h=h.substring(y),b=b.substring(y)),y=this.diff_commonSuffix(h,b),y!==0&&(c[p][1]=h.substring(h.length-y)+c[p][1],h=h.substring(0,h.length-y),b=b.substring(0,b.length-y))),p-=l+g,c.splice(p,l+g),b.length&&(c.splice(p,0,new k.Diff(T,b)),p++),h.length&&(c.splice(p,0,new k.Diff(N,h)),p++),p++):p!==0&&c[p-1][0]==A?(c[p-1][1]+=c[p][1],c.splice(p,1)):p++,g=0,l=0,b="",h="";break}c[c.length-1][1]===""&&c.pop();var E=!1;for(p=1;p<c.length-1;)c[p-1][0]==A&&c[p+1][0]==A&&(c[p][1].substring(c[p][1].length-c[p-1][1].length)==c[p-1][1]?(c[p][1]=c[p-1][1]+c[p][1].substring(0,c[p][1].length-c[p-1][1].length),c[p+1][1]=c[p-1][1]+c[p+1][1],c.splice(p-1,1),E=!0):c[p][1].substring(0,c[p+1][1].length)==c[p+1][1]&&(c[p-1][1]+=c[p+1][1],c[p][1]=c[p][1].substring(c[p+1][1].length)+c[p+1][1],c.splice(p+1,1),E=!0)),p++;E&&this.diff_cleanupMerge(c)},k.prototype.diff_xIndex=function(c,p){var l=0,g=0,b=0,h=0,y;for(y=0;y<c.length&&(c[y][0]!==N&&(l+=c[y][1].length),c[y][0]!==T&&(g+=c[y][1].length),!(l>p));y++)b=l,h=g;return c.length!=y&&c[y][0]===T?h:h+(p-b)},k.prototype.diff_prettyHtml=function(c){for(var p=[],l=/&/g,g=/</g,b=/>/g,h=/\n/g,y=0;y<c.length;y++){var E=c[y][0],w=c[y][1],f=w.replace(l,"&amp;").replace(g,"&lt;").replace(b,"&gt;").replace(h,"&para;<br>");switch(E){case N:p[y]='<ins style="background:#e6ffe6;">'+f+"</ins>";break;case T:p[y]='<del style="background:#ffe6e6;">'+f+"</del>";break;case A:p[y]="<span>"+f+"</span>";break}}return p.join("")},k.prototype.diff_text1=function(c){for(var p=[],l=0;l<c.length;l++)c[l][0]!==N&&(p[l]=c[l][1]);return p.join("")},k.prototype.diff_text2=function(c){for(var p=[],l=0;l<c.length;l++)c[l][0]!==T&&(p[l]=c[l][1]);return p.join("")},k.prototype.diff_levenshtein=function(c){for(var p=0,l=0,g=0,b=0;b<c.length;b++){var h=c[b][0],y=c[b][1];switch(h){case N:l+=y.length;break;case T:g+=y.length;break;case A:p+=Math.max(l,g),l=0,g=0;break}}return p+=Math.max(l,g),p},k.prototype.diff_toDelta=function(c){for(var p=[],l=0;l<c.length;l++)switch(c[l][0]){case N:p[l]="+"+encodeURI(c[l][1]);break;case T:p[l]="-"+c[l][1].length;break;case A:p[l]="="+c[l][1].length;break}return p.join("	").replace(/%20/g," ")},k.prototype.diff_fromDelta=function(c,p){for(var l=[],g=0,b=0,h=p.split(/\t/g),y=0;y<h.length;y++){var E=h[y].substring(1);switch(h[y].charAt(0)){case"+":try{l[g++]=new k.Diff(N,decodeURI(E))}catch{throw new Error("Illegal escape in diff_fromDelta: "+E)}break;case"-":case"=":var w=parseInt(E,10);if(isNaN(w)||w<0)throw new Error("Invalid number in diff_fromDelta: "+E);var f=c.substring(b,b+=w);h[y].charAt(0)=="="?l[g++]=new k.Diff(A,f):l[g++]=new k.Diff(T,f);break;default:if(h[y])throw new Error("Invalid diff operation in diff_fromDelta: "+h[y])}}if(b!=c.length)throw new Error("Delta length ("+b+") does not equal source text length ("+c.length+").");return l},k.prototype.match_main=function(c,p,l){if(c==null||p==null||l==null)throw new Error("Null input. (match_main)");return l=Math.max(0,Math.min(l,c.length)),c==p?0:c.length?c.substring(l,l+p.length)==p?l:this.match_bitap_(c,p,l):-1},k.prototype.match_bitap_=function(c,p,l){if(p.length>this.Match_MaxBits)throw new Error("Pattern too long for this browser.");var g=this.match_alphabet_(p),b=this;function h(ve,Pe){var Te=ve/p.length,_e=Math.abs(l-Pe);return b.Match_Distance?Te+_e/b.Match_Distance:_e?1:Te}var y=this.Match_Threshold,E=c.indexOf(p,l);E!=-1&&(y=Math.min(h(0,E),y),E=c.lastIndexOf(p,l+p.length),E!=-1&&(y=Math.min(h(0,E),y)));var w=1<<p.length-1;E=-1;for(var f,u,s=p.length+c.length,S,D=0;D<p.length;D++){for(f=0,u=s;f<u;)h(D,l+u)<=y?f=u:s=u,u=Math.floor((s-f)/2+f);s=u;var C=Math.max(1,l-u+1),H=Math.min(l+u,c.length)+p.length,G=Array(H+2);G[H+1]=(1<<D)-1;for(var J=H;J>=C;J--){var me=g[c.charAt(J-1)];if(D===0?G[J]=(G[J+1]<<1|1)&me:G[J]=(G[J+1]<<1|1)&me|((S[J+1]|S[J])<<1|1)|S[J+1],G[J]&w){var ke=h(D,J-1);if(ke<=y)if(y=ke,E=J-1,E>l)C=Math.max(1,2*l-E);else break}}if(h(D+1,l)>y)break;S=G}return E},k.prototype.match_alphabet_=function(c){for(var p={},l=0;l<c.length;l++)p[c.charAt(l)]=0;for(var l=0;l<c.length;l++)p[c.charAt(l)]|=1<<c.length-l-1;return p},k.prototype.patch_addContext_=function(c,p){if(p.length!=0){if(c.start2===null)throw Error("patch not initialized");for(var l=p.substring(c.start2,c.start2+c.length1),g=0;p.indexOf(l)!=p.lastIndexOf(l)&&l.length<this.Match_MaxBits-this.Patch_Margin-this.Patch_Margin;)g+=this.Patch_Margin,l=p.substring(c.start2-g,c.start2+c.length1+g);g+=this.Patch_Margin;var b=p.substring(c.start2-g,c.start2);b&&c.diffs.unshift(new k.Diff(A,b));var h=p.substring(c.start2+c.length1,c.start2+c.length1+g);h&&c.diffs.push(new k.Diff(A,h)),c.start1-=b.length,c.start2-=b.length,c.length1+=b.length+h.length,c.length2+=b.length+h.length}},k.prototype.patch_make=function(c,p,l){var g,b;if(typeof c=="string"&&typeof p=="string"&&typeof l>"u")g=c,b=this.diff_main(g,p,!0),b.length>2&&(this.diff_cleanupSemantic(b),this.diff_cleanupEfficiency(b));else if(c&&typeof c=="object"&&typeof p>"u"&&typeof l>"u")b=c,g=this.diff_text1(b);else if(typeof c=="string"&&p&&typeof p=="object"&&typeof l>"u")g=c,b=p;else if(typeof c=="string"&&typeof p=="string"&&l&&typeof l=="object")g=c,b=l;else throw new Error("Unknown call format to patch_make.");if(b.length===0)return[];for(var h=[],y=new k.patch_obj,E=0,w=0,f=0,u=g,s=g,S=0;S<b.length;S++){var D=b[S][0],C=b[S][1];switch(!E&&D!==A&&(y.start1=w,y.start2=f),D){case N:y.diffs[E++]=b[S],y.length2+=C.length,s=s.substring(0,f)+C+s.substring(f);break;case T:y.length1+=C.length,y.diffs[E++]=b[S],s=s.substring(0,f)+s.substring(f+C.length);break;case A:C.length<=2*this.Patch_Margin&&E&&b.length!=S+1?(y.diffs[E++]=b[S],y.length1+=C.length,y.length2+=C.length):C.length>=2*this.Patch_Margin&&E&&(this.patch_addContext_(y,u),h.push(y),y=new k.patch_obj,E=0,u=s,w=f);break}D!==N&&(w+=C.length),D!==T&&(f+=C.length)}return E&&(this.patch_addContext_(y,u),h.push(y)),h},k.prototype.patch_deepCopy=function(c){for(var p=[],l=0;l<c.length;l++){var g=c[l],b=new k.patch_obj;b.diffs=[];for(var h=0;h<g.diffs.length;h++)b.diffs[h]=new k.Diff(g.diffs[h][0],g.diffs[h][1]);b.start1=g.start1,b.start2=g.start2,b.length1=g.length1,b.length2=g.length2,p[l]=b}return p},k.prototype.patch_apply=function(c,p){if(c.length==0)return[p,[]];c=this.patch_deepCopy(c);var l=this.patch_addPadding(c);p=l+p+l,this.patch_splitMax(c);for(var g=0,b=[],h=0;h<c.length;h++){var y=c[h].start2+g,E=this.diff_text1(c[h].diffs),w,f=-1;if(E.length>this.Match_MaxBits?(w=this.match_main(p,E.substring(0,this.Match_MaxBits),y),w!=-1&&(f=this.match_main(p,E.substring(E.length-this.Match_MaxBits),y+E.length-this.Match_MaxBits),(f==-1||w>=f)&&(w=-1))):w=this.match_main(p,E,y),w==-1)b[h]=!1,g-=c[h].length2-c[h].length1;else{b[h]=!0,g=w-y;var u;if(f==-1?u=p.substring(w,w+E.length):u=p.substring(w,f+this.Match_MaxBits),E==u)p=p.substring(0,w)+this.diff_text2(c[h].diffs)+p.substring(w+E.length);else{var s=this.diff_main(E,u,!1);if(E.length>this.Match_MaxBits&&this.diff_levenshtein(s)/E.length>this.Patch_DeleteThreshold)b[h]=!1;else{this.diff_cleanupSemanticLossless(s);for(var S=0,D,C=0;C<c[h].diffs.length;C++){var H=c[h].diffs[C];H[0]!==A&&(D=this.diff_xIndex(s,S)),H[0]===N?p=p.substring(0,w+D)+H[1]+p.substring(w+D):H[0]===T&&(p=p.substring(0,w+D)+p.substring(w+this.diff_xIndex(s,S+H[1].length))),H[0]!==T&&(S+=H[1].length)}}}}}return p=p.substring(l.length,p.length-l.length),[p,b]},k.prototype.patch_addPadding=function(c){for(var p=this.Patch_Margin,l="",g=1;g<=p;g++)l+=String.fromCharCode(g);for(var g=0;g<c.length;g++)c[g].start1+=p,c[g].start2+=p;var b=c[0],h=b.diffs;if(h.length==0||h[0][0]!=A)h.unshift(new k.Diff(A,l)),b.start1-=p,b.start2-=p,b.length1+=p,b.length2+=p;else if(p>h[0][1].length){var y=p-h[0][1].length;h[0][1]=l.substring(h[0][1].length)+h[0][1],b.start1-=y,b.start2-=y,b.length1+=y,b.length2+=y}if(b=c[c.length-1],h=b.diffs,h.length==0||h[h.length-1][0]!=A)h.push(new k.Diff(A,l)),b.length1+=p,b.length2+=p;else if(p>h[h.length-1][1].length){var y=p-h[h.length-1][1].length;h[h.length-1][1]+=l.substring(0,y),b.length1+=y,b.length2+=y}return l},k.prototype.patch_splitMax=function(c){for(var p=this.Match_MaxBits,l=0;l<c.length;l++)if(!(c[l].length1<=p)){var g=c[l];c.splice(l--,1);for(var b=g.start1,h=g.start2,y="";g.diffs.length!==0;){var E=new k.patch_obj,w=!0;for(E.start1=b-y.length,E.start2=h-y.length,y!==""&&(E.length1=E.length2=y.length,E.diffs.push(new k.Diff(A,y)));g.diffs.length!==0&&E.length1<p-this.Patch_Margin;){var f=g.diffs[0][0],u=g.diffs[0][1];f===N?(E.length2+=u.length,h+=u.length,E.diffs.push(g.diffs.shift()),w=!1):f===T&&E.diffs.length==1&&E.diffs[0][0]==A&&u.length>2*p?(E.length1+=u.length,b+=u.length,w=!1,E.diffs.push(new k.Diff(f,u)),g.diffs.shift()):(u=u.substring(0,p-E.length1-this.Patch_Margin),E.length1+=u.length,b+=u.length,f===A?(E.length2+=u.length,h+=u.length):w=!1,E.diffs.push(new k.Diff(f,u)),u==g.diffs[0][1]?g.diffs.shift():g.diffs[0][1]=g.diffs[0][1].substring(u.length))}y=this.diff_text2(E.diffs),y=y.substring(y.length-this.Patch_Margin);var s=this.diff_text1(g.diffs).substring(0,this.Patch_Margin);s!==""&&(E.length1+=s.length,E.length2+=s.length,E.diffs.length!==0&&E.diffs[E.diffs.length-1][0]===A?E.diffs[E.diffs.length-1][1]+=s:E.diffs.push(new k.Diff(A,s))),w||c.splice(++l,0,E)}}},k.prototype.patch_toText=function(c){for(var p=[],l=0;l<c.length;l++)p[l]=c[l];return p.join("")},k.prototype.patch_fromText=function(c){var p=[];if(!c)return p;for(var l=c.split(`
`),g=0,b=/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;g<l.length;){var h=l[g].match(b);if(!h)throw new Error("Invalid patch string: "+l[g]);var y=new k.patch_obj;for(p.push(y),y.start1=parseInt(h[1],10),h[2]===""?(y.start1--,y.length1=1):h[2]=="0"?y.length1=0:(y.start1--,y.length1=parseInt(h[2],10)),y.start2=parseInt(h[3],10),h[4]===""?(y.start2--,y.length2=1):h[4]=="0"?y.length2=0:(y.start2--,y.length2=parseInt(h[4],10)),g++;g<l.length;){var E=l[g].charAt(0);try{var w=decodeURI(l[g].substring(1))}catch{throw new Error("Illegal escape in patch_fromText: "+w)}if(E=="-")y.diffs.push(new k.Diff(T,w));else if(E=="+")y.diffs.push(new k.Diff(N,w));else if(E==" ")y.diffs.push(new k.Diff(A,w));else{if(E=="@")break;if(E!=="")throw new Error('Invalid patch mode "'+E+'" in: '+w)}g++}}return p},k.patch_obj=function(){this.diffs=[],this.start1=null,this.start2=null,this.length1=0,this.length2=0},k.patch_obj.prototype.toString=function(){var c,p;this.length1===0?c=this.start1+",0":this.length1==1?c=this.start1+1:c=this.start1+1+","+this.length1,this.length2===0?p=this.start2+",0":this.length2==1?p=this.start2+1:p=this.start2+1+","+this.length2;for(var l=["@@ -"+c+" +"+p+` @@
`],g,b=0;b<this.diffs.length;b++){switch(this.diffs[b][0]){case N:g="+";break;case T:g="-";break;case A:g=" ";break}l[b+1]=g+encodeURI(this.diffs[b][1])+`
`}return l.join("").replace(/%20/g," ")},ne.exports=k,ne.exports.diff_match_patch=k,ne.exports.DIFF_DELETE=T,ne.exports.DIFF_INSERT=N,ne.exports.DIFF_EQUAL=A}),408:((ne,k,T)=>{"use strict";T.d(k,{default:()=>bt});var N=T(135),A=T(840),c=T(775),p=T(428),l=T(325),g=T(483),b=T(999),h=function(Y){Y===void 0&&(Y=document);var de=function(B){var q=document.createElement("img");q.src=B.getAttribute("data-src"),q.addEventListener("load",function(){!B.getAttribute("style")&&!B.getAttribute("class")&&!B.getAttribute("width")&&!B.getAttribute("height")&&q.naturalHeight>q.naturalWidth&&q.naturalWidth/q.naturalHeight<document.querySelector(".vditor-reset").clientWidth/(window.innerHeight-40)&&q.naturalHeight>window.innerHeight-40&&(B.style.height=window.innerHeight-40+"px"),B.src=q.src}),B.removeAttribute("data-src")};if(!("IntersectionObserver"in window))return Y.querySelectorAll("img").forEach(function(B){B.getAttribute("data-src")&&de(B)}),!1;window.vditorImageIntersectionObserver?(window.vditorImageIntersectionObserver.disconnect(),Y.querySelectorAll("img").forEach(function(B){window.vditorImageIntersectionObserver.observe(B)})):(window.vditorImageIntersectionObserver=new IntersectionObserver(function(B){B.forEach(function(q){(typeof q.isIntersecting>"u"?q.intersectionRatio!==0:q.isIntersecting)&&q.target.getAttribute("data-src")&&de(q.target)})}),Y.querySelectorAll("img").forEach(function(B){window.vditorImageIntersectionObserver.observe(B)}))},y=T(472),E=T(280),w=T(637),f=T(825),u=T(11),s=T(194),S=T(436),D=T(229),C=T(497),H=T(145),G=T(538),J=T(413),me=T(106),ke=T(673),ve=function(Y){document.querySelectorAll(".vditor-anchor").forEach(function(de){Y===1&&de.classList.add("vditor-anchor--left"),de.onclick=function(){var B=de.getAttribute("href").substr(1),q=document.getElementById("vditorAnchor-"+B).offsetTop;document.querySelector("html").scrollTop=q}}),window.onhashchange=function(){var de=document.getElementById("vditorAnchor-"+decodeURIComponent(window.location.hash.substr(1)));de&&(document.querySelector("html").scrollTop=de.offsetTop)}},Pe=T(161),Te=T(214),_e=T(810),De=function(Y,de){if(de===void 0&&(de="zh_CN"),!(typeof speechSynthesis>"u"||typeof SpeechSynthesisUtterance>"u")){var B=function(){var We=speechSynthesis.getVoices(),oe,x;return We.forEach(function(O){O.lang===de.replace("_","-")&&(oe=O),O.default&&(x=O)}),oe||(oe=x),oe},q='<svg><use xlink:href="#vditor-icon-play"></use></svg>',Ce='<svg><use xlink:href="#vditor-icon-pause"></use></svg>';document.getElementById("vditorIconScript")||(q='<svg viewBox="0 0 32 32"><path d="M3.436 0l25.128 16-25.128 16v-32z"></path></svg>',Ce='<svg viewBox="0 0 32 32"><path d="M20.617 0h9.128v32h-9.128v-32zM2.255 32v-32h9.128v32h-9.128z"></path></svg>');var ee=document.querySelector(".vditor-speech");ee||(ee=document.createElement("button"),ee.className="vditor-speech",Y.insertAdjacentElement("beforeend",ee),speechSynthesis.onvoiceschanged!==void 0&&(speechSynthesis.onvoiceschanged=B));var He=B(),Me=new SpeechSynthesisUtterance;Me.voice=He,Me.onend=Me.onerror=function(){ee.style.display="none",speechSynthesis.cancel(),ee.classList.remove("vditor-speech--current"),ee.innerHTML=q},Y.addEventListener(window.ontouchstart!==void 0?"touchend":"click",function(We){var oe=We.target;if(oe.classList.contains("vditor-speech")||oe.parentElement.classList.contains("vditor-speech")){ee.classList.contains("vditor-speech--current")?speechSynthesis.speaking&&(speechSynthesis.paused?(speechSynthesis.resume(),ee.innerHTML=Ce):(speechSynthesis.pause(),ee.innerHTML=q)):(Me.text=ee.getAttribute("data-text"),speechSynthesis.speak(Me),ee.classList.add("vditor-speech--current"),ee.innerHTML=Ce),(0,_e.Hc)(window.vditorSpeechRange),Y.focus();return}if(ee.style.display="none",speechSynthesis.cancel(),ee.classList.remove("vditor-speech--current"),ee.innerHTML=q,getSelection().rangeCount!==0){var x=getSelection().getRangeAt(0),O=x.toString().trim();if(O){window.vditorSpeechRange=x.cloneRange();var R=x.getBoundingClientRect();ee.innerHTML=q,ee.style.display="block",ee.style.top=R.top+R.height+document.querySelector("html").scrollTop-20+"px",window.ontouchstart!==void 0?ee.style.left=We.changedTouches[We.changedTouches.length-1].pageX+2+"px":ee.style.left=We.clientX+2+"px",ee.setAttribute("data-text",O)}}})}},Ke=function(Y,de,B,q){function Ce(ee){return ee instanceof B?ee:new B(function(He){He(ee)})}return new(B||(B=Promise))(function(ee,He){function Me(x){try{oe(q.next(x))}catch(O){He(O)}}function We(x){try{oe(q.throw(x))}catch(O){He(O)}}function oe(x){x.done?ee(x.value):Ce(x.value).then(Me,We)}oe((q=q.apply(Y,de||[])).next())})},St=function(Y,de){var B={label:0,sent:function(){if(ee[0]&1)throw ee[1];return ee[1]},trys:[],ops:[]},q,Ce,ee,He;return He={next:Me(0),throw:Me(1),return:Me(2)},typeof Symbol=="function"&&(He[Symbol.iterator]=function(){return this}),He;function Me(oe){return function(x){return We([oe,x])}}function We(oe){if(q)throw new TypeError("Generator is already executing.");for(;He&&(He=0,oe[0]&&(B=0)),B;)try{if(q=1,Ce&&(ee=oe[0]&2?Ce.return:oe[0]?Ce.throw||((ee=Ce.return)&&ee.call(Ce),0):Ce.next)&&!(ee=ee.call(Ce,oe[1])).done)return ee;switch(Ce=0,ee&&(oe=[oe[0]&2,ee.value]),oe[0]){case 0:case 1:ee=oe;break;case 4:return B.label++,{value:oe[1],done:!1};case 5:B.label++,Ce=oe[1],oe=[0];continue;case 7:oe=B.ops.pop(),B.trys.pop();continue;default:if(ee=B.trys,!(ee=ee.length>0&&ee[ee.length-1])&&(oe[0]===6||oe[0]===2)){B=0;continue}if(oe[0]===3&&(!ee||oe[1]>ee[0]&&oe[1]<ee[3])){B.label=oe[1];break}if(oe[0]===6&&B.label<ee[1]){B.label=ee[1],ee=oe;break}if(ee&&B.label<ee[2]){B.label=ee[2],B.ops.push(oe);break}ee[2]&&B.ops.pop(),B.trys.pop();continue}oe=de.call(Y,B)}catch(x){oe=[6,x],Ce=0}finally{q=ee=0}if(oe[0]&5)throw oe[1];return{value:oe[0]?oe[1]:void 0,done:!0}}},Tt=function(Y){var de,B={anchor:0,cdn:H.g.CDN,customEmoji:{},emojiPath:"".concat(H.g.CDN,"/dist/images/emoji"),hljs:H.g.HLJS_OPTIONS,icon:"ant",lang:"zh_CN",markdown:H.g.MARKDOWN_OPTIONS,math:H.g.MATH_OPTIONS,mode:"light",speech:{enable:!1},render:{media:{enable:!0}},theme:H.g.THEME_OPTIONS};return Y.cdn&&(!((de=Y.theme)===null||de===void 0)&&de.path||(B.theme.path="".concat(Y.cdn,"/dist/css/content-theme")),Y.emojiPath||(B.emojiPath="".concat(Y.cdn,"/dist/images/emoji"))),(0,ke.T)(B,Y)},je=function(Y,de){var B=Tt(de);return(0,J.G)("".concat(B.cdn,"/dist/js/lute/lute.min.js"),"vditorLuteScript").then(function(){var q=(0,Te.X)({autoSpace:B.markdown.autoSpace,callout:B.markdown.callout,inlineMath:B.markdown.inlineMath,gfmAutoLink:B.markdown.gfmAutoLink,codeBlockPreview:B.markdown.codeBlockPreview,emojiSite:B.emojiPath,emojis:B.customEmoji,fixTermTypo:B.markdown.fixTermTypo,footnotes:B.markdown.footnotes,headingAnchor:B.anchor!==0,inlineMathDigit:B.math.inlineDigit,lazyLoadImage:B.lazyLoadImage,linkBase:B.markdown.linkBase,linkPrefix:B.markdown.linkPrefix,listStyle:B.markdown.listStyle,mark:B.markdown.mark,mathBlockPreview:B.markdown.mathBlockPreview,paragraphBeginningSpace:B.markdown.paragraphBeginningSpace,sanitize:B.markdown.sanitize,sub:B.markdown.sub,sup:B.markdown.sup,toc:B.markdown.toc});return de?.renderers&&q.SetJSRenderers({renderers:{Md2HTML:de.renderers}}),q.SetHeadingID(!0),(0,Pe.V)(q.Md2HTML(Y),B.markdown.imageCaption)})},M=function(Y,de,B){return Ke(void 0,void 0,void 0,function(){var q,Ce,ee,He;return St(this,function(Me){switch(Me.label){case 0:return q=Tt(B),[4,je(de,q)];case 1:if(Ce=Me.sent(),q.transform&&(Ce=q.transform(Ce)),Y.innerHTML=Ce,Y.classList.add("vditor-reset"),q.i18n)return[3,5];if(["de_DE","en_US","es_ES","fr_FR","ja_JP","ko_KR","pt_BR","ru_RU","sv_SE","vi_VN","zh_CN","zh_TW"].includes(q.lang))return[3,2];throw new Error("options.lang error, see https://ld246.com/article/1549638745630#options");case 2:return ee="vditorI18nScript",He=ee+q.lang,document.querySelectorAll('head script[id^="'.concat(ee,'"]')).forEach(function(We){We.id!==He&&document.head.removeChild(We)}),[4,(0,J.G)("".concat(q.cdn,"/dist/js/i18n/").concat(q.lang,".js"),He)];case 3:Me.sent(),Me.label=4;case 4:return[3,6];case 5:window.VditorI18n=q.i18n,Me.label=6;case 6:return q.icon?[4,(0,J.G)("".concat(q.cdn,"/dist/js/icons/").concat(q.icon,".js"),"vditorIconScript")]:[3,8];case 7:Me.sent(),Me.label=8;case 8:return(0,G.Z)(q.theme.current,q.theme.path),q.anchor===1&&Y.classList.add("vditor-reset--anchor"),(0,p.O)(Y,q.hljs),(0,b.s)(q.hljs,Y,q.cdn),(0,y.H)(Y,{cdn:q.cdn,math:q.math}),(0,w.i)(Y,q.cdn,q.mode),(0,f.J)(Y,q.cdn,q.mode),(0,u.K)(Y,q.cdn),(0,l.P)(Y,q.cdn),(0,g.v)(Y,q.cdn),(0,C.F)(Y,q.cdn),(0,c.p)(Y,q.cdn,q.mode),(0,s.P)(Y,q.cdn,q.mode),(0,D.B)(Y,q.cdn),(0,N.Q)(Y,q.cdn),q.render.media.enable&&(0,E.Y)(Y),q.speech.enable&&De(Y),q.anchor!==0&&ve(q.anchor),q.after&&q.after(),q.lazyLoadImage&&h(Y),Y.addEventListener("click",function(We){var oe=(0,me.lG)(We.target,"SPAN");if(oe&&(0,me.fb)(oe,"vditor-toc")){var x=Y.querySelector("#"+oe.getAttribute("data-target-id"));x&&window.scrollTo(window.scrollX,x.offsetTop);return}}),[2]}})})},at=T(190),Ot=T(580),gt=(function(){function Y(){}return Y.adapterRender=A,Y.previewImage=at.E,Y.codeRender=p.O,Y.graphvizRender=g.v,Y.wavedromRender=C.F,Y.highlightRender=b.s,Y.mathRender=y.H,Y.mermaidRender=w.i,Y.SMILESRender=f.J,Y.markmapRender=u.K,Y.flowchartRender=l.P,Y.chartRender=c.p,Y.abcRender=N.Q,Y.mindmapRender=s.P,Y.plantumlRender=D.B,Y.outlineRender=S.k,Y.mediaRender=E.Y,Y.speechRender=De,Y.lazyLoadImageRender=h,Y.md2html=je,Y.preview=M,Y.setCodeTheme=Ot.Y,Y.setContentTheme=G.Z,Y})();let bt=gt}),145:((ne,k,T)=>{"use strict";T.d(k,{H:()=>N,g:()=>A});var N="4.0.1",A=(function(){function c(){}return c.ZWSP="\u200B",c.DROP_EDITOR="application/editor",c.MOBILE_WIDTH=520,c.CLASS_MENU_DISABLED="vditor-menu--disabled",c.EDIT_TOOLBARS=["emoji","headings","bold","italic","strike","link","list","ordered-list","outdent","indent","check","line","quote","code","inline-code","insert-after","insert-before","upload","record","table"],c.CODE_THEME=["a11y-dark","agate","an-old-hope","androidstudio","arta","atom-one-dark","atom-one-dark-reasonable","base16/3024","base16/apathy","base16/apprentice","base16/ashes","base16/atelier-cave","base16/atelier-dune","base16/atelier-estuary","base16/atelier-forest","base16/atelier-heath","base16/atelier-lakeside","base16/atelier-plateau","base16/atelier-savanna","base16/atelier-seaside","base16/atelier-sulphurpool","base16/atlas","base16/bespin","base16/black-metal","base16/black-metal-bathory","base16/black-metal-burzum","base16/black-metal-dark-funeral","base16/black-metal-gorgoroth","base16/black-metal-immortal","base16/black-metal-khold","base16/black-metal-marduk","base16/black-metal-mayhem","base16/black-metal-nile","base16/black-metal-venom","base16/brewer","base16/bright","base16/brogrammer","base16/brush-trees-dark","base16/chalk","base16/circus","base16/classic-dark","base16/codeschool","base16/colors","base16/danqing","base16/darcula","base16/dark-violet","base16/darkmoss","base16/darktooth","base16/decaf","base16/default-dark","base16/dracula","base16/edge-dark","base16/eighties","base16/embers","base16/equilibrium-dark","base16/equilibrium-gray-dark","base16/espresso","base16/eva","base16/eva-dim","base16/flat","base16/framer","base16/gigavolt","base16/google-dark","base16/grayscale-dark","base16/green-screen","base16/gruvbox-dark-hard","base16/gruvbox-dark-medium","base16/gruvbox-dark-pale","base16/gruvbox-dark-soft","base16/hardcore","base16/harmonic16-dark","base16/heetch-dark","base16/helios","base16/hopscotch","base16/horizon-dark","base16/humanoid-dark","base16/ia-dark","base16/icy-dark","base16/ir-black","base16/isotope","base16/kimber","base16/london-tube","base16/macintosh","base16/marrakesh","base16/materia","base16/material","base16/material-darker","base16/material-palenight","base16/material-vivid","base16/mellow-purple","base16/mocha","base16/monokai","base16/nebula","base16/nord","base16/nova","base16/ocean","base16/oceanicnext","base16/onedark","base16/outrun-dark","base16/papercolor-dark","base16/paraiso","base16/pasque","base16/phd","base16/pico","base16/pop","base16/porple","base16/qualia","base16/railscasts","base16/rebecca","base16/ros-pine","base16/ros-pine-moon","base16/sandcastle","base16/seti-ui","base16/silk-dark","base16/snazzy","base16/solar-flare","base16/solarized-dark","base16/spacemacs","base16/summercamp","base16/summerfruit-dark","base16/synth-midnight-terminal-dark","base16/tango","base16/tender","base16/tomorrow-night","base16/twilight","base16/unikitty-dark","base16/vulcan","base16/windows-10","base16/windows-95","base16/windows-high-contrast","base16/windows-nt","base16/woodland","base16/xcode-dusk","base16/zenburn","codepen-embed","dark","devibeans","far","felipec","github-dark","github-dark-dimmed","gml","gradient-dark","hybrid","ir-black","isbl-editor-dark","kimbie-dark","lioshi","monokai","monokai-sublime","night-owl","nnfx-dark","nord","obsidian","panda-syntax-dark","paraiso-dark","pojoaque","qtcreator-dark","rainbow","shades-of-purple","srcery","stackoverflow-dark","sunburst","tomorrow-night-blue","tomorrow-night-bright","tokyo-night-dark","vs2015","xt256","ant-design","a11y-light","arduino-light","ascetic","atom-one-light","base16/atelier-cave-light","base16/atelier-dune-light","base16/atelier-estuary-light","base16/atelier-forest-light","base16/atelier-heath-light","base16/atelier-lakeside-light","base16/atelier-plateau-light","base16/atelier-savanna-light","base16/atelier-seaside-light","base16/atelier-sulphurpool-light","base16/brush-trees","base16/classic-light","base16/cupcake","base16/cupertino","base16/default-light","base16/dirtysea","base16/edge-light","base16/equilibrium-gray-light","base16/equilibrium-light","base16/fruit-soda","base16/github","base16/google-light","base16/grayscale-light","base16/gruvbox-light-hard","base16/gruvbox-light-medium","base16/gruvbox-light-soft","base16/harmonic16-light","base16/heetch-light","base16/humanoid-light","base16/horizon-light","base16/ia-light","base16/material-lighter","base16/mexico-light","base16/one-light","base16/papercolor-light","base16/ros-pine-dawn","base16/sagelight","base16/shapeshifter","base16/silk-light","base16/solar-flare-light","base16/solarized-light","base16/summerfruit-light","base16/synth-midnight-terminal-light","base16/tomorrow","base16/unikitty-light","base16/windows-10-light","base16/windows-95-light","base16/windows-high-contrast-light","brown-paper","base16/windows-nt-light","color-brewer","docco","foundation","github","googlecode","gradient-light","grayscale","idea","intellij-light","isbl-editor-light","kimbie-light","lightfair","magula","mono-blue","nnfx-light","panda-syntax-light","paraiso-light","purebasic","qtcreator-light","routeros","school-book","stackoverflow-light","tokyo-night-light","vs","xcode","default"],c.ALIAS_CODE_LANGUAGES=["abc","plantuml","mermaid","flowchart","echarts","mindmap","graphviz","wavedrom","math","markmap","smiles","js","ts","html","toml","c#","bat"],c.CDN="https://unpkg.com/vditor@".concat("4.0.1"),c.MARKDOWN_OPTIONS={autoSpace:!1,callout:!0,inlineMath:!0,gfmAutoLink:!0,codeBlockPreview:!0,fixTermTypo:!1,footnotes:!0,imageCaption:!1,linkBase:"",linkPrefix:"",listStyle:!1,mark:!1,mathBlockPreview:!0,paragraphBeginningSpace:!1,sanitize:!0,sub:!1,sup:!1,toc:!1},c.HLJS_OPTIONS={enable:!0,lineNumber:!1,defaultLang:"",style:"github"},c.MATH_OPTIONS={engine:"KaTeX",inlineDigit:!1,macros:{}},c.THEME_OPTIONS={current:"light",list:{"ant-design":"Ant Design",dark:"Dark",light:"Light",wechat:"WeChat"},path:"".concat(c.CDN,"/dist/css/content-theme")},c})()}),825:((ne,k,T)=>{"use strict";T.d(k,{J:()=>l});var N=T(145),A=T(413),c=T(840),p=T(494),l=function(g,b,h){g===void 0&&(g=document),b===void 0&&(b=N.g.CDN);var y=c.SMILESRenderAdapter.getElements(g);y.length>0&&(0,A.G)("".concat(b,"/dist/js/smiles-drawer/smiles-drawer.min.js?v=2.1.7"),"vditorAbcjsScript").then(function(){var E=new SmiDrawer({},{});y.forEach(function(w){var f=c.SMILESRenderAdapter.getCode(w).trim();if(!(w.getAttribute("data-processed")==="true"||f.trim()==="")){var u="smiles"+(0,p.Wb)();w.innerHTML='<svg id="'.concat(u,'"></svg>'),E.draw(f,"#"+u,h==="dark"?"dark":void 0),w.setAttribute("data-processed","true")}})})}}),135:((ne,k,T)=>{"use strict";T.d(k,{Q:()=>p});var N=T(145),A=T(413),c=T(840),p=function(l,g){l===void 0&&(l=document),g===void 0&&(g=N.g.CDN);var b=c.abcRenderAdapter.getElements(l);b.length>0&&(0,A.G)("".concat(g,"/dist/js/abcjs/abcjs_basic.min.js"),"vditorAbcjsScript").then(function(){b.forEach(function(h){h.parentElement.classList.contains("vditor-wysiwyg__pre")||h.parentElement.classList.contains("vditor-ir__marker--pre")||h.getAttribute("data-processed")!=="true"&&(ABCJS.renderAbc(h,c.abcRenderAdapter.getCode(h).trim()),h.style.overflowX="auto",h.setAttribute("data-processed","true"))})})}}),840:((ne,k,T)=>{"use strict";T.r(k),T.d(k,{mathRenderAdapter:()=>N,SMILESRenderAdapter:()=>A,mermaidRenderAdapter:()=>c,markmapRenderAdapter:()=>p,mindmapRenderAdapter:()=>l,chartRenderAdapter:()=>g,abcRenderAdapter:()=>b,graphvizRenderAdapter:()=>h,wavedromRenderAdapter:()=>y,flowchartRenderAdapter:()=>E,plantumlRenderAdapter:()=>w});var N={getCode:function(f){return f.textContent},getElements:function(f){return f.querySelectorAll(".language-math")}},A={getCode:function(f){return f.textContent},getElements:function(f){return f.querySelectorAll(".language-smiles")}},c={getCode:function(f){return f.textContent},getElements:function(f){return f.querySelectorAll(".language-mermaid")}},p={getCode:function(f){return f.textContent},getElements:function(f){return f.querySelectorAll(".language-markmap")}},l={getCode:function(f){return f.getAttribute("data-code")},getElements:function(f){return f.querySelectorAll(".language-mindmap")}},g={getCode:function(f){return f.innerText},getElements:function(f){return f.querySelectorAll(".language-echarts")}},b={getCode:function(f){return f.textContent},getElements:function(f){return f.querySelectorAll(".language-abc")}},h={getCode:function(f){return f.textContent},getElements:function(f){return f.querySelectorAll(".language-graphviz")}},y={getCode:function(f){return f.textContent},getElements:function(f){return f.querySelectorAll(".language-wavedrom")}},E={getCode:function(f){return f.textContent},getElements:function(f){return f.querySelectorAll(".language-flowchart")}},w={getCode:function(f){return f.textContent},getElements:function(f){return f.querySelectorAll(".language-plantuml")}}}),775:((ne,k,T)=>{"use strict";T.d(k,{p:()=>b});var N=T(145),A=T(413),c=T(840),p=T(494),l=function(h,y,E,w){function f(u){return u instanceof E?u:new E(function(s){s(u)})}return new(E||(E=Promise))(function(u,s){function S(H){try{C(w.next(H))}catch(G){s(G)}}function D(H){try{C(w.throw(H))}catch(G){s(G)}}function C(H){H.done?u(H.value):f(H.value).then(S,D)}C((w=w.apply(h,y||[])).next())})},g=function(h,y){var E={label:0,sent:function(){if(u[0]&1)throw u[1];return u[1]},trys:[],ops:[]},w,f,u,s;return s={next:S(0),throw:S(1),return:S(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function S(C){return function(H){return D([C,H])}}function D(C){if(w)throw new TypeError("Generator is already executing.");for(;s&&(s=0,C[0]&&(E=0)),E;)try{if(w=1,f&&(u=C[0]&2?f.return:C[0]?f.throw||((u=f.return)&&u.call(f),0):f.next)&&!(u=u.call(f,C[1])).done)return u;switch(f=0,u&&(C=[C[0]&2,u.value]),C[0]){case 0:case 1:u=C;break;case 4:return E.label++,{value:C[1],done:!1};case 5:E.label++,f=C[1],C=[0];continue;case 7:C=E.ops.pop(),E.trys.pop();continue;default:if(u=E.trys,!(u=u.length>0&&u[u.length-1])&&(C[0]===6||C[0]===2)){E=0;continue}if(C[0]===3&&(!u||C[1]>u[0]&&C[1]<u[3])){E.label=C[1];break}if(C[0]===6&&E.label<u[1]){E.label=u[1],u=C;break}if(u&&E.label<u[2]){E.label=u[2],E.ops.push(C);break}u[2]&&E.ops.pop(),E.trys.pop();continue}C=y.call(h,E)}catch(H){C=[6,H],f=0}finally{w=u=0}if(C[0]&5)throw C[1];return{value:C[0]?C[1]:void 0,done:!0}}},b=function(h,y,E){h===void 0&&(h=document),y===void 0&&(y=N.g.CDN);var w=c.chartRenderAdapter.getElements(h);w.length>0&&(0,A.G)("".concat(y,"/dist/js/echarts/echarts.min.js?v=5.5.1"),"vditorEchartsScript").then(function(){w.forEach(function(f){return l(void 0,void 0,void 0,function(){var u,s,S;return g(this,function(D){switch(D.label){case 0:if(f.parentElement.classList.contains("vditor-wysiwyg__pre")||f.parentElement.classList.contains("vditor-ir__marker--pre"))return[2];if(u=c.chartRenderAdapter.getCode(f).trim(),!u)return[2];D.label=1;case 1:return D.trys.push([1,3,,4]),f.getAttribute("data-processed")==="true"?[2]:[4,(0,p.Qf)(u)];case 2:return s=D.sent(),echarts.init(f,E==="dark"?"dark":void 0).setOption(s),f.setAttribute("data-processed","true"),[3,4];case 3:return S=D.sent(),f.className="vditor-reset--error",f.innerHTML="echarts render error: <br>".concat(S),[3,4];case 4:return[2]}})})})})}}),428:((ne,k,T)=>{"use strict";T.d(k,{O:()=>c});var N=T(105),A=T(145),c=function(p,l){Array.from(p.querySelectorAll("pre > code")).filter(function(g,b){return!(g.parentElement.classList.contains("vditor-wysiwyg__pre")||g.parentElement.classList.contains("vditor-ir__marker--pre")||g.classList.contains("language-mermaid")||g.classList.contains("language-flowchart")||g.classList.contains("language-echarts")||g.classList.contains("language-mindmap")||g.classList.contains("language-plantuml")||g.classList.contains("language-markmap")||g.classList.contains("language-abc")||g.classList.contains("language-graphviz")||g.classList.contains("language-math")||g.classList.contains("language-smiles")||g.style.maxHeight.indexOf("px")>-1||p.classList.contains("vditor-preview")&&b>5)}).forEach(function(g){var b,h,y,E=g.innerText;if(g.classList.contains("highlight-chroma")){var w=g.cloneNode(!0);w.querySelectorAll(".highlight-ln").forEach(function(S){S.remove()}),E=w.innerText}else E.endsWith(`
`)&&(E=E.substr(0,E.length-1));var f='<svg><use xlink:href="#vditor-icon-copy"></use></svg>';document.getElementById("vditorIconScript")||(f='<svg viewBox="0 0 32 32"><path d="M22.545-0h-17.455c-1.6 0-2.909 1.309-2.909 2.909v20.364h2.909v-20.364h17.455v-2.909zM26.909 5.818h-16c-1.6 0-2.909 1.309-2.909 2.909v20.364c0 1.6 1.309 2.909 2.909 2.909h16c1.6 0 2.909-1.309 2.909-2.909v-20.364c0-1.6-1.309-2.909-2.909-2.909zM26.909 29.091h-16v-20.364h16v20.364z"></path></svg>');var u=document.createElement("div");u.className="vditor-copy",u.innerHTML='<span aria-label="'.concat(((b=window.VditorI18n)===null||b===void 0?void 0:b.copy)||"\u590D\u5236",`"
onmouseover="this.setAttribute('aria-label', '`).concat(((h=window.VditorI18n)===null||h===void 0?void 0:h.copy)||"\u590D\u5236",`')"
class="vditor-tooltipped vditor-tooltipped__w"
onclick="event.stopPropagation();this.previousElementSibling.select();document.execCommand('copy');this.setAttribute('aria-label', '`).concat(((y=window.VditorI18n)===null||y===void 0?void 0:y.copied)||"\u5DF2\u590D\u5236",`');this.previousElementSibling.blur()">`).concat(f,"</span>");var s=document.createElement("textarea");s.value=(0,N.X)(E),u.insertAdjacentElement("afterbegin",s),l&&l.renderMenu&&l.renderMenu(g,u),g.before(u),g.style.maxHeight=window.outerHeight-40+"px",g.insertAdjacentHTML("afterend",'<span style="position: absolute">'.concat(A.g.ZWSP,"</span>"))})}}),325:((ne,k,T)=>{"use strict";T.d(k,{P:()=>p});var N=T(145),A=T(413),c=T(840),p=function(l,g){g===void 0&&(g=N.g.CDN);var b=c.flowchartRenderAdapter.getElements(l);b.length!==0&&(0,A.G)("".concat(g,"/dist/js/flowchart.js/flowchart.min.js"),"vditorFlowchartScript").then(function(){b.forEach(function(h){if(h.getAttribute("data-processed")!=="true"){var y=flowchart.parse(c.flowchartRenderAdapter.getCode(h));h.innerHTML="",y.drawSVG(h),h.setAttribute("data-processed","true")}})})}}),483:((ne,k,T)=>{"use strict";T.d(k,{v:()=>p});var N=T(145),A=T(413),c=T(840),p=function(l,g){g===void 0&&(g=N.g.CDN);var b=c.graphvizRenderAdapter.getElements(l);b.length!==0&&(0,A.G)("".concat(g,"/dist/js/graphviz/viz.js"),"vditorGraphVizScript").then(function(){b.forEach(function(h){var y=c.graphvizRenderAdapter.getCode(h);if(!(h.parentElement.classList.contains("vditor-wysiwyg__pre")||h.parentElement.classList.contains("vditor-ir__marker--pre"))&&!(h.getAttribute("data-processed")==="true"||y.trim()==="")){try{var E=new Blob(["importScripts('".concat(document.getElementById("vditorGraphVizScript").src.replace("viz.js","full.render.js"),"');")],{type:"application/javascript"}),w=window.URL||window.webkitURL,f=w.createObjectURL(E),u=new Worker(f);new Viz({worker:u}).renderSVGElement(y).then(function(s){h.innerHTML=s.outerHTML}).catch(function(s){h.innerHTML="graphviz render error: <br>".concat(s),h.className="vditor-reset--error"})}catch(s){console.error("graphviz error",s)}h.setAttribute("data-processed","true")}})})}}),999:((ne,k,T)=>{"use strict";T.d(k,{s:()=>p});var N=T(145),A=T(413),c=T(290),p=function(l,g,b){g===void 0&&(g=document),b===void 0&&(b=N.g.CDN);var h=l.style;N.g.CODE_THEME.includes(h)||(h="github");var y=document.getElementById("vditorHljsStyle"),E="".concat(b,"/dist/js/highlight.js/styles/").concat(h,".min.css");if(y&&y.getAttribute("href")!==E&&y.remove(),(0,c.c)("".concat(b,"/dist/js/highlight.js/styles/").concat(h,".min.css"),"vditorHljsStyle"),l.enable!==!1){var w=g.querySelectorAll("pre > code");w.length!==0&&(0,A.G)("".concat(b,"/dist/js/highlight.js/highlight.min.js?v=11.7.0"),"vditorHljsScript").then(function(){(0,A.G)("".concat(b,"/dist/js/highlight.js/third-languages.js?v=1.0.1"),"vditorHljsThirdScript").then(function(){g.querySelectorAll("pre > code").forEach(function(f){if(!(f.parentElement.classList.contains("vditor-ir__marker--pre")||f.parentElement.classList.contains("vditor-wysiwyg__pre"))&&!(f.classList.contains("language-mermaid")||f.classList.contains("language-flowchart")||f.classList.contains("language-echarts")||f.classList.contains("language-mindmap")||f.classList.contains("language-plantuml")||f.classList.contains("language-smiles")||f.classList.contains("language-abc")||f.classList.contains("language-graphviz")||f.classList.contains("language-math"))){l.defaultLang!==""&&f.className.indexOf("language-")===-1&&f.classList.add("language-"+l.defaultLang);var u=f.className.replace("language-","");if(window.hljs.getLanguage(u)||(u="plaintext"),f.innerHTML=window.hljs.highlight(f.textContent,{language:u,ignoreIllegals:!0}).value,f.classList.add("hljs"),!!l.lineNumber){f.classList.add("vditor-linenumber");var s=f.querySelector(".vditor-linenumber__temp");s||(s=document.createElement("div"),s.className="vditor-linenumber__temp",f.insertAdjacentElement("beforeend",s));var S=getComputedStyle(f).whiteSpace,D=!1;(S==="pre-wrap"||S==="pre-line")&&(D=!0);var C="",H=f.textContent.split(/\r\n|\r|\n/g);H.pop(),H.map(function(G){var J="";D&&(s.textContent=G||`
`,J=' style="height:'.concat(s.getBoundingClientRect().height,'px"')),C+="<span".concat(J,"></span>")}),s.style.display="none",C='<span class="vditor-linenumber__rows">'.concat(C,"</span>"),f.insertAdjacentHTML("beforeend",C)}}})})})}}}),161:((ne,k,T)=>{"use strict";T.d(k,{W:()=>y,V:()=>E});var N=function(w,f){return f===void 0&&(f=!1),Array.from(w.childNodes).filter(function(u){return u.nodeType===Node.COMMENT_NODE?!1:u.nodeType===Node.TEXT_NODE?u.textContent.replace(/\u200b/g,"").trim()!=="":u instanceof HTMLElement?u.tagName==="WBR"?!1:!f||!u.classList.contains("vditor-ir__marker"):!0})},A=function(w){var f=N(w);if(!(f.length!==1||!(f[0]instanceof HTMLElement))){var u=f[0];if(u instanceof HTMLImageElement)return{container:u,image:u};if(u instanceof HTMLAnchorElement){var s=N(u);if(s.length===1&&s[0]instanceof HTMLImageElement)return{container:u,image:s[0]}}}},c=function(w){var f=N(w);if(!(f.length!==1||!(f[0]instanceof HTMLElement))){var u=f[0];if(u.getAttribute("data-type")==="a"){var s=N(u,!0);if(s.length!==1||!(s[0]instanceof HTMLElement))return;u=s[0]}if(u.getAttribute("data-type")==="img"){var S=u.querySelector(":scope > img"),D=u.querySelector(":scope > .vditor-ir__marker--title");if(!(!(S instanceof HTMLImageElement)||!D)){var C=D.textContent.trim(),H=C[0]==="("?")":C[0];if(!(C.length<2||!['"',"'","("].includes(C[0])||C[C.length-1]!==H))return{caption:C.slice(1,-1).trim(),container:u,image:S}}}}},p=function(w){w.querySelectorAll("span.vditor-image[data-image-caption]").forEach(function(f){for(;f.firstChild;)f.parentNode.insertBefore(f.firstChild,f);f.remove()})},l=function(w){w.querySelectorAll(".vditor-image[data-image-caption]").forEach(function(f){f.classList.remove("vditor-image"),f.removeAttribute("data-image-caption")})},g=function(w){w.querySelectorAll("p").forEach(function(f){var u,s=A(f),S=(u=s?.image.getAttribute("title"))===null||u===void 0?void 0:u.trim();if(!(!s||!S)){var D=document.createElement("figure");Array.from(f.attributes).forEach(function(H){D.setAttribute(H.name,H.value)}),D.classList.add("vditor-image");var C=document.createElement("figcaption");C.textContent=S,D.append(s.container,C),f.replaceWith(D)}})},b=function(w){w.querySelectorAll("p").forEach(function(f){var u,s=A(f),S=(u=s?.image.getAttribute("title"))===null||u===void 0?void 0:u.trim();if(!(!s||!S)){var D=document.createElement("span");D.className="vditor-image",D.setAttribute("data-image-caption",S),s.container.replaceWith(D),D.append(s.container)}})},h=function(w){w.querySelectorAll("p").forEach(function(f){var u=c(f);u?.caption&&(u.container.classList.add("vditor-image"),u.container.setAttribute("data-image-caption",u.caption))})},y=function(w,f,u){f==="wysiwyg"?p(w):f==="ir"&&l(w),u&&(f==="preview"?g(w):f==="wysiwyg"?b(w):h(w))},E=function(w,f){if(!f)return w;var u=document.createElement("div");return u.innerHTML=w,y(u,"preview",!0),u.innerHTML}}),11:((ne,k,T)=>{"use strict";T.d(k,{K:()=>b});var N=T(145),A=T(413),c=T(840),p={},l=function(h,y){var E=h.transform(y),w=Object.keys(E.features).filter(function(D){return!p[D]});w.forEach(function(D){p[D]=!0});var f=h.getAssets(w),u=f.styles,s=f.scripts,S=window.markmap;return u&&S.loadCSS(u),s&&S.loadJS(s),E},g=function(h,y){var E=window.markmap,w=E.Transformer,f=E.Markmap,u=E.deriveOptions,s=E.globalCSS,S=new w;h.innerHTML='<svg style="width:100%"></svg>';var D=h.firstChild,C=f.create(D,null),H=l(S,y),G=H.root,J=H.frontmatter,me=J?.markmap,ke=u(me);C.setData(G,ke),C.fit()},b=function(h,y){h===void 0&&(h=document),y===void 0&&(y=N.g.CDN);var E=c.markmapRenderAdapter.getElements(h);E.length!==0&&(0,A.G)("".concat(y,"/dist/js/markmap/markmap.min.js"),"vditorMarkerScript").then(function(){E.forEach(function(w){var f=c.markmapRenderAdapter.getCode(w);if(!(w.getAttribute("data-processed")==="true"||f.trim()==="")){var u=document.createElement("div");u.className="language-markmap",w.parentNode.appendChild(u),g(u,f),w.parentNode.childNodes[0].nodeName=="CODE"&&w.parentNode.removeChild(w.parentNode.childNodes[0])}})})}}),472:((ne,k,T)=>{"use strict";T.d(k,{H:()=>g});var N=T(145),A=T(413),c=T(290),p=T(105),l=T(840),g=function(b,h){b===void 0&&(b=document);var y=l.mathRenderAdapter.getElements(b);if(y.length!==0){var E={cdn:N.g.CDN,math:{engine:"KaTeX",inlineDigit:!1,macros:{}}};if(h&&h.math&&(h.math=Object.assign({},E.math,h.math)),h=Object.assign({},E,h),h.math.engine==="KaTeX")(0,c.c)("".concat(h.cdn,"/dist/js/katex/katex.min.css?v=0.16.9"),"vditorKatexStyle"),(0,A.G)("".concat(h.cdn,"/dist/js/katex/katex.min.js?v=0.16.9"),"vditorKatexScript").then(function(){(0,A.G)("".concat(h.cdn,"/dist/js/katex/mhchem.min.js?v=0.16.9"),"vditorKatexChemScript").then(function(){y.forEach(function(u){if(!(u.parentElement.classList.contains("vditor-wysiwyg__pre")||u.parentElement.classList.contains("vditor-ir__marker--pre"))&&!u.getAttribute("data-math")){var s=(0,p.X)(l.mathRenderAdapter.getCode(u));u.setAttribute("data-math",s);try{u.innerHTML=katex.renderToString(s,{displayMode:u.tagName==="DIV",output:"html",macros:h.math.macros})}catch(S){u.innerHTML=S.message,u.className="language-math vditor-reset--error"}u.addEventListener("copy",function(S){S.stopPropagation(),S.preventDefault();var D=S.currentTarget.closest(".language-math");S.clipboardData.setData("text/html",D.innerHTML),S.clipboardData.setData("text/plain",D.getAttribute("data-math"))})}})})});else if(h.math.engine==="MathJax"){var w=function(u){if(u.length!==0){var s=0,S=u[u.length-1],D=function(){var C=u[s++];C===S?C():C(D)};D()}};window.MathJax||(window.MathJax={loader:{paths:{mathjax:"".concat(h.cdn,"/dist/js/mathjax")}},startup:{typeset:!1},tex:{macros:h.math.macros}},Object.assign(window.MathJax,h.math.mathJaxOptions)),(0,A.J)("".concat(h.cdn,"/dist/js/mathjax/tex-svg-full.js"),"protyleMathJaxScript");var f=function(u,s){var S=(0,p.X)(u.textContent).trim(),D=window.MathJax.getMetricsFor(u);D.display=u.tagName==="DIV",window.MathJax.tex2svgPromise(S,D).then(function(C){u.innerHTML="",u.setAttribute("data-math",S),u.append(C),window.MathJax.startup.document.clear(),window.MathJax.startup.document.updateDocument();var H=C.querySelector('[data-mml-node="merror"]');H&&H.textContent.trim()!==""&&(u.innerHTML=H.textContent.trim(),u.className="vditor-reset--error"),s&&s()})};window.MathJax.startup.promise.then(function(){for(var u=[],s=function(D){var C=y[D];!C.parentElement.classList.contains("vditor-wysiwyg__pre")&&!C.parentElement.classList.contains("vditor-ir__marker--pre")&&!C.getAttribute("data-math")&&(0,p.X)(C.textContent).trim()&&u.push(function(H){D===y.length-1?f(C):f(C,H)})},S=0;S<y.length;S++)s(S);w(u)})}}}}),280:((ne,k,T)=>{"use strict";T.d(k,{Y:()=>p});var N=T(494),A=function(l,g,b){var h=l.ownerDocument.createElement(g);g==="iframe"?h.className="iframe__video":h.setAttribute("controls","controls"),h.setAttribute("src",b),l.replaceWith(h)},c=function(l,g){var b=g.match(/\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w|-]{11})(?:(?:[\?&]t=)(\S+))?/),h=g.match(/\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/),y=g.match(/\/\/v\.qq\.com\/x\/cover\/.*\/([^\/]+)\.html\??.*/),E=g.match(/(?:www\.|\/\/)coub\.com\/view\/(\w+)/),w=g.match(/(?:www\.|\/\/)facebook\.com\/([^\/]+)\/videos\/([0-9]+)/),f=g.match(/.+dailymotion.com\/(video|hub)\/(\w+)\?/),u=g.match(/(?:www\.|\/\/)bilibili\.com\/video\/(\w+)/),s=g.match(/(?:www\.|\/\/)ted\.com\/talks\/(\w+)/);if(b&&b[1].length===11)A(l,"iframe","//www.youtube.com/embed/".concat(b[1]+(b[2]?"?start="+b[2]:"")));else if(h&&h[1])A(l,"iframe","//player.youku.com/embed/".concat(h[1]));else if(y&&y[1])A(l,"iframe","https://v.qq.com/txp/iframe/player.html?vid=".concat(y[1]));else if(E&&E[1])A(l,"iframe","//coub.com/embed/".concat(E[1],"?muted=false&autostart=false&originalSize=true&startWithHD=true"));else if(w&&w[0])A(l,"iframe","https://www.facebook.com/plugins/video.php?href=".concat(encodeURIComponent(w[0])));else if(f&&f[2])A(l,"iframe","https://www.dailymotion.com/embed/video/".concat(f[2]));else if(g.indexOf("bilibili.com")>-1&&(g.indexOf("bvid=")>-1||u&&u[1])){var S={bvid:(0,N.on)("bvid",g)||u&&u[1],page:"1",high_quality:"1",as_wide:"1",allowfullscreen:"true",autoplay:"0"};new URL(g.startsWith("http")?g:"https:"+g).search.split("&").forEach(function(H,G){if(H){G===0&&(H=H.substr(1));var J=H.split("=");S[J[0]]=J[1]}});var D="https://player.bilibili.com/player.html?",C=Object.keys(S);C.forEach(function(H,G){D+="".concat(H,"=").concat(S[H]),G<C.length-1&&(D+="&")}),A(l,"iframe",D)}else s&&s[1]&&A(l,"iframe","//embed.ted.com/talks/".concat(s[1]))},p=function(l){l&&l.querySelectorAll("a").forEach(function(g){var b=g.getAttribute("href");b&&(b.match(/^.+.(mp4|m4v|ogg|ogv|webm)$/)?A(g,"video",b):b.match(/^.+.(mp3|wav|flac)$/)?A(g,"audio",b):c(g,b))})}}),637:((ne,k,T)=>{"use strict";T.d(k,{i:()=>b});var N=T(145),A=T(413),c=T(840),p=T(494),l=function(h,y,E,w){function f(u){return u instanceof E?u:new E(function(s){s(u)})}return new(E||(E=Promise))(function(u,s){function S(H){try{C(w.next(H))}catch(G){s(G)}}function D(H){try{C(w.throw(H))}catch(G){s(G)}}function C(H){H.done?u(H.value):f(H.value).then(S,D)}C((w=w.apply(h,y||[])).next())})},g=function(h,y){var E={label:0,sent:function(){if(u[0]&1)throw u[1];return u[1]},trys:[],ops:[]},w,f,u,s;return s={next:S(0),throw:S(1),return:S(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function S(C){return function(H){return D([C,H])}}function D(C){if(w)throw new TypeError("Generator is already executing.");for(;s&&(s=0,C[0]&&(E=0)),E;)try{if(w=1,f&&(u=C[0]&2?f.return:C[0]?f.throw||((u=f.return)&&u.call(f),0):f.next)&&!(u=u.call(f,C[1])).done)return u;switch(f=0,u&&(C=[C[0]&2,u.value]),C[0]){case 0:case 1:u=C;break;case 4:return E.label++,{value:C[1],done:!1};case 5:E.label++,f=C[1],C=[0];continue;case 7:C=E.ops.pop(),E.trys.pop();continue;default:if(u=E.trys,!(u=u.length>0&&u[u.length-1])&&(C[0]===6||C[0]===2)){E=0;continue}if(C[0]===3&&(!u||C[1]>u[0]&&C[1]<u[3])){E.label=C[1];break}if(C[0]===6&&E.label<u[1]){E.label=u[1],u=C;break}if(u&&E.label<u[2]){E.label=u[2],E.ops.push(C);break}u[2]&&E.ops.pop(),E.trys.pop();continue}C=y.call(h,E)}catch(H){C=[6,H],f=0}finally{w=u=0}if(C[0]&5)throw C[1];return{value:C[0]?C[1]:void 0,done:!0}}},b=function(h,y,E){h===void 0&&(h=document),y===void 0&&(y=N.g.CDN);var w=c.mermaidRenderAdapter.getElements(h);w.length!==0&&(0,A.G)("".concat(y,"/dist/js/mermaid/mermaid.min.js?v=11.17.2"),"vditorMermaidScript").then(function(){var f={securityLevel:"loose",altFontFamily:"sans-serif",fontFamily:"sans-serif",startOnLoad:!1,flowchart:{htmlLabels:!0,useMaxWidth:!0},sequence:{useMaxWidth:!0,diagramMarginX:8,diagramMarginY:8,boxMargin:8,showSequenceNumbers:!0},gantt:{leftPadding:75,rightPadding:20}};E==="dark"&&(f.theme="dark"),mermaid.initialize(f),w.forEach(function(u){return l(void 0,void 0,void 0,function(){var s,S,D,C,H;return g(this,function(G){switch(G.label){case 0:if(s=c.mermaidRenderAdapter.getCode(u),u.getAttribute("data-processed")==="true"||s.trim()==="")return[2];S="mermaid"+(0,p.Wb)(),G.label=1;case 1:return G.trys.push([1,3,,4]),[4,mermaid.render(S,u.textContent)];case 2:return D=G.sent(),u.innerHTML=D.svg,[3,4];case 3:return C=G.sent(),H=document.querySelector("#"+S),u.innerHTML="".concat(H.outerHTML,`<br>
<div style="text-align: left"><small>`).concat(C.message.replace(/\n/,"<br>"),"</small></div>"),H.parentElement.remove(),[3,4];case 4:return u.setAttribute("data-processed","true"),[2]}})})})})}}),194:((ne,k,T)=>{"use strict";T.d(k,{P:()=>p});var N=T(145),A=T(413),c=T(840),p=function(l,g,b){l===void 0&&(l=document),g===void 0&&(g=N.g.CDN);var h=c.mindmapRenderAdapter.getElements(l);h.length>0&&(0,A.G)("".concat(g,"/dist/js/echarts/echarts.min.js?v=5.5.1"),"vditorEchartsScript").then(function(){h.forEach(function(y){if(!(y.parentElement.classList.contains("vditor-wysiwyg__pre")||y.parentElement.classList.contains("vditor-ir__marker--pre"))){var E=c.mindmapRenderAdapter.getCode(y);if(E)try{if(y.getAttribute("data-processed")==="true")return;echarts.init(y,b==="dark"?"dark":void 0).setOption({series:[{data:[JSON.parse(decodeURIComponent(E))],initialTreeDepth:-1,itemStyle:{borderWidth:0,color:"#4285f4"},label:{backgroundColor:"#f6f8fa",borderColor:"#d1d5da",borderRadius:5,borderWidth:.5,color:"#586069",lineHeight:20,offset:[-5,0],padding:[0,5],position:"insideRight"},lineStyle:{color:"#d1d5da",width:1},roam:!0,symbol:function(w,f){var u;return!((u=f?.data)===null||u===void 0)&&u.children?"circle":"path://"},type:"tree"}],tooltip:{trigger:"item",triggerOn:"mousemove"}}),y.setAttribute("data-processed","true")}catch(w){y.className="vditor-reset--error",y.innerHTML="mindmap render error: <br>".concat(w)}}})})}}),436:((ne,k,T)=>{"use strict";T.d(k,{k:()=>c});var N=T(771),A=T(472),c=function(p,l,g){var b="",h=[];if(Array.from(p.children).forEach(function(f,u){if((0,N.W)(f)){if(g){var s=f.id.lastIndexOf("_");f.id=f.id.substring(0,s===-1?void 0:s)+"_"+u}h.push(f.id),b+=f.outerHTML.replace("<wbr>","")}}),b==="")return l.innerHTML="","";var y=document.createElement("div");if(g)g.lute.SetToC(!0),g.currentMode==="wysiwyg"&&!g.preview.element.contains(p)?y.innerHTML=g.lute.SpinVditorDOM("<p>[ToC]</p>"+b):g.currentMode==="ir"&&!g.preview.element.contains(p)?y.innerHTML=g.lute.SpinVditorIRDOM("<p>[ToC]</p>"+b):y.innerHTML=g.lute.HTML2VditorDOM("<p>[ToC]</p>"+b),g.lute.SetToC(g.options.preview.markdown.toc);else{l.classList.add("vditor-outline");var E=Lute.New();E.SetToC(!0),y.innerHTML=E.HTML2VditorDOM("<p>[ToC]</p>"+b)}var w=y.firstElementChild.querySelectorAll("li > span[data-target-id]");return w.forEach(function(f,u){if(f.nextElementSibling&&f.nextElementSibling.tagName==="UL"){var s="<svg class='vditor-outline__action'><use xlink:href='#vditor-icon-down'></use></svg>";document.getElementById("vditorIconScript")||(s='<svg class="vditor-outline__action" viewBox="0 0 32 32"><path d="M3.76 6.12l12.24 12.213 12.24-12.213 3.76 3.76-16 16-16-16 3.76-3.76z"></path></svg>'),f.innerHTML="".concat(s,"<span>").concat(f.innerHTML,"</span>")}else f.innerHTML="<svg></svg><span>".concat(f.innerHTML,"</span>");f.setAttribute("data-target-id",h[u])}),b=y.firstElementChild.innerHTML,w.length===0?(l.innerHTML="",b):(l.innerHTML=b,g&&(0,A.H)(l,{cdn:g.options.cdn,math:g.options.preview.math}),l.firstElementChild.addEventListener("click",function(f){for(var u=f.target;u&&!u.isEqualNode(l);){if(u.classList.contains("vditor-outline__action")){u.classList.contains("vditor-outline__action--close")?(u.classList.remove("vditor-outline__action--close"),u.parentElement.nextElementSibling.setAttribute("style","display:block")):(u.classList.add("vditor-outline__action--close"),u.parentElement.nextElementSibling.setAttribute("style","display:none")),f.preventDefault(),f.stopPropagation();break}else if(u.getAttribute("data-target-id")){f.preventDefault(),f.stopPropagation();var s=document.getElementById(u.getAttribute("data-target-id"));if(!s)return;if(g)if(g.options.height==="auto"){var S=s.offsetTop+g.element.offsetTop;g.options.toolbarConfig.pin||(S+=g.toolbar.element.offsetHeight),window.scrollTo(window.scrollX,S)}else g.element.offsetTop<window.scrollY&&window.scrollTo(window.scrollX,g.element.offsetTop),g.preview.element.contains(p)?p.parentElement.scrollTop=s.offsetTop:p.scrollTop=s.offsetTop;else window.scrollTo(window.scrollX,s.offsetTop);break}u=u.parentElement}}),b)}}),229:((ne,k,T)=>{"use strict";T.d(k,{B:()=>p});var N=T(145),A=T(413),c=T(840),p=function(l,g){l===void 0&&(l=document),g===void 0&&(g=N.g.CDN);var b=c.plantumlRenderAdapter.getElements(l);b.length!==0&&(0,A.G)("".concat(g,"/dist/js/plantuml/plantuml-encoder.min.js"),"vditorPlantumlScript").then(function(){b.forEach(function(h){if(!(h.parentElement.classList.contains("vditor-wysiwyg__pre")||h.parentElement.classList.contains("vditor-ir__marker--pre"))){var y=c.plantumlRenderAdapter.getCode(h).trim();if(y)try{h.innerHTML='<object type="image/svg+xml" data="https://www.plantuml.com/plantuml/svg/~1'.concat(plantumlEncoder.encode(y),'"/>')}catch(E){h.className="vditor-reset--error",h.innerHTML="plantuml render error: <br>".concat(E)}}})})}}),214:((ne,k,T)=>{"use strict";T.d(k,{X:()=>N});var N=function(A){var c=Lute.New();return c.PutEmojis(A.emojis),c.SetEmojiSite(A.emojiSite),c.SetHeadingAnchor(A.headingAnchor),c.SetInlineMathAllowDigitAfterOpenMarker(A.inlineMathDigit),c.SetAutoSpace(A.autoSpace),c.SetCallout(A.callout),c.SetInlineMath(A.inlineMath),c.SetToC(A.toc),c.SetFootnotes(A.footnotes),c.SetFixTermTypo(A.fixTermTypo),c.SetVditorCodeBlockPreview(A.codeBlockPreview),c.SetVditorMathBlockPreview(A.mathBlockPreview),c.SetSanitize(A.sanitize),c.SetChineseParagraphBeginningSpace(A.paragraphBeginningSpace),c.SetRenderListStyle(A.listStyle),c.SetLinkBase(A.linkBase),c.SetLinkPrefix(A.linkPrefix),c.SetMark(A.mark),c.SetGFMAutoLink(A.gfmAutoLink),A.lazyLoadImage&&c.SetImageLazyLoading(A.lazyLoadImage),c.SetSup(A.sup),c.SetSub(A.sub),c}}),497:((ne,k,T)=>{"use strict";T.d(k,{F:()=>h});var N=T(145),A=T(413),c=T(494),p=T(840),l=function(y,E,w,f){function u(s){return s instanceof w?s:new w(function(S){S(s)})}return new(w||(w=Promise))(function(s,S){function D(G){try{H(f.next(G))}catch(J){S(J)}}function C(G){try{H(f.throw(G))}catch(J){S(J)}}function H(G){G.done?s(G.value):u(G.value).then(D,C)}H((f=f.apply(y,E||[])).next())})},g=function(y,E){var w={label:0,sent:function(){if(s[0]&1)throw s[1];return s[1]},trys:[],ops:[]},f,u,s,S;return S={next:D(0),throw:D(1),return:D(2)},typeof Symbol=="function"&&(S[Symbol.iterator]=function(){return this}),S;function D(H){return function(G){return C([H,G])}}function C(H){if(f)throw new TypeError("Generator is already executing.");for(;S&&(S=0,H[0]&&(w=0)),w;)try{if(f=1,u&&(s=H[0]&2?u.return:H[0]?u.throw||((s=u.return)&&s.call(u),0):u.next)&&!(s=s.call(u,H[1])).done)return s;switch(u=0,s&&(H=[H[0]&2,s.value]),H[0]){case 0:case 1:s=H;break;case 4:return w.label++,{value:H[1],done:!1};case 5:w.label++,u=H[1],H=[0];continue;case 7:H=w.ops.pop(),w.trys.pop();continue;default:if(s=w.trys,!(s=s.length>0&&s[s.length-1])&&(H[0]===6||H[0]===2)){w=0;continue}if(H[0]===3&&(!s||H[1]>s[0]&&H[1]<s[3])){w.label=H[1];break}if(H[0]===6&&w.label<s[1]){w.label=s[1],s=H;break}if(s&&w.label<s[2]){w.label=s[2],w.ops.push(H);break}s[2]&&w.ops.pop(),w.trys.pop();continue}H=E.call(y,w)}catch(G){H=[6,G],u=0}finally{f=s=0}if(H[0]&5)throw H[1];return{value:H[0]?H[1]:void 0,done:!0}}},b=0,h=function(y,E){y===void 0&&(y=document),E===void 0&&(E=N.g.CDN);var w=p.wavedromRenderAdapter.getElements(y);w.length!==0&&(0,A.G)("".concat(E,"/dist/js/wavedrom/wavedrom.min.js?v=3.6.2"),"vditorWavedromScript").then(function(){w.forEach(function(f){return l(void 0,void 0,void 0,function(){var u,s,S,D,C,H;return g(this,function(G){switch(G.label){case 0:if(f.parentElement.classList.contains("vditor-wysiwyg__pre")||f.parentElement.classList.contains("vditor-ir__marker--pre"))return[2];if(u=p.wavedromRenderAdapter.getCode(f),f.getAttribute("data-processed")==="true"||u.trim()==="")return[2];s=f,f.tagName==="CODE"&&(s=document.createElement("div"),Array.from(f.attributes).forEach(function(J){s.setAttribute(J.name,J.value)}),f.replaceWith(s)),G.label=1;case 1:return G.trys.push([1,3,,4]),[4,(0,c.Qf)(u)];case 2:return S=G.sent(),wavedrom.renderWaveElement(b,S,s,wavedrom.waveSkin,!1),b++,[3,4];case 3:return D=G.sent(),C=D instanceof Error?D.message:String(D),H=document.createElement("br"),s.replaceChildren(document.createTextNode("wavedrom render error:"),H,document.createTextNode(C)),s.classList.add("vditor-reset--error"),[3,4];case 4:return s.setAttribute("data-processed","true"),[2]}})})})})}}),190:((ne,k,T)=>{"use strict";T.d(k,{E:()=>N});var N=function(A,c,p){c===void 0&&(c="zh_CN"),p===void 0&&(p="classic");var l=A.getBoundingClientRect(),g=36;document.body.insertAdjacentHTML("beforeend",'<div class="vditor vditor-img'.concat(p==="dark"?" vditor--dark":"",`">
    <div class="vditor-img__bar">
      <span class="vditor-img__btn" data-deg="0">
        <svg><use xlink:href="#vditor-icon-redo"></use></svg>
        `).concat(window.VditorI18n.spin,`
      </span>
      <span class="vditor-img__btn"  onclick="this.parentElement.parentElement.outerHTML = '';document.body.style.overflow = ''">
        X &nbsp;`).concat(window.VditorI18n.close,`
      </span>
    </div>
    <div class="vditor-img__img" onclick="this.parentElement.outerHTML = '';document.body.style.overflow = ''">
      <img style="width: `).concat(A.width,"px;height:").concat(A.height,"px;transform: translate3d(").concat(l.left,"px, ").concat(l.top-g,'px, 0)" src="').concat(A.getAttribute("src"),`">
    </div>
</div>`)),document.body.style.overflow="hidden";var b=document.querySelector(".vditor-img img"),h="translate3d(".concat(Math.max(0,window.innerWidth-A.naturalWidth)/2,"px, ").concat(Math.max(0,window.innerHeight-g-A.naturalHeight)/2,"px, 0)");setTimeout(function(){b.setAttribute("style","transition: transform .3s ease-in-out;transform: ".concat(h)),setTimeout(function(){b.parentElement.scrollTo((b.parentElement.scrollWidth-b.parentElement.clientWidth)/2,(b.parentElement.scrollHeight-b.parentElement.clientHeight)/2)},400)});var y=document.querySelector(".vditor-img__btn");y.addEventListener("click",function(){var E=parseInt(y.getAttribute("data-deg"),10)+90;E/90%2===1&&A.naturalWidth>b.parentElement.clientHeight?b.style.transform="translate3d(".concat(Math.max(0,window.innerWidth-A.naturalWidth)/2,"px, ").concat(A.naturalWidth/2-A.naturalHeight/2,"px, 0) rotateZ(").concat(E,"deg)"):b.style.transform="".concat(h," rotateZ(").concat(E,"deg)"),y.setAttribute("data-deg",E.toString()),setTimeout(function(){b.parentElement.scrollTo((b.parentElement.scrollWidth-b.parentElement.clientWidth)/2,(b.parentElement.scrollHeight-b.parentElement.clientHeight)/2)},400)})}}),580:((ne,k,T)=>{"use strict";T.d(k,{Y:()=>c});var N=T(145),A=T(290),c=function(p,l){l===void 0&&(l=N.g.CDN),N.g.CODE_THEME.includes(p)||(p="github");var g=document.getElementById("vditorHljsStyle"),b="".concat(l,"/dist/js/highlight.js/styles/").concat(p,".min.css");g?g.getAttribute("href")!==b&&(g.remove(),(0,A.c)(b,"vditorHljsStyle")):(0,A.c)(b,"vditorHljsStyle")}}),538:((ne,k,T)=>{"use strict";T.d(k,{Z:()=>A});var N=T(290),A=function(c,p){if(!(!c||!p)){var l=document.getElementById("vditorContentTheme"),g="".concat(p,"/").concat(c,".css");l?l.getAttribute("href")!==g&&(l.remove(),(0,N.c)(g,"vditorContentTheme")):(0,N.c)(g,"vditorContentTheme")}}}),413:((ne,k,T)=>{"use strict";T.d(k,{J:()=>N,G:()=>A});var N=function(c,p){if(document.getElementById(p))return!1;var l=new XMLHttpRequest;l.open("GET",c,!1),l.setRequestHeader("Accept","text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01"),l.send("");var g=document.createElement("script");g.type="text/javascript",g.text=l.responseText,g.id=p,document.head.appendChild(g)},A=function(c,p){return new Promise(function(l,g){if(document.getElementById(p))return l(!0),!1;var b=document.createElement("script");b.src=c,b.async=!0,document.head.appendChild(b),b.onerror=function(h){g(h)},b.onload=function(){if(document.getElementById(p))return b.remove(),l(!0),!1;b.id=p,l(!0)}})}}),290:((ne,k,T)=>{"use strict";T.d(k,{c:()=>N});var N=function(A,c){if(!document.getElementById(c)){var p=document.createElement("link");p.id=c,p.rel="stylesheet",p.type="text/css",p.href=A,document.getElementsByTagName("head")[0].appendChild(p)}}}),105:((ne,k,T)=>{"use strict";T.d(k,{X:()=>N});var N=function(A){return A.replace(/\u00a0/g," ")}}),410:((ne,k,T)=>{"use strict";T.d(k,{G6:()=>N,vU:()=>A,pK:()=>c,Le:()=>p,yl:()=>l,ns:()=>g,i7:()=>b});var N=function(){return navigator.userAgent.indexOf("Safari")>-1&&navigator.userAgent.indexOf("Chrome")===-1},A=function(){return navigator.userAgent.toLowerCase().indexOf("firefox")>-1},c=function(){try{return typeof localStorage<"u"}catch{return!1}},p=function(){return navigator.userAgent.indexOf("iPhone")>-1?"touchstart":"click"},l=function(h){return navigator.platform.toUpperCase().indexOf("MAC")>=0?!!(h.metaKey&&!h.ctrlKey):!!(!h.metaKey&&h.ctrlKey)},g=function(h){return/Mac/.test(navigator.platform)||navigator.platform==="iPhone"?h.indexOf("\u21E7")>-1&&A()&&(h=h.replace(";",":").replace("=","+").replace("-","_")):(h.startsWith("\u2318")?h=h.replace("\u2318","\u2318+"):h.startsWith("\u2325")&&h.substr(1,1)!=="\u2318"?h=h.replace("\u2325","\u2325+"):h=h.replace("\u21E7\u2318","\u2318+\u21E7+").replace("\u2325\u2318","\u2325+\u2318+"),h=h.replace("\u2318","Ctrl").replace("\u21E7","Shift").replace("\u2325","Alt"),h.indexOf("Shift")>-1&&(h=h.replace(";",":").replace("=","+").replace("-","_"))),h},b=function(){return/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor)}}),494:((ne,k,T)=>{"use strict";T.d(k,{Wb:()=>N,on:()=>A,Qf:()=>c});var N=function(){return([1e7].toString()+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,function(p){return(parseInt(p,10)^window.crypto.getRandomValues(new Uint32Array(1))[0]&15>>parseInt(p,10)/4).toString(16)})},A=function(p,l){l===void 0&&(l=window.location.search);var g=l.substring(l.indexOf("?")),b=g.indexOf("#"),h=new URLSearchParams(g.substring(0,b>=0?b:void 0));return h.get(p)},c=function(p){return Function('"use strict";return ('.concat(p,")"))()}}),106:((ne,k,T)=>{"use strict";T.d(k,{JQ:()=>A,E2:()=>p,O9:()=>l,a1:()=>g,F9:()=>b,lG:()=>h,fb:()=>y,DX:()=>E});var N=T(771),A=function(w,f){for(var u=y(w,f),s=!1,S=!1;u&&!u.classList.contains("vditor-reset")&&!S;)s=y(u.parentElement,f),s?u=s:S=!0;return u||!1},c=function(w,f,u){for(var s=g(w,f,u),S=!1,D=!1;s&&!s.classList.contains("vditor-reset")&&!D;)S=g(s.parentElement,f,u),S?s=S:D=!0;return s||!1},p=function(w,f){for(var u=(0,N.S)(w,f),s=!1,S=!1;u&&!u.classList.contains("vditor-reset")&&!S;)s=(0,N.S)(u.parentElement,f),s?u=s:S=!0;return u||!1},l=function(w){var f=p(w,"UL"),u=p(w,"OL"),s=f;return u&&(!f||f&&u.contains(f))&&(s=u),s},g=function(w,f,u){if(!w)return!1;w.nodeType===3&&(w=w.parentElement);for(var s=w,S=!1;s&&!S&&!s.classList.contains("vditor-reset");)s.getAttribute(f)===u?S=!0:s=s.parentElement;return S&&s},b=function(w){if(!w)return!1;w.nodeType===3&&(w=w.parentElement);var f=w,u=!1,s=g(w,"data-block","0");if(s)return s;for(;f&&!u&&!f.classList.contains("vditor-reset");)f.tagName==="H1"||f.tagName==="H2"||f.tagName==="H3"||f.tagName==="H4"||f.tagName==="H5"||f.tagName==="H6"||f.tagName==="P"||f.tagName==="BLOCKQUOTE"||f.tagName==="OL"||f.tagName==="UL"?u=!0:f=f.parentElement;return u&&f},h=function(w,f){if(!w)return!1;w.nodeType===3&&(w=w.parentElement);for(var u=w,s=!1;u&&!s&&!u.classList.contains("vditor-reset");)u.nodeName===f?s=!0:u=u.parentElement;return s&&u},y=function(w,f){if(!w)return!1;w.nodeType===3&&(w=w.parentElement);for(var u=w,s=!1;u&&!s&&!u.classList.contains("vditor-reset");)u.classList.contains(f)?s=!0:u=u.parentElement;return s&&u},E=function(w){for(;w&&w.lastChild;)w=w.lastChild;return w}}),771:((ne,k,T)=>{"use strict";T.d(k,{S:()=>N,W:()=>A});var N=function(c,p){if(!c)return!1;c.nodeType===3&&(c=c.parentElement);for(var l=c,g=!1;l&&!g&&!l.classList.contains("vditor-reset");)l.nodeName.indexOf(p)===0?g=!0:l=l.parentElement;return g&&l},A=function(c){var p=N(c,"H");return p&&p.tagName.length===2&&p.tagName!=="HR"?p:!1}}),673:((ne,k,T)=>{"use strict";T.d(k,{T:()=>N});var N=function(){for(var A=[],c=0;c<arguments.length;c++)A[c]=arguments[c];for(var p={},l=function(b){for(var h in b)b.hasOwnProperty(h)&&(Object.prototype.toString.call(b[h])==="[object Object]"?p[h]=N(p[h],b[h]):p[h]=b[h])},g=0;g<A.length;g++)l(A[g]);return p}}),810:((ne,k,T)=>{"use strict";T.d(k,{zh:()=>p,Ny:()=>l,Gb:()=>g,Hc:()=>b,im:()=>h,$j:()=>y,ib:()=>E,oC:()=>w});var N=T(145),A=T(410),c=T(106),p=function(f){if(f.currentMode==="sv")throw new Error("SV mode uses textarea selection");var u,s=f[f.currentMode].element;if(getSelection().rangeCount>0&&(u=getSelection().getRangeAt(0),s.isEqualNode(u.startContainer)||s.contains(u.startContainer)))return u;var S=f.currentMode==="ir"?f.ir.range:f.wysiwyg.range;return S||(s.focus(),u=s.ownerDocument.createRange(),u.setStart(s,0),u.collapse(!0),u)},l=function(f){var u=window.getSelection().getRangeAt(0);if(!f.contains(u.startContainer)&&!(0,c.fb)(u.startContainer,"vditor-panel--none"))return{left:0,top:0};var s=f.parentElement.getBoundingClientRect(),S;if(u.getClientRects().length===0)if(u.startContainer.nodeType===3){var D=u.startContainer.parentElement;if(D&&D.getClientRects().length>0)S=D.getClientRects()[0];else return{left:0,top:0}}else{var C=u.startContainer.children;if(C[u.startOffset]&&C[u.startOffset].getClientRects().length>0)S=C[u.startOffset].getClientRects()[0];else if(u.startContainer.childNodes.length>0){var H=u.cloneRange();u.selectNode(u.startContainer.childNodes[Math.max(0,u.startOffset-1)]),S=u.getClientRects()[0],u.setEnd(H.endContainer,H.endOffset),u.setStart(H.startContainer,H.startOffset)}else S=u.startContainer.getClientRects()[0];if(!S){for(var G=u.startContainer.childNodes[u.startOffset];!G.getClientRects||G.getClientRects&&G.getClientRects().length===0;)G=G.parentElement;S=G.getClientRects()[0]}}else S=u.getClientRects()[0];return{left:S.left-s.left,top:S.top-s.top}},g=function(f,u){if(!u){if(getSelection().rangeCount===0)return!1;u=getSelection().getRangeAt(0)}var s=u.commonAncestorContainer;return f.isEqualNode(s)||f.contains(s)},b=function(f){var u=window.getSelection();u.removeAllRanges(),u.addRange(f)},h=function(f,u,s){var S={end:0,start:0};if(!s){if(getSelection().rangeCount===0)return S;s=window.getSelection().getRangeAt(0)}if(g(u,s)){var D=s.cloneRange();f.childNodes[0]&&f.childNodes[0].childNodes[0]?D.setStart(f.childNodes[0].childNodes[0],0):D.selectNodeContents(f),D.setEnd(s.startContainer,s.startOffset),S.start=D.toString().length,S.end=S.start+s.toString().length}return S},y=function(f,u,s){var S=0,D=0,C=s.childNodes[D],H=!1,G=!1;f=Math.max(0,f),u=Math.max(0,u);var J=s.ownerDocument.createRange();for(J.setStart(C||s,0),J.collapse(!0);!G&&C;){var me=S+C.textContent.length;if(!H&&f>=S&&f<=me&&(f===0?J.setStart(C,0):C.childNodes[0].nodeType===3?J.setStart(C.childNodes[0],f-S):C.nextSibling?J.setStartBefore(C.nextSibling):J.setStartAfter(C),H=!0,f===u)){G=!0;break}H&&u>=S&&u<=me&&(u===0?J.setEnd(C,0):C.childNodes[0].nodeType===3?J.setEnd(C.childNodes[0],u-S):C.nextSibling?J.setEndBefore(C.nextSibling):J.setEndAfter(C),G=!0),S=me,C=s.childNodes[++D]}return!G&&s.childNodes[D-1]&&J.setStartBefore(s.childNodes[D-1]),b(J),J},E=function(f,u){var s=f.querySelector("wbr");if(s){if(!s.previousElementSibling)s.previousSibling?u.setStart(s.previousSibling,s.previousSibling.textContent.length):s.nextSibling?s.nextSibling.nodeType===3?u.setStart(s.nextSibling,0):u.setStartBefore(s.nextSibling):u.setStart(s.parentElement,0);else if(s.previousElementSibling.isSameNode(s.previousSibling))if(s.previousElementSibling.lastChild){u.setStartBefore(s),u.collapse(!0),b(u),(0,A.i7)()&&(s.previousElementSibling.tagName==="EM"||s.previousElementSibling.tagName==="STRONG"||s.previousElementSibling.tagName==="S")&&(u.insertNode(document.createTextNode(N.g.ZWSP)),u.collapse(!1)),s.remove();return}else u.setStartAfter(s.previousElementSibling);else u.setStart(s.previousSibling,s.previousSibling.textContent.length);u.collapse(!0),s.remove(),b(u)}},w=function(f,u){var s=document.createElement("div");s.innerHTML=f;var S=s.querySelectorAll("p");S.length===1&&!S[0].previousSibling&&!S[0].nextSibling&&u[u.currentMode].element.children.length>0&&s.firstElementChild.tagName==="P"&&(f=S[0].innerHTML.trim());var D=document.createElement("div");D.innerHTML=f;var C=p(u);if(C.toString()!==""&&(u.currentMode==="ir"?u.ir.preventInput=!0:u.currentMode==="wysiwyg"&&(u.wysiwyg.preventInput=!0),document.execCommand("delete",!1,"")),D.firstElementChild&&D.firstElementChild.getAttribute("data-block")==="0"){D.lastElementChild.insertAdjacentHTML("beforeend","<wbr>");var H=(0,c.F9)(C.startContainer);if(!H)u[u.currentMode].element.insertAdjacentHTML("beforeend",D.innerHTML);else{var G=(0,c.lG)(C.startContainer,"LI");G&&D.firstElementChild.tagName==="UL"?G.insertAdjacentHTML("afterend",D.firstElementChild.innerHTML):H.insertAdjacentHTML("afterend",D.innerHTML)}E(u[u.currentMode].element,C)}else{var J=document.createElement("template");J.innerHTML=f,C.insertNode(J.content.cloneNode(!0)),C.collapse(!1),b(C)}}})},Q={};function F(ne){var k=Q[ne];if(k!==void 0)return k.exports;var T=Q[ne]={exports:{}};return Je[ne](T,T.exports,F),T.exports}F.d=(ne,k)=>{for(var T in k)F.o(k,T)&&!F.o(ne,T)&&Object.defineProperty(ne,T,{enumerable:!0,get:k[T]})},F.o=(ne,k)=>Object.prototype.hasOwnProperty.call(ne,k),F.r=ne=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(ne,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(ne,"__esModule",{value:!0})};var ft={};return(()=>{"use strict";F.d(ft,{default:()=>Ii});var ne=F(408),k=F(145),T=F(105),N=function(e){return e.currentMode==="sv"?(0,T.X)("".concat(e.sv.element.value,`
`).replace(/\n\n$/,`
`)):e.currentMode==="wysiwyg"?(0,T.X)(e.lute.VditorDOM2Md(e.wysiwyg.element.innerHTML)):e.currentMode==="ir"?(0,T.X)(e.lute.VditorIRDOM2Md(e.ir.element.innerHTML)):""},A=F(413),c=(function(){function e(){this.element=document.createElement("div"),this.element.className="vditor-devtools",this.element.innerHTML='<div class="vditor-reset--error"></div><div style="height: 100%;"></div>'}return e.prototype.renderEchart=function(t){var n=this;t.devtools.element.style.display==="block"&&(0,A.G)("".concat(t.options.cdn,"/dist/js/echarts/echarts.min.js?v=5.5.1"),"vditorEchartsScript").then(function(){n.ASTChart||(n.ASTChart=echarts.init(t.devtools.element.lastElementChild));try{n.element.lastElementChild.style.display="block",n.element.firstElementChild.innerHTML="",n.ASTChart.setOption({series:[{data:JSON.parse(t.lute.RenderEChartsJSON(N(t))),initialTreeDepth:-1,label:{align:"left",backgroundColor:"rgba(68, 77, 86, .68)",borderRadius:3,color:"#d1d5da",fontSize:12,lineHeight:12,offset:[9,12],padding:[2,4,2,4],position:"top",verticalAlign:"middle"},lineStyle:{color:"#4285f4",type:"curve",width:1},orient:"vertical",roam:!0,type:"tree"}],toolbox:{bottom:25,emphasis:{iconStyle:{color:"#4285f4"}},feature:{restore:{show:!0},saveAsImage:{show:!0}},right:15,show:!0}}),n.ASTChart.resize()}catch(i){n.element.lastElementChild.style.display="none",n.element.firstElementChild.innerHTML=i}})},e})(),p=F(161),l=F(410),g=function(e,t){t.forEach(function(n){if(e[n]){var i=e[n].children[0];i&&i.classList.contains("vditor-menu--current")&&i.classList.remove("vditor-menu--current")}})},b=function(e,t){t.forEach(function(n){if(e[n]){var i=e[n].children[0];i&&!i.classList.contains("vditor-menu--current")&&i.classList.add("vditor-menu--current")}})},h=function(e,t){t.forEach(function(n){if(e[n]){var i=e[n].children[0];i&&i.classList.contains(k.g.CLASS_MENU_DISABLED)&&i.classList.remove(k.g.CLASS_MENU_DISABLED)}})},y=function(e,t){t.forEach(function(n){if(e[n]){var i=e[n].children[0];i&&!i.classList.contains(k.g.CLASS_MENU_DISABLED)&&i.classList.add(k.g.CLASS_MENU_DISABLED)}})},E=function(e,t){t.forEach(function(n){e[n]&&e[n]&&(e[n].style.display="none")})},w=function(e,t){t.forEach(function(n){e[n]&&e[n]&&(e[n].style.display="block")})},f=function(e,t,n){t.includes("subToolbar")&&(e.toolbar.element.querySelectorAll(".vditor-hint").forEach(function(i){n&&i.isEqualNode(n)||(i.style.display="none")}),e.toolbar.elements.emoji&&(e.toolbar.elements.emoji.lastElementChild.style.display="none")),t.includes("hint")&&(e.hint.element.style.display="none"),e.wysiwyg.popover&&t.includes("popover")&&(e.wysiwyg.popover.style.display="none")},u=function(e,t,n,i){n.addEventListener((0,l.Le)(),function(r){r.preventDefault(),r.stopPropagation(),!n.classList.contains(k.g.CLASS_MENU_DISABLED)&&(e.toolbar.element.querySelectorAll(".vditor-hint--current").forEach(function(o){o.classList.remove("vditor-hint--current")}),t.style.display==="block"?t.style.display="none":(f(e,["subToolbar","hint","popover"],n.parentElement.parentElement),n.classList.contains("vditor-tooltipped")||n.classList.add("vditor-hint--current"),t.style.display="block",e.toolbar.element.getBoundingClientRect().right-n.getBoundingClientRect().right<250?t.classList.add("vditor-panel--left"):t.classList.remove("vditor-panel--left")))})},s=F(106),S=F(771),D=function(e,t,n,i){i&&console.log("".concat(e," - ").concat(n,": ").concat(t))},C=F(135),H=F(775),G=F(428),J=F(325),me=F(483),ke=F(999),ve=F(472),Pe=F(637),Te=F(11),_e=F(194),De=F(229),Ke=F(825),St=F(497),Tt=function(e,t,n){n===void 0&&(n="sv");var i=document.createElement("div");i.innerHTML=e;var r=!1;i.childElementCount===1&&i.lastElementChild.style.fontFamily.indexOf("monospace")>-1&&(r=!0);var o=i.querySelectorAll("pre");if(i.childElementCount===1&&o.length===1&&o[0].className!=="vditor-wysiwyg"&&o[0].className!=="vditor-sv"&&(r=!0),e.indexOf(`
<p class="p1">`)===0&&(r=!0),i.childElementCount===1&&i.firstElementChild.tagName==="TABLE"&&i.querySelector(".line-number")&&i.querySelector(".line-content")&&(r=!0),r){var a=t||e;return/\n/.test(a)||o.length===1?n==="wysiwyg"?'<div class="vditor-wysiwyg__block" data-block="0" data-type="code-block"><pre><code>'.concat(a.replace(/&/g,"&amp;").replace(/</g,"&lt;"),"<wbr></code></pre></div>"):"\n```\n"+a.replace(/&/g,"&amp;").replace(/</g,"&lt;")+"\n```":n==="wysiwyg"?"<code>".concat(a.replace(/&/g,"&amp;").replace(/</g,"&lt;"),"</code><wbr>"):"`".concat(a,"`")}return!1},je=function(e,t){if(e){if(e.parentElement.getAttribute("data-type")==="html-block"){e.setAttribute("data-render","1");return}var n=e.firstElementChild.className.replace("language-","");if(n==="abc")(0,C.Q)(e,t.options.cdn);else if(n==="mermaid")(0,Pe.i)(e,t.options.cdn,t.options.theme);else if(n==="smiles")(0,Ke.J)(e,t.options.cdn,t.options.theme);else if(n==="markmap")(0,Te.K)(e,t.options.cdn);else if(n==="flowchart")(0,J.P)(e,t.options.cdn);else if(n==="echarts")(0,H.p)(e,t.options.cdn,t.options.theme);else if(n==="mindmap")(0,_e.P)(e,t.options.cdn,t.options.theme);else if(n==="plantuml")(0,De.B)(e,t.options.cdn);else if(n==="graphviz")(0,me.v)(e,t.options.cdn);else if(n==="wavedrom")(0,St.F)(e,t.options.cdn);else if(n==="math")(0,ve.H)(e,{cdn:t.options.cdn,math:t.options.preview.math});else{var i=t.options.customRenders.find(function(r){if(r.language===n)return r.render(e,t),!0});i||((0,ke.s)(Object.assign({},t.options.preview.hljs),e,t.options.cdn),(0,G.O)(e,t.options.preview.hljs))}e.setAttribute("data-render","1")}},M=F(810),at=function(e){if(e.currentMode!=="sv"){var t=e[e.currentMode].element,n=e.outline.render(e);n===""&&(n="[ToC]"),t.querySelectorAll('[data-type="toc-block"]').forEach(function(i){i.innerHTML=n,(0,ve.H)(i,{cdn:e.options.cdn,math:e.options.preview.math})})}},Ot=function(e,t){var n=(0,s.lG)(e.target,"SPAN");if(n&&(0,s.fb)(n,"vditor-toc")){var i=t[t.currentMode].element.querySelector("#"+n.getAttribute("data-target-id"));if(i)if(t.options.height==="auto"){var r=i.offsetTop+t.element.offsetTop;t.options.toolbarConfig.pin||(r+=t.toolbar.element.offsetHeight),window.scrollTo(window.scrollX,r)}else t.element.offsetTop<window.scrollY&&window.scrollTo(window.scrollX,t.element.offsetTop),t[t.currentMode].element.scrollTop=i.offsetTop;return}},gt=function(e,t,n,i){if(e.previousElementSibling&&e.previousElementSibling.classList.contains("vditor-toc")){if(n.key==="Backspace"&&(0,M.im)(e,t[t.currentMode].element,i).start===0)return e.previousElementSibling.remove(),fe(t),!0;if(Bt(t,n,i,e,e.previousElementSibling))return!0}if(e.nextElementSibling&&e.nextElementSibling.classList.contains("vditor-toc")){if(n.key==="Delete"&&(0,M.im)(e,t[t.currentMode].element,i).start>=e.textContent.trimRight().length)return e.nextElementSibling.remove(),fe(t),!0;if(Jt(t,n,i,e,e.nextElementSibling))return!0}if(n.key==="Backspace"||n.key==="Delete"){var r=(0,s.fb)(i.startContainer,"vditor-toc");if(r)return r.remove(),fe(t),!0}},bt=function(e,t,n,i){n===void 0&&(n=!1);var r=(0,s.F9)(t.startContainer);if(r&&!n&&r.getAttribute("data-type")!=="code-block"){if(gn(r.innerHTML)&&r.previousElementSibling||bn(r.innerHTML))return;for(var o=(0,M.im)(r,e.ir.element,t).start,a=!0,m=o-1;m>r.textContent.substr(0,o).lastIndexOf(`
`);m--)if(r.textContent.charAt(m)!==" "&&r.textContent.charAt(m)!=="	"){a=!1;break}o===0&&(a=!1);for(var v=!0,m=o-1;m<r.textContent.length;m++)if(r.textContent.charAt(m)!==" "&&r.textContent.charAt(m)!==`
`){v=!1;break}if(a){typeof e.options.input=="function"&&e.options.input(N(e));return}if(v&&/^#{1,6} $/.test(r.textContent)&&(v=!1),v){var d=(0,s.fb)(t.startContainer,"vditor-ir__marker");if(!d){var _=t.startContainer.previousSibling;_&&_.nodeType!==3&&_.classList.contains("vditor-ir__node--expand")&&_.classList.remove("vditor-ir__node--expand"),typeof e.options.input=="function"&&e.options.input(N(e));return}}}if(e.ir.element.querySelectorAll(".vditor-ir__node--expand").forEach(function(ye){ye.classList.remove("vditor-ir__node--expand")}),r||(r=e.ir.element),!r.querySelector("wbr")){var L=(0,s.fb)(t.startContainer,"vditor-ir__preview");L?L.previousElementSibling.insertAdjacentHTML("beforeend","<wbr>"):t.insertNode(document.createElement("wbr"))}r.querySelectorAll("[style]").forEach(function(ye){ye.removeAttribute("style")}),r.getAttribute("data-type")==="link-ref-defs-block"&&(r=e.ir.element);var z=r.isEqualNode(e.ir.element),W=(0,s.a1)(r,"data-type","footnotes-block"),j="";if(z)j=r.innerHTML;else{var K=(0,S.S)(t.startContainer,"BLOCKQUOTE"),Z=(0,s.O9)(t.startContainer);if(Z&&(r=Z),K&&(!Z||Z&&!K.contains(Z))&&(r=K),W&&(r=W),j=r.outerHTML,r.tagName==="UL"||r.tagName==="OL"){var te=r.previousElementSibling,ue=r.nextElementSibling;te&&(te.tagName==="UL"||te.tagName==="OL")&&(j=te.outerHTML+j,te.remove()),ue&&(ue.tagName==="UL"||ue.tagName==="OL")&&(j=j+ue.outerHTML,ue.remove()),j=j.replace("<div><wbr><br></div>","<li><p><wbr><br></p></li>")}else r.previousElementSibling&&r.previousElementSibling.textContent.replace(k.g.ZWSP,"")!==""&&i&&i.inputType==="insertParagraph"&&(j=r.previousElementSibling.outerHTML+j,r.previousElementSibling.remove());r.innerText.startsWith("```")||(e.ir.element.querySelectorAll("[data-type='link-ref-defs-block']").forEach(function(ye){ye&&!r.isEqualNode(ye)&&(j+=ye.outerHTML,ye.remove())}),e.ir.element.querySelectorAll("[data-type='footnotes-block']").forEach(function(ye){ye&&!r.isEqualNode(ye)&&(j+=ye.outerHTML,ye.remove())}))}if(D("SpinVditorIRDOM",j,"argument",e.options.debugger),j=e.lute.SpinVditorIRDOM(j),D("SpinVditorIRDOM",j,"result",e.options.debugger),z)r.innerHTML=j;else if(r.outerHTML=j,W){var se=(0,s.a1)(e.ir.element.querySelector("wbr"),"data-type","footnotes-def");if(se){var X=se.textContent,ae=X.substring(1,X.indexOf("]:")),he=e.ir.element.querySelector('sup[data-type="footnotes-ref"][data-footnotes-label="'.concat(ae,'"]'));he&&he.setAttribute("aria-label",X.substr(ae.length+3).trim().substr(0,24))}}var Ue,dt=e.ir.element.querySelectorAll("[data-type='link-ref-defs-block']");dt.forEach(function(ye,Ze){Ze===0?Ue=ye:(Ue.insertAdjacentHTML("beforeend",ye.innerHTML),ye.remove())}),dt.length>0&&e.ir.element.insertAdjacentElement("beforeend",dt[0]);var it,Ae=e.ir.element.querySelectorAll("[data-type='footnotes-block']");Ae.forEach(function(ye,Ze){Ze===0?it=ye:(it.insertAdjacentHTML("beforeend",ye.innerHTML),ye.remove())}),Ae.length>0&&e.ir.element.insertAdjacentElement("beforeend",Ae[0]),(0,M.ib)(e.ir.element,t),e.ir.element.querySelectorAll(".vditor-ir__preview[data-render='2']").forEach(function(ye){je(ye,e)}),at(e),_t(e,{enableAddUndoStack:!0,enableHint:!0,enableInput:!0})},Y=function(e,t,n){n===void 0&&(n="end");var i=e.sv.element;i.setRangeText(t,i.selectionStart,i.selectionEnd,n),i.focus()},de=function(e,t){Y(e,t)},B=function(e,t){t===void 0&&(t={enableAddUndoStack:!0,enableHint:!1,enableInput:!0}),e.preview.render(e);var n=N(e);typeof e.options.input=="function"&&t.enableInput&&e.options.input(n),e.options.counter.enable&&e.counter.render(e,n),e.options.cache.enable&&(0,l.pK)()&&(localStorage.setItem(e.options.cache.id,n),e.options.cache.after&&e.options.cache.after(n)),e.devtools&&e.devtools.renderEchart(e),clearTimeout(e.sv.processTimeoutId),e.sv.processTimeoutId=window.setTimeout(function(){t.enableAddUndoStack&&!e.sv.composingLock&&e.undo.addToUndoStack(e)},e.options.undoDelay)},q=function(e,t){var n=e.sv.element,i=n.value.lastIndexOf(`
`,n.selectionStart-1)+1,r=n.value.indexOf(`
`,n.selectionEnd),o=r===-1?n.value.length:r,a=n.value.substring(i,o),m=t?t+a.replace(/^#{1,6}\s+/,""):a.replace(/^#{1,6}\s+/,"");n.setRangeText(m,i,o,"select"),n.focus(),B(e)},Ce=function(e,t,n,i){var r=e.sv.element,o=t.getAttribute("data-type"),a=r.selectionStart,m=r.selectionEnd,v=r.value.substring(a,m),d="",_=a+n.length,L=_+v.length;if(o==="check"||o==="list"||o==="ordered-list"||o==="quote"){var z=r.value.lastIndexOf(`
`,a-1)+1,W=r.value.indexOf(`
`,m),j=W===-1?r.value.length:W,K=r.value.substring(z,j);d=K.split(`
`).map(function(Z){return n+Z}).join(`
`),r.setRangeText(d,z,j,"select")}else o==="line"?(d="".concat(a===0?"":`

`).concat(n,`
`),r.setRangeText(d,a,m,"end")):o==="code"?(d="".concat(n,`
`).concat(v).concat(i),r.setRangeText(d,a,m,"end"),_=a+n.length+1,L=_+v.length,r.setSelectionRange(_,L)):o==="table"?(d="".concat(a===0?"":`

`).concat(n).concat(i),r.setRangeText(d,a,m,"end")):(d="".concat(n).concat(v).concat(i),r.setRangeText(d,a,m,"end"),r.setSelectionRange(_,L));r.focus(),B(e)},ee=function(e){switch(e.currentMode){case"ir":return e.ir.element;case"wysiwyg":return e.wysiwyg.element;case"sv":return e.sv.element}},He=function(e,t){e.options.upload.setHeaders&&(e.options.upload.headers=e.options.upload.setHeaders()),e.options.upload.headers&&Object.keys(e.options.upload.headers).forEach(function(n){t.setRequestHeader(n,e.options.upload.headers[n])})},Me=function(e,t,n,i){function r(o){return o instanceof n?o:new n(function(a){a(o)})}return new(n||(n=Promise))(function(o,a){function m(_){try{d(i.next(_))}catch(L){a(L)}}function v(_){try{d(i.throw(_))}catch(L){a(L)}}function d(_){_.done?o(_.value):r(_.value).then(m,v)}d((i=i.apply(e,t||[])).next())})},We=function(e,t){var n={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},i,r,o,a;return a={next:m(0),throw:m(1),return:m(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function m(d){return function(_){return v([d,_])}}function v(d){if(i)throw new TypeError("Generator is already executing.");for(;a&&(a=0,d[0]&&(n=0)),n;)try{if(i=1,r&&(o=d[0]&2?r.return:d[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,d[1])).done)return o;switch(r=0,o&&(d=[d[0]&2,o.value]),d[0]){case 0:case 1:o=d;break;case 4:return n.label++,{value:d[1],done:!1};case 5:n.label++,r=d[1],d=[0];continue;case 7:d=n.ops.pop(),n.trys.pop();continue;default:if(o=n.trys,!(o=o.length>0&&o[o.length-1])&&(d[0]===6||d[0]===2)){n=0;continue}if(d[0]===3&&(!o||d[1]>o[0]&&d[1]<o[3])){n.label=d[1];break}if(d[0]===6&&n.label<o[1]){n.label=o[1],o=d;break}if(o&&n.label<o[2]){n.label=o[2],n.ops.push(d);break}o[2]&&n.ops.pop(),n.trys.pop();continue}d=t.call(e,n)}catch(_){d=[6,_],r=0}finally{i=o=0}if(d[0]&5)throw d[1];return{value:d[0]?d[1]:void 0,done:!0}}},oe=(function(){function e(){this.isUploading=!1,this.element=document.createElement("div"),this.element.className="vditor-upload"}return e})(),x=function(e,t){e.tip.hide();for(var n=[],i="",r="",o=e.options.lang,a=e.options,m=function(L,z){var W=t[z],j=!0;W.name||(i+="<li>".concat(window.VditorI18n.nameEmpty,"</li>"),j=!1),W.size>e.options.upload.max&&(i+="<li>".concat(W.name," ").concat(window.VditorI18n.over," ").concat(e.options.upload.max/1024/1024,"M</li>"),j=!1);var K=W.name.lastIndexOf("."),Z=W.name.substr(K),te=e.options.upload.filename(W.name.substr(0,K))+Z;if(e.options.upload.accept){var ue=e.options.upload.accept.split(",").some(function(se){var X=se.trim();if(X.indexOf(".")===0){if(Z.toLowerCase()===X.toLowerCase())return!0}else if(W.type.split("/")[0]===X.split("/")[0])return!0;return!1});ue||(i+="<li>".concat(W.name," ").concat(window.VditorI18n.fileTypeError,"</li>"),j=!1)}j&&(n.push(W),r+="<li>".concat(te," ").concat(window.VditorI18n.uploading,' <a class="vditorCancelUpload" href="javascript:void(0)">').concat(window.VditorI18n.cancelUpload,"</a></li>"))},v=t.length,d=0;d<v;d++)m(v,d);if(e.tip.show("<ul>".concat(i).concat(r,"</ul>")),e.options.upload.cancel){var _=e.tip.element.querySelector(".vditorCancelUpload");_&&_.addEventListener("click",function(){e.options.upload.cancel(n),e.tip.hide(),e.upload.isUploading=!1})}return n},O=function(e,t){var n=ee(t);n.focus();var i=JSON.parse(e),r="";i.code===1&&(r="".concat(i.msg)),i.data.errFiles&&i.data.errFiles.length>0&&(r="<ul><li>".concat(r,"</li>"),i.data.errFiles.forEach(function(a){var m=a.lastIndexOf("."),v=t.options.upload.filename(a.substr(0,m))+a.substr(m);r+="<li>".concat(v," ").concat(window.VditorI18n.uploadError,"</li>")}),r+="</ul>"),r?t.tip.show(r):t.tip.hide();var o="";if(Object.keys(i.data.succMap).forEach(function(a){var m=i.data.succMap[a],v=a.lastIndexOf("."),d=a.substr(v),_=t.options.upload.filename(a.substr(0,v))+d;d=d.toLowerCase(),d.indexOf(".wav")===0||d.indexOf(".mp3")===0||d.indexOf(".ogg")===0?t.currentMode==="wysiwyg"?o+=`<div class="vditor-wysiwyg__block" data-type="html-block"
 data-block="0"><pre><code>&lt;audio controls="controls" src="`.concat(m,'"&gt;&lt;/audio&gt;</code></pre><pre class="vditor-wysiwyg__preview" data-render="1"><audio controls="controls" src="').concat(m,`"></audio></pre></div>
`):t.currentMode==="ir"?o+='<audio controls="controls" src="'.concat(m,`"></audio>
`):o+="[".concat(_,"](").concat(m,`)
`):d.indexOf(".apng")===0||d.indexOf(".bmp")===0||d.indexOf(".gif")===0||d.indexOf(".ico")===0||d.indexOf(".cur")===0||d.indexOf(".jpg")===0||d.indexOf(".jpeg")===0||d.indexOf(".jfif")===0||d.indexOf(".pjp")===0||d.indexOf(".pjpeg")===0||d.indexOf(".png")===0||d.indexOf(".svg")===0||d.indexOf(".webp")===0?t.currentMode==="wysiwyg"?o+='<img alt="'.concat(_,'" src="').concat(m,`">
`):o+="![".concat(_,"](").concat(m,`)
`):t.currentMode==="wysiwyg"?o+='<a href="'.concat(m,'">').concat(_,`</a>
`):o+="[".concat(_,"](").concat(m,`)
`)}),!o){t.currentMode==="sv"?t.sv.element.setSelectionRange(t.upload.selectionStart,t.upload.selectionEnd):(0,M.Hc)(t.upload.range);return}t.currentMode==="sv"?(t.sv.element.setSelectionRange(t.upload.selectionStart,t.upload.selectionEnd),de(t,o),B(t),t.upload.selectionStart=t.sv.element.selectionStart,t.upload.selectionEnd=t.sv.element.selectionEnd):((0,M.Hc)(t.upload.range),document.execCommand("insertHTML",!1,o),t.upload.range=getSelection().getRangeAt(0).cloneRange())},R=function(e,t,n){return Me(void 0,void 0,void 0,function(){var i,r,j,o,a,a,m,v,d,_,L,z,W,j,K,Z;return We(this,function(te){switch(te.label){case 0:for(i=[],r=e.options.upload.multiple===!0?t.length:1,j=0;j<r;j++)o=t[j],o instanceof DataTransferItem&&(o=o.getAsFile()),i.push(o);return e.options.upload.handler?[4,e.options.upload.handler(i)]:[3,2];case 1:return a=te.sent(),n&&(n.value=""),typeof a=="string"?(e.tip.show(a),[2]):[2];case 2:return!e.options.upload.url||!e.upload?(n&&(n.value=""),e.tip.show("please config: options.upload.url"),[2]):e.options.upload.file?[4,e.options.upload.file(i)]:[3,4];case 3:i=te.sent(),te.label=4;case 4:if(e.options.upload.validate&&(a=e.options.upload.validate(i),typeof a=="string"))return e.tip.show(a),[2];if(m=ee(e),e.currentMode==="sv"?(e.upload.selectionStart=e.sv.element.selectionStart,e.upload.selectionEnd=e.sv.element.selectionEnd):e.upload.range=(0,M.zh)(e),v=x(e,i),v.length===0)return n&&(n.value=""),[2];for(d=new FormData,_=e.options.upload.extraData,L=0,z=Object.keys(_);L<z.length;L++)W=z[L],d.append(W,_[W]);for(j=0,K=v.length;j<K;j++)d.append(e.options.upload.fieldName,v[j]);return Z=new XMLHttpRequest,e.upload.xhr=Z,Z.open("POST",e.options.upload.url),e.options.upload.token&&Z.setRequestHeader("X-Upload-Token",e.options.upload.token),e.options.upload.withCredentials&&(Z.withCredentials=!0),He(e,Z),e.upload.isUploading=!0,e.currentMode==="sv"?e.sv.element.disabled=!0:m.setAttribute("contenteditable","false"),Z.onreadystatechange=function(){if(Z.readyState===XMLHttpRequest.DONE){if(e.upload.isUploading=!1,e.currentMode==="sv"?e.sv.element.disabled=!1:m.setAttribute("contenteditable","true"),Z.status>=200&&Z.status<300)if(e.options.upload.success)e.options.upload.success(m,Z.responseText);else{var ue=Z.responseText;e.options.upload.format&&(ue=e.options.upload.format(t,Z.responseText)),O(ue,e)}else e.options.upload.error?e.options.upload.error(Z.responseText):e.tip.show(Z.responseText);n&&(n.value=""),e.upload.element.style.display="none",e.upload.xhr=void 0}},Z.upload.onprogress=function(ue){if(ue.lengthComputable){var se=ue.loaded/ue.total*100;e.upload.element.style.display="block";var X=e.upload.element;X.style.width=se+"%"}},Z.send(d),[2]}})})},I=function(e,t){t===void 0&&(t={enableAddUndoStack:!0,enableHint:!1,enableInput:!0}),(0,p.W)(e.wysiwyg.element,"wysiwyg",e.options.preview.markdown.imageCaption),t.enableHint&&e.hint.render(e),clearTimeout(e.wysiwyg.afterRenderTimeoutId),e.wysiwyg.afterRenderTimeoutId=window.setTimeout(function(){if(!e.wysiwyg.composingLock){var n=N(e);typeof e.options.input=="function"&&t.enableInput&&e.options.input(n),e.options.counter.enable&&e.counter.render(e,n),e.options.cache.enable&&(0,l.pK)()&&(localStorage.setItem(e.options.cache.id,n),e.options.cache.after&&e.options.cache.after(n)),e.devtools&&e.devtools.renderEchart(e),t.enableAddUndoStack&&e.undo.addToUndoStack(e)}},e.options.undoDelay)},U=function(e){for(var t=e.previousSibling;t;){if(t.nodeType!==3&&t.tagName==="A"&&!t.previousSibling&&t.innerHTML.replace(k.g.ZWSP,"")===""&&t.nextSibling)return t;t=t.previousSibling}return!1},V=function(e){for(var t=e.startContainer.nextSibling;t&&t.textContent==="";)t=t.nextSibling;return!!(t&&t.nodeType!==3&&(t.tagName==="CODE"||t.getAttribute("data-type")==="math-inline"||t.getAttribute("data-type")==="html-entity"||t.getAttribute("data-type")==="html-inline"))},P=function(e){for(var t="",n=e.nextSibling;n;)n.nodeType===3?t+=n.textContent:t+=n.outerHTML,n=n.nextSibling;return t},re=function(e){for(var t="",n=e.previousSibling;n;)n.nodeType===3?t=n.textContent+t:t=n.outerHTML+t,n=n.previousSibling;return t},le=function(e){for(var t=e;t&&!t.nextSibling;)t=t.parentElement;return t.nextSibling},be=function(e){var t=re(e.startContainer),n=P(e.startContainer),i=e.startContainer.textContent,r=e.startOffset,o="",a="";return(i.substr(0,r)!==""&&i.substr(0,r)!==k.g.ZWSP||t)&&(o="".concat(t).concat(i.substr(0,r))),(i.substr(r)!==""&&i.substr(r)!==k.g.ZWSP||n)&&(a="".concat(i.substr(r)).concat(n)),{afterHTML:a,beforeHTML:o}},xe=function(e,t){Array.from(e.wysiwyg.element.childNodes).find(function(n){if(n.nodeType===3){var i=document.createElement("p");i.setAttribute("data-block","0"),i.textContent=n.textContent;var r=t.startContainer.nodeType===3?t.startOffset:n.textContent.length;return n.parentNode.insertBefore(i,n),n.remove(),t.setStart(i.firstChild,Math.min(i.firstChild.textContent.length,r)),t.collapse(!0),(0,M.Hc)(t),!0}else if(!n.getAttribute("data-block"))return n.tagName==="P"?n.remove():(n.tagName==="DIV"?(t.insertNode(document.createElement("wbr")),n.outerHTML='<p data-block="0">'.concat(n.innerHTML,"</p>")):n.tagName==="BR"?n.outerHTML='<p data-block="0">'.concat(n.outerHTML,"<wbr></p>"):(t.insertNode(document.createElement("wbr")),n.outerHTML='<p data-block="0">'.concat(n.outerHTML,"</p>")),(0,M.ib)(e.wysiwyg.element,t),t=getSelection().getRangeAt(0)),!0})},Ne=function(e,t,n){var i,r=(0,s.F9)(t.startContainer);if(r||(r=e.wysiwyg.element),n&&n.inputType!=="formatItalic"&&n.inputType!=="deleteByDrag"&&n.inputType!=="insertFromDrop"&&n.inputType!=="formatBold"&&n.inputType!=="formatRemove"&&n.inputType!=="formatStrikeThrough"&&n.inputType!=="insertUnorderedList"&&n.inputType!=="insertOrderedList"&&n.inputType!=="formatOutdent"&&n.inputType!=="formatIndent"&&n.inputType!==""||!n){var o=U(t.startContainer);o&&o.remove(),e.wysiwyg.element.querySelectorAll("wbr").forEach(function(X){X.remove()}),t.insertNode(document.createElement("wbr")),r.querySelectorAll("[style]").forEach(function(X){X.removeAttribute("style")}),r.querySelectorAll(".vditor-comment").forEach(function(X){X.textContent.trim()===""&&(X.classList.remove("vditor-comment","vditor-comment--focus"),X.removeAttribute("data-cmtids"))}),(i=r.previousElementSibling)===null||i===void 0||i.querySelectorAll(".vditor-comment").forEach(function(X){X.textContent.trim()===""&&(X.classList.remove("vditor-comment","vditor-comment--focus"),X.removeAttribute("data-cmtids"))});var a="";r.getAttribute("data-type")==="link-ref-defs-block"&&(r=e.wysiwyg.element);var m=r.isEqualNode(e.wysiwyg.element),v=(0,s.a1)(r,"data-type","footnotes-block"),d=(0,s.a1)(t.startContainer,"data-type","callout");if(m)a=r.innerHTML;else{var _=(0,s.O9)(t.startContainer);if(_&&!v){var L=(0,S.S)(t.startContainer,"BLOCKQUOTE");L?r=(0,s.F9)(t.startContainer)||r:r=_}if(v&&(r=v),d&&(r=d),a=r.outerHTML,r.tagName==="UL"||r.tagName==="OL"){var z=r.previousElementSibling,W=r.nextElementSibling;z&&(z.tagName==="UL"||z.tagName==="OL")&&(a=z.outerHTML+a,z.remove()),W&&(W.tagName==="UL"||W.tagName==="OL")&&(a=a+W.outerHTML,W.remove()),a=a.replace("<div><wbr><br></div>","<li><p><wbr><br></p></li>")}r.innerText.startsWith("```")||(e.wysiwyg.element.querySelectorAll("[data-type='link-ref-defs-block']").forEach(function(X){X&&!r.isEqualNode(X)&&(a+=X.outerHTML,X.remove())}),e.wysiwyg.element.querySelectorAll("[data-type='footnotes-block']").forEach(function(X){X&&!r.isEqualNode(X)&&(a+=X.outerHTML,X.remove())}))}if(a=a.replace(/<\/(strong|b)><strong data-marker="\W{2}">/g,"").replace(/<\/(em|i)><em data-marker="\W{1}">/g,"").replace(/<\/(s|strike)><s data-marker="~{1,2}">/g,""),a==='<p data-block="0">```<wbr></p>'&&e.hint.recentLanguage&&(a='<p data-block="0">```<wbr></p>'.replace("```","```"+e.hint.recentLanguage)),D("SpinVditorDOM",a,"argument",e.options.debugger),a=e.lute.SpinVditorDOM(a),D("SpinVditorDOM",a,"result",e.options.debugger),m)r.innerHTML=a;else if(r.outerHTML=a,v){var j=(0,s.E2)(e.wysiwyg.element.querySelector("wbr"),"LI");if(j){var K=e.wysiwyg.element.querySelector('sup[data-type="footnotes-ref"][data-footnotes-label="'.concat(j.getAttribute("data-marker"),'"]'));K&&K.setAttribute("aria-label",j.textContent.trim().substr(0,24))}}var Z,te=e.wysiwyg.element.querySelectorAll("[data-type='link-ref-defs-block']");te.forEach(function(X,ae){ae===0?Z=X:(Z.insertAdjacentHTML("beforeend",X.innerHTML),X.remove())}),te.length>0&&e.wysiwyg.element.insertAdjacentElement("beforeend",te[0]);var ue,se=e.wysiwyg.element.querySelectorAll("[data-type='footnotes-block']");se.forEach(function(X,ae){ae===0?ue=X:(ue.insertAdjacentHTML("beforeend",X.innerHTML),X.remove())}),se.length>0&&e.wysiwyg.element.insertAdjacentElement("beforeend",se[0]),(0,M.ib)(e.wysiwyg.element,t),e.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__preview[data-render='2']").forEach(function(X){je(X,e)}),n&&(n.inputType==="deleteContentBackward"||n.inputType==="deleteContentForward")&&e.options.comment.enable&&(e.wysiwyg.triggerRemoveComment(e),e.options.comment.adjustTop(e.wysiwyg.getComments(e,!0)))}at(e),I(e,{enableAddUndoStack:!0,enableHint:!0,enableInput:!0})},pe=function(e,t){if(e==="")return!1;if(e.indexOf("\u21E7")===-1&&e.indexOf("\u2318")===-1&&e.indexOf("\u2325")===-1)return!(0,l.yl)(t)&&!t.altKey&&!t.shiftKey&&t.code===e;if(e==="\u21E7Tab")return!!(!(0,l.yl)(t)&&!t.altKey&&t.shiftKey&&t.code==="Tab");var n=e.split("");if(e.startsWith("\u2325")){var i=n.length===3?n[2]:n[1];return!!((n.length===3?(0,l.yl)(t):!(0,l.yl)(t))&&t.altKey&&!t.shiftKey&&t.code===(/^[0-9]$/.test(i)?"Digit":"Key")+i)}e==="\u2318Enter"&&(n=["\u2318","Enter"]);var r=n.length>2&&n[0]==="\u21E7",o=r?n[2]:n[1];return r&&((0,l.vU)()||!/Mac/.test(navigator.platform))&&(o==="-"?o="_":o==="="&&(o="+")),!!((0,l.yl)(t)&&t.key.toLowerCase()===o.toLowerCase()&&!t.altKey&&(!r&&!t.shiftKey||r&&t.shiftKey))},tt=function(e){var t=e.startContainer;if(t.nodeType===3&&t.nodeValue.length!==e.startOffset)return!1;for(var n=t.nextSibling;n&&n.textContent==="";)n=n.nextSibling;if(n){if(n&&n.nodeType!==3&&n.classList.contains("vditor-ir__node")&&!n.getAttribute("data-block"))return n}else{var i=(0,s.fb)(t,"vditor-ir__marker");if(i&&!i.nextSibling){var r=t.parentElement.parentElement.nextSibling;if(r&&r.nodeType!==3&&r.classList.contains("vditor-ir__node"))return r}return!1}return!1},st=function(e){var t=e.startContainer,n=t.previousSibling;return t.nodeType===3&&e.startOffset===0&&n&&n.nodeType!==3&&n.classList.contains("vditor-ir__node")&&!n.getAttribute("data-block")?n:!1},Fe=function(e,t){t.ir.element.querySelectorAll(".vditor-ir__node--expand").forEach(function(a){a.classList.remove("vditor-ir__node--expand")});var n=(0,s.JQ)(e.startContainer,"vditor-ir__node"),i=!e.collapsed&&(0,s.JQ)(e.endContainer,"vditor-ir__node");if(!(!e.collapsed&&(!n||n!==i))){n&&(n.classList.add("vditor-ir__node--expand"),n.classList.remove("vditor-ir__node--hidden"),(0,M.Hc)(e));var r=tt(e);if(r){r.classList.add("vditor-ir__node--expand"),r.classList.remove("vditor-ir__node--hidden");return}var o=st(e);if(o){o.classList.add("vditor-ir__node--expand"),o.classList.remove("vditor-ir__node--hidden");return}}},Ge=function(e,t){if(e.ir.composingLock=t.isComposing,t.isComposing)return!1;t.key.indexOf("Arrow")===-1&&t.key!=="Meta"&&t.key!=="Control"&&t.key!=="Alt"&&t.key!=="Shift"&&t.key!=="CapsLock"&&t.key!=="Escape"&&!/^F\d{1,2}$/.test(t.key)&&e.undo.recordFirstPosition(e,t);var n=(0,M.zh)(e),i=n.startContainer;if(!On(t,e,i)||(Dn(n,e,t),Yn(n),t.key!=="Enter"&&t.key!=="Tab"&&t.key!=="Backspace"&&t.key.indexOf("Arrow")===-1&&!(0,l.yl)(t)&&t.key!=="Escape"&&t.key!=="Delete"))return!1;var r=(0,s.a1)(i,"data-newline","1");if(!(0,l.yl)(t)&&!t.altKey&&!t.shiftKey&&t.key==="Enter"&&r&&n.startOffset<r.textContent.length){var o=r.previousElementSibling;o&&(n.insertNode(document.createTextNode(o.textContent)),n.collapse(!1));var a=r.nextSibling;a&&(n.insertNode(document.createTextNode(a.textContent)),n.collapse(!0))}var m=(0,s.lG)(i,"P");if(Bn(t,e,m,n)||Pn(n,e,m,t)||Kn(e,n,t,m))return!0;var v=(0,s.fb)(i,"vditor-ir__marker--pre");if(v&&v.tagName==="PRE"){var d=v.firstChild;if(qn(e,t,v,n)||(d.getAttribute("data-type")==="math-block"||d.getAttribute("data-type")==="html-block")&&Bt(e,t,n,d,v.parentElement)||Jt(e,t,n,d,v.parentElement))return!0}var _=(0,s.a1)(i,"data-type","code-block-info");if(_){if(t.key==="Enter"||t.key==="Tab")return n.selectNodeContents(_.nextElementSibling.firstChild),n.collapse(!0),t.preventDefault(),f(e,["hint"]),!0;if(t.key==="Backspace"){var L=(0,M.im)(_,e.ir.element).start;L===1&&n.setStart(i,0),L===2&&(e.hint.recentLanguage="")}if(Bt(e,t,n,_,_.parentElement))return f(e,["hint"]),!0}var z=(0,s.lG)(i,"TD")||(0,s.lG)(i,"TH");if(t.key.indexOf("Arrow")>-1&&z){var W=vr(z);if(W&&Bt(e,t,n,z,W))return!0;var j=yr(z);if(j&&Jt(e,t,n,z,j))return!0}if(Vn(e,t,n)||Gn(e,n,t)||jn(e,n,t))return!0;var K=(0,S.W)(i);if(K){if(pe("\u2318=",t)){var Z=K.querySelector(".vditor-ir__marker--heading");return Z&&Z.textContent.trim().length>1&&Xt(e,Z.textContent.substr(1)),t.preventDefault(),!0}if(pe("\u2318-",t)){var Z=K.querySelector(".vditor-ir__marker--heading");return Z&&Z.textContent.trim().length<6&&Xt(e,Z.textContent.trim()+"# "),t.preventDefault(),!0}}var te=(0,s.F9)(i);if(t.key==="Backspace"&&!(0,l.yl)(t)&&!t.shiftKey&&!t.altKey&&n.toString()===""){if(Zn(e,n,t,m))return!0;if(te&&te.previousElementSibling&&te.tagName!=="UL"&&te.tagName!=="OL"&&(te.previousElementSibling.getAttribute("data-type")==="code-block"||te.previousElementSibling.getAttribute("data-type")==="math-block")){var ue=(0,M.im)(te,e.ir.element,n).start;if(ue===0||ue===1&&te.innerText.startsWith(k.g.ZWSP))return n.selectNodeContents(te.previousElementSibling.querySelector(".vditor-ir__marker--pre code")),n.collapse(!1),Fe(n,e),te.textContent.trim().replace(k.g.ZWSP,"")===""&&(te.remove(),_t(e)),t.preventDefault(),!0}if(K){var se=K.firstElementChild.textContent.length;(0,M.im)(K,e.ir.element).start===se&&se!==0&&(n.setStart(K.firstElementChild.firstChild,se-1),n.collapse(!0),(0,M.Hc)(n))}}return(t.key==="ArrowUp"||t.key==="ArrowDown")&&te&&(te.querySelectorAll(".vditor-ir__node").forEach(function(X){X.contains(i)||X.classList.add("vditor-ir__node--hidden")}),Jn(t,te,n))?!0:(Hn(n,t.key),te&&gt(te,e,t,n)?(t.preventDefault(),!0):!1)},ge=F(190),ce=function(e,t){if(e.sv.composingLock=t.isComposing,t.isComposing||(t.key.indexOf("Arrow")===-1&&t.key!=="Meta"&&t.key!=="Control"&&t.key!=="Alt"&&t.key!=="Shift"&&t.key!=="CapsLock"&&t.key!=="Escape"&&!/^F\d{1,2}$/.test(t.key)&&e.undo.recordFirstPosition(e,t),t.key!=="Tab"||(0,l.yl)(t)||t.altKey))return!1;var n=e.sv.element,i=n.selectionStart,r=n.selectionEnd;if(t.shiftKey){var o=n.value.lastIndexOf(`
`,i-1)+1,a=n.value.substring(o,i).match(/^(\t| {1,4})/);a&&(n.setRangeText("",o,o+a[0].length,"end"),n.setSelectionRange(i-a[0].length,r-a[0].length))}else n.setRangeText(e.options.tab,i,r,"end");return B(e),t.preventDefault(),!0},Be=F(538),Re=function(e){e.options.theme==="dark"?e.element.classList.add("vditor--dark"):e.element.classList.remove("vditor--dark")},nt=function(e){e.element.innerHTML="",e.element.classList.add("vditor"),e.options.rtl&&e.element.setAttribute("dir","rtl"),Re(e),(0,Be.Z)(e.options.preview.theme.current,e.options.preview.theme.path),typeof e.options.height=="number"?e.element.style.height=e.options.height+"px":e.element.style.height=e.options.height,typeof e.options.minHeight=="number"&&(e.element.style.minHeight=e.options.minHeight+"px"),typeof e.options.width=="number"?e.element.style.width=e.options.width+"px":e.element.style.width=e.options.width,e.element.appendChild(e.toolbar.element);var t=document.createElement("div");if(t.className="vditor-content",e.options.outline.position==="left"&&t.appendChild(e.outline.element),t.appendChild(e.wysiwyg.element.parentElement),t.appendChild(e.sv.element),t.appendChild(e.ir.element.parentElement),t.appendChild(e.preview.element),e.toolbar.elements.devtools&&t.appendChild(e.devtools.element),e.options.outline.position==="right"&&(e.outline.element.classList.add("vditor-outline--right"),t.appendChild(e.outline.element)),e.upload&&t.appendChild(e.upload.element),e.options.resize.enable&&t.appendChild(e.resize.element),t.appendChild(e.hint.element),t.appendChild(e.tip.element),e.element.appendChild(t),t.addEventListener("click",function(){f(e,["subToolbar"])}),e.toolbar.elements.export&&e.element.insertAdjacentHTML("beforeend",'<iframe id="vditorExportIframe" style="width: 100%;height: 0;border: 0"></iframe>'),Dt(e,e.options.mode,Nt(e)),document.execCommand("DefaultParagraphSeparator",!1,"p"),navigator.userAgent.indexOf("iPhone")>-1&&typeof window.visualViewport<"u"){var n=!1,i=function(r){n||(n=!0,requestAnimationFrame(function(){n=!1;var o=e.toolbar.element;o.style.transform="none",o.getBoundingClientRect().top<0&&(o.style.transform="translate(0, ".concat(-o.getBoundingClientRect().top,"px)"))}))};window.visualViewport.addEventListener("scroll",i),window.visualViewport.addEventListener("resize",i)}},Ve=function(e){var t=window.innerWidth<=k.g.MOBILE_WIDTH?10:35;if(e.wysiwyg.element.parentElement.style.display!=="none"){var n=(e.wysiwyg.element.parentElement.clientWidth-e.options.preview.maxWidth)/2;e.wysiwyg.element.style.padding="10px ".concat(Math.max(t,n),"px")}if(e.ir.element.parentElement.style.display!=="none"){var n=(e.ir.element.parentElement.clientWidth-e.options.preview.maxWidth)/2;e.ir.element.style.padding="10px ".concat(Math.max(t,n),"px")}e.preview.element.style.display!=="block"?e.toolbar.element.style.paddingLeft=Math.max(5,parseInt(e[e.currentMode].element.style.paddingLeft||"0",10)+(e.options.outline.position==="left"?e.outline.element.offsetWidth:0))+"px":e.toolbar.element.style.paddingLeft=5+(e.options.outline.position==="left"?e.outline.element.offsetWidth:0)+"px"},Oe=function(e){if(e.options.typewriterMode){var t=window.innerHeight;typeof e.options.height=="number"?(t=e.options.height,typeof e.options.minHeight=="number"&&(t=Math.max(t,e.options.minHeight)),t=Math.min(window.innerHeight,t)):t=e.element.clientHeight,e.element.classList.contains("vditor--fullscreen")&&(t=window.innerHeight);var n=(t-e.toolbar.element.offsetHeight)/2+"px";e.currentMode==="sv"?e.sv.element.style.paddingBottom=n:e[e.currentMode].element.style.setProperty("--editor-bottom",n)}},yt;function Ht(){window.removeEventListener("resize",yt)}var Nt=function(e){Oe(e),Ht(),window.addEventListener("resize",yt=function(){Ve(e),Oe(e)});var t=(0,l.pK)()&&localStorage.getItem(e.options.cache.id);return(!e.options.cache.enable||!t)&&(e.options.value?t=e.options.value:e.originalInnerHTML?t=e.lute.HTML2Md(e.originalInnerHTML):e.options.cache.enable||(t="")),t||""},wt=function(e){clearTimeout(e.ir.hlToolbarTimeoutId),e.ir.hlToolbarTimeoutId=window.setTimeout(function(){if(e.ir.element.getAttribute("contenteditable")!=="false"&&(0,M.Gb)(e.ir.element)){g(e.toolbar.elements,k.g.EDIT_TOOLBARS),h(e.toolbar.elements,k.g.EDIT_TOOLBARS);var t=(0,M.zh)(e),n=t.startContainer;t.startContainer.nodeType===3&&(n=t.startContainer.parentElement),n.classList.contains("vditor-reset")&&(n=n.childNodes[t.startOffset]);var i=e.currentMode==="sv"?(0,s.a1)(n,"data-type","heading"):(0,S.W)(n);i&&b(e.toolbar.elements,["headings"]);var r=e.currentMode==="sv"?(0,s.a1)(n,"data-type","blockquote"):(0,s.lG)(n,"BLOCKQUOTE");r&&b(e.toolbar.elements,["quote"]);var o=(0,s.a1)(n,"data-type","strong");o&&b(e.toolbar.elements,["bold"]);var a=(0,s.a1)(n,"data-type","em");a&&b(e.toolbar.elements,["italic"]);var m=(0,s.a1)(n,"data-type","s");m&&b(e.toolbar.elements,["strike"]);var v=(0,s.a1)(n,"data-type","a");v&&b(e.toolbar.elements,["link"]);var d=(0,s.lG)(n,"LI");d?(d.classList.contains("vditor-task")?b(e.toolbar.elements,["check"]):d.parentElement.tagName==="OL"?b(e.toolbar.elements,["ordered-list"]):d.parentElement.tagName==="UL"&&b(e.toolbar.elements,["list"]),h(e.toolbar.elements,["outdent","indent"])):y(e.toolbar.elements,["outdent","indent"]);var _=(0,s.a1)(n,"data-type","code-block");_&&(y(e.toolbar.elements,["headings","bold","italic","strike","line","quote","list","ordered-list","check","code","inline-code","upload","link","table","record"]),b(e.toolbar.elements,["code"]));var L=(0,s.a1)(n,"data-type","code");L&&(y(e.toolbar.elements,["headings","bold","italic","strike","line","quote","list","ordered-list","check","code","upload","link","table","record"]),b(e.toolbar.elements,["inline-code"]));var z=(0,s.a1)(n,"data-type","table");z&&y(e.toolbar.elements,["headings","list","ordered-list","check","line","quote","code","table"])}},200)},Rt=function(e,t){var n=e.ownerDocument.createElement(t);return n.setAttribute("data-block","0"),n},It=function(e,t){for(var n=Rt(e,t);e.firstChild;)n.appendChild(e.firstChild);return e.replaceWith(n),n},tn=function(e){if(e.nodeType!==1)return!1;var t=e;return t.getAttribute("data-block")==="0"||t.tagName==="INPUT"},un=function(e,t){for(var n,i,r=t;r.parentNode&&!r.parentNode.isSameNode(e);)r=r.parentNode;if(!(!((n=r.parentNode)===null||n===void 0)&&n.isSameNode(e)))return[];for(var o=r,a=r;o.previousSibling&&!tn(o.previousSibling);)o=o.previousSibling;for(;a.nextSibling&&!tn(a.nextSibling);)a=a.nextSibling;if(o.previousSibling instanceof HTMLInputElement&&o.nodeType===3){var m=(i=o.textContent.match(/^\s+/))===null||i===void 0?void 0:i[0];m&&(o.textContent=o.textContent.substring(m.length),e.insertBefore(e.ownerDocument.createTextNode(m),o))}for(var v=[],d=o;d&&(v.push(d),!d.isSameNode(a));)d=d.nextSibling;return v},Pt=function(e,t,n){var i=un(e,t);if(i.length===0)return!1;var r=Rt(e,n);return e.insertBefore(r,i[0]),i.forEach(function(o){r.appendChild(o)}),r.innerHTML.trim()==="<wbr>"&&r.appendChild(e.ownerDocument.createElement("br")),!0},Vt=function(e){for(var t=e.ownerDocument.createDocumentFragment();e.firstChild;)t.appendChild(e.firstChild);e.replaceWith(t)},Ct=function(e,t){var n=(0,M.zh)(e),i=(0,s.F9)(n.startContainer);if(i||(i=n.startContainer.childNodes[n.startOffset]),!i&&e.wysiwyg.element.children.length===0&&(i=e.wysiwyg.element),i&&!i.classList.contains("vditor-wysiwyg__block")){var r=document.createElement("wbr");n.insertNode(r),i.innerHTML.trim()==="<wbr>"&&(i.innerHTML="<wbr><br>");var o=(0,s.lG)(r,"LI");if(o&&i.isSameNode(o.parentElement)){if(!Pt(o,r,t)){r.remove();return}}else if(i.tagName==="BLOCKQUOTE"||i.classList.contains("vditor-reset")){for(var a=Rt(i,t);i.firstChild;)a.appendChild(i.firstChild);i.appendChild(a)}else It(i,t);(0,M.ib)(e.wysiwyg.element,n),at(e)}},qt=function(e){var t,n,i=getSelection().getRangeAt(0),r=(0,s.F9)(i.startContainer);r||(r=i.startContainer.childNodes[i.startOffset]),r&&(i.insertNode(document.createElement("wbr")),((t=r.parentElement)===null||t===void 0?void 0:t.tagName)==="LI"&&((n=r.parentElement.parentElement)===null||n===void 0?void 0:n.getAttribute("data-tight"))==="true"?Vt(r):It(r,"p"),(0,M.ib)(e.wysiwyg.element,i),at(e)),e.wysiwyg.popover.style.display="none"},Mt=function(e,t,n){n===void 0&&(n=!0);var i=e.previousElementSibling,r=i.ownerDocument.createRange();i.tagName==="CODE"?(i.style.display="inline-block",n?r.setStart(i.firstChild,1):r.selectNodeContents(i)):(i.style.display="block",i.firstChild.firstChild||i.firstChild.appendChild(document.createTextNode("")),r.selectNodeContents(i.firstChild)),n?r.collapse(!0):r.collapse(!1),(0,M.Hc)(r),!e.firstElementChild.classList.contains("language-mindmap")&&Xe(t)},Kt=function(e,t,n){if(navigator.userAgent.indexOf("Android")===-1||n.ctrlKey||n.metaKey||n.altKey)return!1;var i=(0,s.lG)(t.startContainer,"P"),r=t.startContainer.nodeType===3?t.startContainer.parentElement:t.startContainer;if(!i||!i.isSameNode(r)||!i.parentElement.isSameNode(e.wysiwyg.element))return!1;var o,a;if(n.key==="ArrowLeft")o="backward",a="character";else if(n.key==="ArrowRight")o="forward",a="character";else if(n.key==="ArrowUp")o="backward",a="line";else if(n.key==="ArrowDown")o="forward",a="line";else if(n.key==="End")o="forward",a="documentboundary";else return!1;var m=window.getSelection();return typeof m.modify!="function"?!1:(m.modify(n.shiftKey?"extend":"move",o,a),n.preventDefault(),!0)},jt=function(e,t){if(e.wysiwyg.composingLock=t.isComposing,t.isComposing)return!1;t.key.indexOf("Arrow")===-1&&t.key!=="Meta"&&t.key!=="Control"&&t.key!=="Alt"&&t.key!=="Shift"&&t.key!=="CapsLock"&&t.key!=="Escape"&&!/^F\d{1,2}$/.test(t.key)&&e.undo.recordFirstPosition(e,t);var n=(0,M.zh)(e),i=n.startContainer;if(Kt(e,n,t))return!0;if(!On(t,e,i)||(Dn(n,e,t),Yn(n),t.key!=="Enter"&&t.key!=="Tab"&&t.key!=="Backspace"&&t.key.indexOf("Arrow")===-1&&!(0,l.yl)(t)&&t.key!=="Escape"&&t.key!=="Delete"))return!1;var r=(0,s.F9)(i),o=(0,s.lG)(i,"P");if(Bn(t,e,o,n)||Pn(n,e,o,t)||Vn(e,t,n))return!0;var a=(0,s.fb)(i,"vditor-wysiwyg__block");if(a){if(t.key==="Escape"&&a.children.length===2)return e.wysiwyg.popover.style.display="none",a.firstElementChild.style.display="none",e.wysiwyg.element.blur(),t.preventDefault(),!0;if(!(0,l.yl)(t)&&!t.shiftKey&&t.altKey&&t.key==="Enter"&&a.getAttribute("data-type")==="code-block"){var m=e.wysiwyg.popover.querySelector(".vditor-input");return m.focus(),m.select(),t.preventDefault(),!0}if(a.getAttribute("data-block")==="0"&&(qn(e,t,a.firstElementChild,n)||Jt(e,t,n,a.firstElementChild,a)||a.getAttribute("data-type")!=="yaml-front-matter"&&Bt(e,t,n,a.firstElementChild,a)))return!0}if(Kn(e,n,t,o))return!0;var v=(0,s.E2)(i,"BLOCKQUOTE");if(v&&!t.shiftKey&&t.altKey&&t.key==="Enter"){(0,l.yl)(t)?n.setStartBefore(v):n.setStartAfter(v),(0,M.Hc)(n);var d=document.createElement("p");return d.setAttribute("data-block","0"),d.innerHTML=`
`,n.insertNode(d),n.collapse(!0),(0,M.Hc)(n),I(e),Xe(e),t.preventDefault(),!0}var _=(0,S.W)(i);if(_){if(_.tagName==="H6"&&i.textContent.length===n.startOffset&&!(0,l.yl)(t)&&!t.shiftKey&&!t.altKey&&t.key==="Enter"){var L=document.createElement("p");return L.textContent=`
`,L.setAttribute("data-block","0"),i.parentElement.insertAdjacentElement("afterend",L),n.setStart(L,0),(0,M.Hc)(n),I(e),Xe(e),t.preventDefault(),!0}if(pe("\u2318=",t)){var z=parseInt(_.tagName.substr(1),10)-1;return z>0&&(Ct(e,"h".concat(z)),I(e)),t.preventDefault(),!0}if(pe("\u2318-",t)){var z=parseInt(_.tagName.substr(1),10)+1;return z<7&&(Ct(e,"h".concat(z)),I(e)),t.preventDefault(),!0}t.key==="Backspace"&&!(0,l.yl)(t)&&!t.shiftKey&&!t.altKey&&_.textContent.length===1&&qt(e)}if(Gn(e,n,t))return!0;if(t.altKey&&t.key==="Enter"&&!(0,l.yl)(t)&&!t.shiftKey){var W=(0,s.lG)(i,"A"),j=(0,s.a1)(i,"data-type","link-ref"),K=(0,s.a1)(i,"data-type","footnotes-ref");if(W||j||K||_&&_.tagName.length===2){var Z=e.wysiwyg.popover.querySelector("input");Z.focus(),Z.select()}}if(Qe(e,t))return!0;if(pe("\u21E7\u2318U",t)){var te=e.wysiwyg.popover.querySelector('[data-type="up"]');if(te)return te.click(),t.preventDefault(),!0}if(pe("\u21E7\u2318D",t)){var te=e.wysiwyg.popover.querySelector('[data-type="down"]');if(te)return te.click(),t.preventDefault(),!0}if(jn(e,n,t))return!0;if(!(0,l.yl)(t)&&t.shiftKey&&!t.altKey&&t.key==="Enter"&&i.parentElement.tagName!=="LI"&&i.parentElement.tagName!=="P")return["STRONG","STRIKE","S","I","EM","B"].includes(i.parentElement.tagName)?n.insertNode(document.createTextNode(`
`+k.g.ZWSP)):n.insertNode(document.createTextNode(`
`)),n.collapse(!1),(0,M.Hc)(n),I(e),Xe(e),t.preventDefault(),!0;if(t.key==="Backspace"&&!(0,l.yl)(t)&&!t.shiftKey&&!t.altKey&&n.toString()===""){if(Zn(e,n,t,o))return!0;if(r){if(r.previousElementSibling&&r.previousElementSibling.classList.contains("vditor-wysiwyg__block")&&r.previousElementSibling.getAttribute("data-block")==="0"&&r.tagName!=="UL"&&r.tagName!=="OL"){var ue=(0,M.im)(r,e.wysiwyg.element,n).start;if(ue===0&&n.startOffset===0||ue===1&&r.innerText.startsWith(k.g.ZWSP))return Mt(r.previousElementSibling.lastElementChild,e,!1),r.innerHTML.trim().replace(k.g.ZWSP,"")===""&&(r.remove(),I(e)),t.preventDefault(),!0}var se=n.startOffset;if(n.toString()===""&&i.nodeType===3&&i.textContent.charAt(se-2)===`
`&&i.textContent.charAt(se-1)!==k.g.ZWSP&&["STRONG","STRIKE","S","I","EM","B"].includes(i.parentElement.tagName))return i.textContent=i.textContent.substring(0,se-1)+k.g.ZWSP,n.setStart(i,se),n.collapse(!0),I(e),t.preventDefault(),!0;i.textContent===k.g.ZWSP&&n.startOffset===1&&!i.previousSibling&&V(n)&&(i.textContent=""),r.querySelectorAll("span.vditor-wysiwyg__block[data-type='math-inline']").forEach(function(ae){ae.firstElementChild.style.display="inline",ae.lastElementChild.style.display="none"}),r.querySelectorAll("span.vditor-wysiwyg__block[data-type='html-entity']").forEach(function(ae){ae.firstElementChild.style.display="inline",ae.lastElementChild.style.display="none"})}}if((0,l.vU)()&&n.startOffset===1&&i.textContent.indexOf(k.g.ZWSP)>-1&&i.previousSibling&&i.previousSibling.nodeType!==3&&i.previousSibling.tagName==="CODE"&&(t.key==="Backspace"||t.key==="ArrowLeft"))return n.selectNodeContents(i.previousSibling),n.collapse(!1),t.preventDefault(),!0;if(Jn(t,r,n))return t.preventDefault(),!0;if(Hn(n,t.key),t.key==="ArrowDown"){var X=i.nextSibling;X&&X.nodeType!==3&&X.getAttribute("data-type")==="math-inline"&&n.setStartAfter(X)}return r&&gt(r,e,t,n)?(t.preventDefault(),!0):!1},Qe=function(e,t){if(pe("\u21E7\u2318X",t)){var n=e.wysiwyg.popover.querySelector('[data-type="remove"]');return n&&n.click(),t.preventDefault(),!0}},ht=function(e){clearTimeout(e.wysiwyg.hlToolbarTimeoutId),e.wysiwyg.hlToolbarTimeoutId=window.setTimeout(function(){if(e.wysiwyg.element.getAttribute("contenteditable")!=="false"&&(0,M.Gb)(e.wysiwyg.element)){g(e.toolbar.elements,k.g.EDIT_TOOLBARS),h(e.toolbar.elements,k.g.EDIT_TOOLBARS);var t=getSelection().getRangeAt(0),n=t.startContainer;t.startContainer.nodeType===3?n=t.startContainer.parentElement:n=n.childNodes[t.startOffset>=n.childNodes.length?n.childNodes.length-1:t.startOffset];var i=(0,s.a1)(n,"data-type","footnotes-block");if(i){e.wysiwyg.popover.innerHTML="",lt(i,e),Le(e,"footnotes-block"),rt(e,i);return}var r=(0,s.lG)(n,"LI");r?(r.classList.contains("vditor-task")?b(e.toolbar.elements,["check"]):r.parentElement.tagName==="OL"?b(e.toolbar.elements,["ordered-list"]):r.parentElement.tagName==="UL"&&b(e.toolbar.elements,["list"]),h(e.toolbar.elements,["outdent","indent"])):y(e.toolbar.elements,["outdent","indent"]),(0,s.lG)(n,"BLOCKQUOTE")&&b(e.toolbar.elements,["quote"]),((0,s.lG)(n,"B")||(0,s.lG)(n,"STRONG"))&&b(e.toolbar.elements,["bold"]),((0,s.lG)(n,"I")||(0,s.lG)(n,"EM"))&&b(e.toolbar.elements,["italic"]),((0,s.lG)(n,"STRIKE")||(0,s.lG)(n,"S"))&&b(e.toolbar.elements,["strike"]),e.wysiwyg.element.querySelectorAll(".vditor-comment--focus").forEach(function($){$.classList.remove("vditor-comment--focus")});var o=(0,s.fb)(n,"vditor-comment");if(o){var a=o.getAttribute("data-cmtids").split(" ");if(a.length>1&&o.nextSibling.isSameNode(o.nextElementSibling)){var m=o.nextElementSibling.getAttribute("data-cmtids").split(" ");a.find(function($){if(m.includes($))return a=[$],!0})}e.wysiwyg.element.querySelectorAll(".vditor-comment").forEach(function($){$.getAttribute("data-cmtids").indexOf(a[0])>-1&&$.classList.add("vditor-comment--focus")})}var v=(0,s.lG)(n,"A");v&&b(e.toolbar.elements,["link"]);var d=(0,s.lG)(n,"TABLE"),_=(0,S.W)(n);(0,s.lG)(n,"CODE")?(0,s.lG)(n,"PRE")?(y(e.toolbar.elements,["headings","bold","italic","strike","line","quote","list","ordered-list","check","code","inline-code","upload","link","table","record"]),b(e.toolbar.elements,["code"])):(y(e.toolbar.elements,["headings","bold","italic","strike","line","quote","list","ordered-list","check","code","upload","link","table","record"]),b(e.toolbar.elements,["inline-code"])):_?(y(e.toolbar.elements,["bold"]),b(e.toolbar.elements,["headings"])):d&&y(e.toolbar.elements,["table"]);var L=(0,s.fb)(n,"vditor-toc");if(L){e.wysiwyg.popover.innerHTML="",lt(L,e),Le(e,"vditor-toc"),rt(e,L);return}var z=(0,S.S)(n,"BLOCKQUOTE");if(z&&(e.wysiwyg.popover.innerHTML="",kt(t,z,e),Et(t,z,e),lt(z,e),Le(e,"blockquote"),rt(e,z)),r&&(e.wysiwyg.popover.innerHTML="",kt(t,r,e),Et(t,r,e),lt(r,e),Le(e,"li"),rt(e,r)),d){var W=e.options.lang,j=e.options;e.wysiwyg.popover.innerHTML="";var K=function(){var $=d.rows.length,we=d.rows[0].cells.length,At=parseInt(ot.value,10)||$,pt=parseInt(et.value,10)||we;if(!(At===$&&we===pt)){if(we!==pt)for(var Qt=pt-we,vt=0;vt<d.rows.length;vt++)if(Qt>0)for(var lr=0;lr<Qt;lr++)vt===0?d.rows[vt].lastElementChild.insertAdjacentHTML("afterend","<th> </th>"):d.rows[vt].lastElementChild.insertAdjacentHTML("afterend","<td> </td>");else for(var kn=we-1;kn>=pt;kn--)d.rows[vt].cells[kn].remove();if($!==At){var cr=At-$;if(cr>0){for(var En="<tr>",Ft=0;Ft<pt;Ft++)En+="<td> </td>";for(var ur=0;ur<cr;ur++)d.querySelector("tbody")?d.querySelector("tbody").insertAdjacentHTML("beforeend",En):d.querySelector("thead").insertAdjacentHTML("afterend",En+"</tr>")}else for(var Ft=$-1;Ft>=At;Ft--)d.rows[Ft].remove(),d.rows.length===1&&d.querySelector("tbody").remove()}typeof e.options.input=="function"&&e.options.input(N(e))}},Z=function($){on(d,$),$==="right"?(X.classList.remove("vditor-icon--current"),ae.classList.remove("vditor-icon--current"),he.classList.add("vditor-icon--current")):$==="center"?(X.classList.remove("vditor-icon--current"),he.classList.remove("vditor-icon--current"),ae.classList.add("vditor-icon--current")):(ae.classList.remove("vditor-icon--current"),he.classList.remove("vditor-icon--current"),X.classList.add("vditor-icon--current")),(0,M.Hc)(t),I(e)},te=(0,s.lG)(n,"TD"),ue=(0,s.lG)(n,"TH"),se="left";te?se=te.getAttribute("align")||"left":ue&&(se=ue.getAttribute("align")||"center");var X=document.createElement("button");X.setAttribute("type","button"),X.setAttribute("aria-label",window.VditorI18n.alignLeft+"<"+(0,l.ns)("\u21E7\u2318L")+">"),X.setAttribute("data-type","left"),X.innerHTML='<svg><use xlink:href="#vditor-icon-align-left"></use></svg>',X.className="vditor-icon vditor-tooltipped vditor-tooltipped__n"+(se==="left"?" vditor-icon--current":""),X.onclick=function(){Z("left")};var ae=document.createElement("button");ae.setAttribute("type","button"),ae.setAttribute("aria-label",window.VditorI18n.alignCenter+"<"+(0,l.ns)("\u21E7\u2318C")+">"),ae.setAttribute("data-type","center"),ae.innerHTML='<svg><use xlink:href="#vditor-icon-align-center"></use></svg>',ae.className="vditor-icon vditor-tooltipped vditor-tooltipped__n"+(se==="center"?" vditor-icon--current":""),ae.onclick=function(){Z("center")};var he=document.createElement("button");he.setAttribute("type","button"),he.setAttribute("aria-label",window.VditorI18n.alignRight+"<"+(0,l.ns)("\u21E7\u2318R")+">"),he.setAttribute("data-type","right"),he.innerHTML='<svg><use xlink:href="#vditor-icon-align-right"></use></svg>',he.className="vditor-icon vditor-tooltipped vditor-tooltipped__n"+(se==="right"?" vditor-icon--current":""),he.onclick=function(){Z("right")};var Ue=document.createElement("button");Ue.setAttribute("type","button"),Ue.setAttribute("aria-label",window.VditorI18n.insertRowBelow+"<"+(0,l.ns)("\u2318=")+">"),Ue.setAttribute("data-type","insertRow"),Ue.innerHTML='<svg><use xlink:href="#vditor-icon-insert-row"></use></svg>',Ue.className="vditor-icon vditor-tooltipped vditor-tooltipped__n",Ue.onclick=function(){var $=getSelection().getRangeAt(0).startContainer,we=(0,s.lG)($,"TD")||(0,s.lG)($,"TH");we&&Un(e,t,we)};var dt=document.createElement("button");dt.setAttribute("type","button"),dt.setAttribute("aria-label",window.VditorI18n.insertRowAbove+"<"+(0,l.ns)("\u21E7\u2318F")+">"),dt.setAttribute("data-type","insertRow"),dt.innerHTML='<svg><use xlink:href="#vditor-icon-insert-rowb"></use></svg>',dt.className="vditor-icon vditor-tooltipped vditor-tooltipped__n",dt.onclick=function(){var $=getSelection().getRangeAt(0).startContainer,we=(0,s.lG)($,"TD")||(0,s.lG)($,"TH");we&&zn(e,t,we)};var it=document.createElement("button");it.setAttribute("type","button"),it.setAttribute("aria-label",window.VditorI18n.insertColumnRight+"<"+(0,l.ns)("\u21E7\u2318=")+">"),it.setAttribute("data-type","insertColumn"),it.innerHTML='<svg><use xlink:href="#vditor-icon-insert-column"></use></svg>',it.className="vditor-icon vditor-tooltipped vditor-tooltipped__n",it.onclick=function(){var $=getSelection().getRangeAt(0).startContainer,we=(0,s.lG)($,"TD")||(0,s.lG)($,"TH");we&&an(e,d,we)};var Ae=document.createElement("button");Ae.setAttribute("type","button"),Ae.setAttribute("aria-label",window.VditorI18n.insertColumnLeft+"<"+(0,l.ns)("\u21E7\u2318G")+">"),Ae.setAttribute("data-type","insertColumn"),Ae.innerHTML='<svg><use xlink:href="#vditor-icon-insert-columnb"></use></svg>',Ae.className="vditor-icon vditor-tooltipped vditor-tooltipped__n",Ae.onclick=function(){var $=getSelection().getRangeAt(0).startContainer,we=(0,s.lG)($,"TD")||(0,s.lG)($,"TH");we&&an(e,d,we,"beforebegin")};var ye=document.createElement("button");ye.setAttribute("type","button"),ye.setAttribute("aria-label",window.VditorI18n["delete-row"]+"<"+(0,l.ns)("\u2318-")+">"),ye.setAttribute("data-type","deleteRow"),ye.innerHTML='<svg><use xlink:href="#vditor-icon-delete-row"></use></svg>',ye.className="vditor-icon vditor-tooltipped vditor-tooltipped__n",ye.onclick=function(){var $=getSelection().getRangeAt(0).startContainer,we=(0,s.lG)($,"TD")||(0,s.lG)($,"TH");we&&Wn(e,t,we)};var Ze=document.createElement("button");Ze.setAttribute("type","button"),Ze.setAttribute("aria-label",window.VditorI18n["delete-column"]+"<"+(0,l.ns)("\u21E7\u2318-")+">"),Ze.setAttribute("data-type","deleteColumn"),Ze.innerHTML='<svg><use xlink:href="#vditor-icon-delete-column"></use></svg>',Ze.className="vditor-icon vditor-tooltipped vditor-tooltipped__n",Ze.onclick=function(){var $=getSelection().getRangeAt(0).startContainer,we=(0,s.lG)($,"TD")||(0,s.lG)($,"TH");we&&Fn(e,t,d,we)};var $e=document.createElement("span");$e.setAttribute("aria-label",window.VditorI18n.row),$e.className="vditor-tooltipped vditor-tooltipped__n";var ot=document.createElement("input");$e.appendChild(ot),ot.type="number",ot.min="1",ot.className="vditor-input",ot.style.width="42px",ot.style.textAlign="center",ot.setAttribute("placeholder",window.VditorI18n.row),ot.value=d.rows.length.toString(),ot.oninput=function(){K()},ot.onkeydown=function($){if(!$.isComposing){if($.key==="Tab"){et.focus(),et.select(),$.preventDefault();return}Qe(e,$)||Ee($,t)}};var Ut=document.createElement("span");Ut.setAttribute("aria-label",window.VditorI18n.column),Ut.className="vditor-tooltipped vditor-tooltipped__n";var et=document.createElement("input");Ut.appendChild(et),et.type="number",et.min="1",et.className="vditor-input",et.style.width="42px",et.style.textAlign="center",et.setAttribute("placeholder",window.VditorI18n.column),et.value=d.rows[0].cells.length.toString(),et.oninput=function(){K()},et.onkeydown=function($){if(!$.isComposing){if($.key==="Tab"){ot.focus(),ot.select(),$.preventDefault();return}Qe(e,$)||Ee($,t)}},kt(t,d,e),Et(t,d,e),lt(d,e),e.wysiwyg.popover.insertAdjacentElement("beforeend",X),e.wysiwyg.popover.insertAdjacentElement("beforeend",ae),e.wysiwyg.popover.insertAdjacentElement("beforeend",he),e.wysiwyg.popover.insertAdjacentElement("beforeend",dt),e.wysiwyg.popover.insertAdjacentElement("beforeend",Ue),e.wysiwyg.popover.insertAdjacentElement("beforeend",Ae),e.wysiwyg.popover.insertAdjacentElement("beforeend",it),e.wysiwyg.popover.insertAdjacentElement("beforeend",ye),e.wysiwyg.popover.insertAdjacentElement("beforeend",Ze),e.wysiwyg.popover.insertAdjacentElement("beforeend",$e),e.wysiwyg.popover.insertAdjacentHTML("beforeend"," x "),e.wysiwyg.popover.insertAdjacentElement("beforeend",Ut),Le(e,"table"),rt(e,d)}var wn=(0,s.a1)(n,"data-type","link-ref");wn&&Gt(e,wn,t);var zt=(0,s.a1)(n,"data-type","footnotes-ref");if(zt){var W=e.options.lang,j=e.options;e.wysiwyg.popover.innerHTML="";var $e=document.createElement("span");$e.setAttribute("aria-label",window.VditorI18n.footnoteRef+"<"+(0,l.ns)("\u2325Enter")+">"),$e.className="vditor-tooltipped vditor-tooltipped__n";var xt=document.createElement("input");$e.appendChild(xt),xt.className="vditor-input",xt.setAttribute("placeholder",window.VditorI18n.footnoteRef+"<"+(0,l.ns)("\u2325Enter")+">"),xt.style.width="120px",xt.value=zt.getAttribute("data-footnotes-label"),xt.oninput=function(){xt.value.trim()!==""&&zt.setAttribute("data-footnotes-label",xt.value),typeof e.options.input=="function"&&e.options.input(N(e))},xt.onkeydown=function(pt){pt.isComposing||Qe(e,pt)||Ee(pt,t)},lt(zt,e),e.wysiwyg.popover.insertAdjacentElement("beforeend",$e),Le(e,"footnotes-ref"),rt(e,zt)}var Ye=(0,s.fb)(n,"vditor-wysiwyg__block"),ar=Ye?Ye.getAttribute("data-type").indexOf("block")>-1:!1;if(e.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__preview").forEach(function($){if(!Ye||Ye&&ar&&!Ye.contains($)){var we=$.previousElementSibling;we.style.display="none"}}),Ye&&ar){if(e.wysiwyg.popover.innerHTML="",kt(t,Ye,e),Et(t,Ye,e),lt(Ye,e),Ye.getAttribute("data-type")==="code-block"){var cn=document.createElement("span");cn.setAttribute("aria-label",window.VditorI18n.language+"<"+(0,l.ns)("\u2325Enter")+">"),cn.className="vditor-tooltipped vditor-tooltipped__n";var mt=document.createElement("input");cn.appendChild(mt);var $t=Ye.firstElementChild.firstElementChild;mt.className="vditor-input",mt.setAttribute("placeholder",window.VditorI18n.language+"<"+(0,l.ns)("\u2325Enter")+">"),mt.value=$t.className.indexOf("language-")>-1?$t.className.split("-")[1].split(" ")[0]:"",mt.oninput=function($){mt.value.trim()!==""?$t.className="language-".concat(mt.value):($t.className="",e.hint.recentLanguage=""),Ye.lastElementChild.classList.contains("vditor-wysiwyg__preview")&&(Ye.lastElementChild.innerHTML=Ye.firstElementChild.innerHTML,je(Ye.lastElementChild,e)),I(e),$.detail===1&&(t.setStart($t.firstChild,0),t.collapse(!0),(0,M.Hc)(t))},mt.onkeydown=function($){if(!$.isComposing&&!Qe(e,$)){if($.key==="Escape"&&e.hint.element.style.display==="block"){e.hint.element.style.display="none",$.preventDefault();return}e.hint.select($,e),Ee($,t)}},mt.onkeyup=function($){var we,At;if(!($.isComposing||$.key==="Enter"||$.key==="ArrowUp"||$.key==="Escape"||$.key==="ArrowDown")){var pt=[],Qt=mt.value.substring(0,mt.selectionStart);(e.options.preview.hljs.langs||k.g.ALIAS_CODE_LANGUAGES.concat(((At=(we=window.hljs)===null||we===void 0?void 0:we.listLanguages())!==null&&At!==void 0?At:[]).sort())).forEach(function(vt){vt.indexOf(Qt.toLowerCase())>-1&&pt.push({html:vt,value:vt})}),e.hint.genHTML(pt,Qt,e),$.preventDefault()}},e.wysiwyg.popover.insertAdjacentElement("beforeend",cn),Le(e,"code-block")}else Le(e,"block");rt(e,Ye)}else Ye=void 0;if(_){e.wysiwyg.popover.innerHTML="";var $e=document.createElement("span");$e.setAttribute("aria-label","ID<"+(0,l.ns)("\u2325Enter")+">"),$e.className="vditor-tooltipped vditor-tooltipped__n";var Lt=document.createElement("input");$e.appendChild(Lt),Lt.className="vditor-input",Lt.setAttribute("placeholder","ID<"+(0,l.ns)("\u2325Enter")+">"),Lt.style.width="120px",Lt.value=_.getAttribute("data-id")||"",Lt.oninput=function(){_.setAttribute("data-id",Lt.value),typeof e.options.input=="function"&&e.options.input(N(e))},Lt.onkeydown=function(we){we.isComposing||Qe(e,we)||Ee(we,t)},kt(t,_,e),Et(t,_,e),lt(_,e),e.wysiwyg.popover.insertAdjacentElement("beforeend",$e),Le(e,"heading"),rt(e,_)}if(v&&Se(e,v,t),!z&&!r&&!d&&!Ye&&!v&&!wn&&!zt&&!_&&!L){var Wt=(0,s.a1)(n,"data-block","0");Wt&&Wt.parentElement.isEqualNode(e.wysiwyg.element)?(e.wysiwyg.popover.innerHTML="",kt(t,Wt,e),Et(t,Wt,e),lt(Wt,e),Le(e,"block"),rt(e,Wt)):e.wysiwyg.popover.style.display="none"}e.wysiwyg.element.querySelectorAll('span[data-type="backslash"] > span').forEach(function($){$.style.display="none"});var sr=(0,s.a1)(t.startContainer,"data-type","backslash");sr&&(sr.querySelector("span").style.display="inline")}},200)},nn=function(e,t){var n=t.options.customWysiwygMobileToolbar;if(!(!n||window.innerWidth>520)){var i=document.createElement("div");i.className="vditor-wysiwyg__mobile-toolbar";var r=document.createElement("button");r.type="button",r.className="vditor-icon",r.setAttribute("data-type","mobile-menu"),r.setAttribute("aria-label",window.VditorI18n.more),r.textContent="+";var o=document.createElement("div");o.className="vditor-panel vditor-wysiwyg__mobile-actions";var a=(0,M.zh)(t).cloneRange();if(n(e,o),!!o.hasChildNodes()){var m=function(){if(t.wysiwyg.element.contains(a.commonAncestorContainer)){var v=a.cloneRange();t.wysiwyg.range=v,(0,M.Hc)(v),o.classList.remove("vditor-wysiwyg__mobile-actions--open")}};o.addEventListener("touchstart",m,!0),o.addEventListener("click",m,!0),r.addEventListener((0,l.Le)(),function(v){v.preventDefault(),v.stopPropagation(),o.classList.toggle("vditor-wysiwyg__mobile-actions--open"),o.classList.remove("vditor-panel--left"),o.getBoundingClientRect().right>window.innerWidth&&o.classList.add("vditor-panel--left")}),i.appendChild(r),i.appendChild(o),t.wysiwyg.popover.insertAdjacentElement("afterbegin",i)}}},rt=function(e,t){var n=t,i=(0,s.lG)(t,"TABLE");i&&(n=i),e.wysiwyg.popover.style.left="0",e.wysiwyg.popover.style.display="block",e.wysiwyg.popover.style.top=Math.max(-8,n.offsetTop-21-e.wysiwyg.element.scrollTop)+"px",e.wysiwyg.popover.style.left=Math.min(n.offsetLeft,e.wysiwyg.element.clientWidth-e.wysiwyg.popover.clientWidth)+"px",e.wysiwyg.popover.setAttribute("data-top",(n.offsetTop-21).toString())},Gt=function(e,t,n){n===void 0&&(n=getSelection().getRangeAt(0)),e.wysiwyg.popover.innerHTML="";var i=function(){o.value.trim()!==""&&(t.tagName==="IMG"?t.setAttribute("alt",o.value):t.textContent=o.value),m.value.trim()!==""&&t.setAttribute("data-link-label",m.value),typeof e.options.input=="function"&&e.options.input(N(e))},r=document.createElement("span");r.setAttribute("aria-label",window.VditorI18n.textIsNotEmpty),r.className="vditor-tooltipped vditor-tooltipped__n";var o=document.createElement("input");r.appendChild(o),o.className="vditor-input",o.setAttribute("placeholder",window.VditorI18n.textIsNotEmpty),o.style.width="120px",o.value=t.getAttribute("alt")||t.textContent,o.oninput=function(){i()},o.onkeydown=function(v){Qe(e,v)||Ee(v,n)||ie(e,t,v,m)};var a=document.createElement("span");a.setAttribute("aria-label",window.VditorI18n.linkRef),a.className="vditor-tooltipped vditor-tooltipped__n";var m=document.createElement("input");a.appendChild(m),m.className="vditor-input",m.setAttribute("placeholder",window.VditorI18n.linkRef),m.value=t.getAttribute("data-link-label"),m.oninput=function(){i()},m.onkeydown=function(v){Qe(e,v)||Ee(v,n)||ie(e,t,v,o)},lt(t,e),e.wysiwyg.popover.insertAdjacentElement("beforeend",r),e.wysiwyg.popover.insertAdjacentElement("beforeend",a),Le(e,"link-ref"),rt(e,t)},kt=function(e,t,n){var i=t.previousElementSibling;if(!(!i||!t.parentElement.isEqualNode(n.wysiwyg.element)&&t.tagName!=="LI")){var r=document.createElement("button");r.setAttribute("type","button"),r.setAttribute("data-type","up"),r.setAttribute("aria-label",window.VditorI18n.up+"<"+(0,l.ns)("\u21E7\u2318U")+">"),r.innerHTML='<svg><use xlink:href="#vditor-icon-up"></use></svg>',r.className="vditor-icon vditor-tooltipped vditor-tooltipped__n",r.onclick=function(){e.insertNode(document.createElement("wbr")),i.insertAdjacentElement("beforebegin",t),(0,M.ib)(n.wysiwyg.element,e),I(n),ht(n),Xe(n)},n.wysiwyg.popover.insertAdjacentElement("beforeend",r)}},Et=function(e,t,n){var i=t.nextElementSibling;if(!(!i||!t.parentElement.isEqualNode(n.wysiwyg.element)&&t.tagName!=="LI")){var r=document.createElement("button");r.setAttribute("type","button"),r.setAttribute("data-type","down"),r.setAttribute("aria-label",window.VditorI18n.down+"<"+(0,l.ns)("\u21E7\u2318D")+">"),r.innerHTML='<svg><use xlink:href="#vditor-icon-down"></use></svg>',r.className="vditor-icon vditor-tooltipped vditor-tooltipped__n",r.onclick=function(){e.insertNode(document.createElement("wbr")),i.insertAdjacentElement("afterend",t),(0,M.ib)(n.wysiwyg.element,e),I(n),ht(n),Xe(n)},n.wysiwyg.popover.insertAdjacentElement("beforeend",r)}},lt=function(e,t){var n=document.createElement("button");n.setAttribute("type","button"),n.setAttribute("data-type","remove"),n.setAttribute("aria-label",window.VditorI18n.remove+"<"+(0,l.ns)("\u21E7\u2318X")+">"),n.innerHTML='<svg><use xlink:href="#vditor-icon-trashcan"></use></svg>',n.className="vditor-icon vditor-tooltipped vditor-tooltipped__n",n.onclick=function(){var i=(0,M.zh)(t);i.setStartAfter(e),(0,M.Hc)(i),e.remove(),I(t),ht(t),["H1","H2","H3","H4","H5","H6"].includes(e.tagName)&&at(t)},t.wysiwyg.popover.insertAdjacentElement("beforeend",n)},ie=function(e,t,n,i){if(!n.isComposing){if(n.key==="Tab"){i.focus(),i.select(),n.preventDefault();return}if(!(0,l.yl)(n)&&!n.shiftKey&&n.altKey&&n.key==="Enter"){var r=(0,M.zh)(e);t.insertAdjacentHTML("afterend",k.g.ZWSP),r.setStartAfter(t.nextSibling),r.collapse(!0),(0,M.Hc)(r),n.preventDefault()}}},Se=function(e,t,n){e.wysiwyg.popover.innerHTML="";var i=function(){o.value.trim()!==""&&(t.innerHTML=o.value),t.setAttribute("href",m.value),t.setAttribute("title",d.value),I(e)};t.querySelectorAll("[data-marker]").forEach(function(_){_.removeAttribute("data-marker")});var r=document.createElement("span");r.setAttribute("aria-label",window.VditorI18n.textIsNotEmpty),r.className="vditor-tooltipped vditor-tooltipped__n";var o=document.createElement("input");r.appendChild(o),o.className="vditor-input",o.setAttribute("placeholder",window.VditorI18n.textIsNotEmpty),o.style.width="120px",o.value=t.innerHTML||"",o.oninput=function(){i()},o.onkeydown=function(_){Qe(e,_)||Ee(_,n)||ie(e,t,_,m)};var a=document.createElement("span");a.setAttribute("aria-label",window.VditorI18n.link),a.className="vditor-tooltipped vditor-tooltipped__n";var m=document.createElement("input");a.appendChild(m),m.className="vditor-input",m.setAttribute("placeholder",window.VditorI18n.link),m.value=t.getAttribute("href")||"",m.oninput=function(){i()},m.onkeydown=function(_){Qe(e,_)||Ee(_,n)||ie(e,t,_,d)};var v=document.createElement("span");v.setAttribute("aria-label",window.VditorI18n.tooltipText),v.className="vditor-tooltipped vditor-tooltipped__n";var d=document.createElement("input");v.appendChild(d),d.className="vditor-input",d.setAttribute("placeholder",window.VditorI18n.tooltipText),d.style.width="60px",d.value=t.getAttribute("title")||"",d.oninput=function(){i()},d.onkeydown=function(_){Qe(e,_)||Ee(_,n)||ie(e,t,_,o)},lt(t,e),e.wysiwyg.popover.insertAdjacentElement("beforeend",r),e.wysiwyg.popover.insertAdjacentElement("beforeend",a),e.wysiwyg.popover.insertAdjacentElement("beforeend",v),Le(e,"a"),rt(e,t)},ze=function(e,t){var n=e.target;t.wysiwyg.popover.innerHTML="";var i=function(){n.setAttribute("src",o.value),n.setAttribute("alt",m.value),n.setAttribute("title",d.value),(0,p.W)(t.wysiwyg.element,"wysiwyg",t.options.preview.markdown.imageCaption),typeof t.options.input=="function"&&t.options.input(N(t))},r=document.createElement("span");r.setAttribute("aria-label",window.VditorI18n.imageURL),r.className="vditor-tooltipped vditor-tooltipped__n";var o=document.createElement("input");r.appendChild(o),o.className="vditor-input",o.setAttribute("placeholder",window.VditorI18n.imageURL),o.value=n.getAttribute("src")||"",o.oninput=function(){i()},o.onkeydown=function(_){Qe(t,_)};var a=document.createElement("span");a.setAttribute("aria-label",window.VditorI18n.alternateText),a.className="vditor-tooltipped vditor-tooltipped__n";var m=document.createElement("input");a.appendChild(m),m.className="vditor-input",m.setAttribute("placeholder",window.VditorI18n.alternateText),m.style.width="52px",m.value=n.getAttribute("alt")||"",m.oninput=function(){i()},m.onkeydown=function(_){Qe(t,_)};var v=document.createElement("span");v.setAttribute("aria-label",window.VditorI18n.title),v.className="vditor-tooltipped vditor-tooltipped__n";var d=document.createElement("input");v.appendChild(d),d.className="vditor-input",d.setAttribute("placeholder",window.VditorI18n.title),d.value=n.getAttribute("title")||"",d.oninput=function(){i()},d.onkeydown=function(_){Qe(t,_)},lt(n,t),t.wysiwyg.popover.insertAdjacentElement("beforeend",r),t.wysiwyg.popover.insertAdjacentElement("beforeend",a),t.wysiwyg.popover.insertAdjacentElement("beforeend",v),Le(t,"image"),rt(t,n)},Ee=function(e,t){if(!(0,l.yl)(e)&&!e.shiftKey&&e.key==="Enter"||e.key==="Escape")return t&&(0,M.Hc)(t),e.preventDefault(),e.stopPropagation(),!0},Le=function(e,t){nn(t,e),e.options.customWysiwygToolbar&&e.options.customWysiwygToolbar(t,e.wysiwyg.popover)},qe=function(e){e.currentMode==="wysiwyg"?ht(e):e.currentMode==="ir"&&wt(e)},ct=function(e,t,n){n===void 0&&(n={enableAddUndoStack:!0,enableHint:!1,enableInput:!0});var i=e.wysiwyg.element;i.innerHTML=e.lute.Md2VditorDOM(t),i.querySelectorAll(".vditor-wysiwyg__preview[data-render='2']").forEach(function(r){je(r,e),r.previousElementSibling.setAttribute("style","display:none")}),I(e,n)},ut=function(e,t,n){for(var i=e.startContainer.parentElement,r=!1,o="",a="",m=be(e),v=m.beforeHTML,d=m.afterHTML;i&&!r;){var _=i.tagName;if(_==="STRIKE"&&(_="S"),_==="I"&&(_="EM"),_==="B"&&(_="STRONG"),_==="S"||_==="STRONG"||_==="EM"){var L="",z="",W="";i.parentElement.getAttribute("data-block")!=="0"&&(z=re(i),W=P(i)),(v||z)&&(L="".concat(z,"<").concat(_,">").concat(v,"</").concat(_,">"),v=L),(n==="bold"&&_==="STRONG"||n==="italic"&&_==="EM"||n==="strikeThrough"&&_==="S")&&(L+="".concat(o).concat(k.g.ZWSP,"<wbr>").concat(a),r=!0),(d||W)&&(d="<".concat(_,">").concat(d,"</").concat(_,">").concat(W),L+=d),i.parentElement.getAttribute("data-block")!=="0"?(i=i.parentElement,i.innerHTML=L):(i.outerHTML=L,i=i.parentElement),o="<".concat(_,">")+o,a="</".concat(_,">")+a}else r=!0}(0,M.ib)(t.wysiwyg.element,e)},Zt=function(e,t,n){if(!(e.wysiwyg.composingLock&&n instanceof CustomEvent)){var i=!0,r=!0;e.wysiwyg.element.querySelector("wbr")&&e.wysiwyg.element.querySelector("wbr").remove();var o=(0,M.zh)(e),a=t.getAttribute("data-type");if(t.classList.contains("vditor-menu--current"))if(a==="strike"&&(a="strikeThrough"),a==="quote"){var m=(0,s.lG)(o.startContainer,"BLOCKQUOTE");m||(m=o.startContainer.childNodes[o.startOffset]),m&&(i=!1,t.classList.remove("vditor-menu--current"),o.insertNode(document.createElement("wbr")),m.outerHTML=m.innerHTML.trim()===""?'<p data-block="0">'.concat(m.innerHTML,"</p>"):m.innerHTML,(0,M.ib)(e.wysiwyg.element,o))}else if(a==="inline-code"){var v=(0,s.lG)(o.startContainer,"CODE");v||(v=o.startContainer.childNodes[o.startOffset]),v&&(v.outerHTML=v.innerHTML.replace(k.g.ZWSP,"")+"<wbr>",(0,M.ib)(e.wysiwyg.element,o))}else a==="link"?(o.collapsed&&o.selectNode(o.startContainer.parentElement),document.execCommand("unlink",!1,"")):a==="check"||a==="list"||a==="ordered-list"?(rn(e,o,a),(0,M.ib)(e.wysiwyg.element,o),i=!1,t.classList.remove("vditor-menu--current")):(i=!1,t.classList.remove("vditor-menu--current"),o.toString()===""?ut(o,e,a):document.execCommand(a,!1,""));else{e.wysiwyg.element.childNodes.length===0&&(e.wysiwyg.element.innerHTML='<p data-block="0"><wbr></p>',(0,M.ib)(e.wysiwyg.element,o));var d=(0,s.F9)(o.startContainer);if(a==="quote"){if(d||(d=o.startContainer.childNodes[o.startOffset]),d){i=!1,t.classList.add("vditor-menu--current"),o.insertNode(document.createElement("wbr"));var _=(0,s.lG)(o.startContainer,"LI");_&&d.contains(_)?_.innerHTML='<blockquote data-block="0">'.concat(_.innerHTML,"</blockquote>"):d.outerHTML='<blockquote data-block="0">'.concat(d.outerHTML,"</blockquote>"),(0,M.ib)(e.wysiwyg.element,o)}}else if(a==="check"||a==="list"||a==="ordered-list")rn(e,o,a,!1),(0,M.ib)(e.wysiwyg.element,o),i=!1,g(e.toolbar.elements,["check","list","ordered-list"]),t.classList.add("vditor-menu--current");else if(a==="inline-code"){if(o.toString()===""){var L=document.createElement("code");L.textContent=k.g.ZWSP,o.insertNode(L),o.setStart(L.firstChild,1),o.collapse(!0),(0,M.Hc)(o)}else if(o.startContainer.nodeType===3){var L=document.createElement("code");o.surroundContents(L),o.insertNode(L),(0,M.Hc)(o)}t.classList.add("vditor-menu--current")}else if(a==="code"){var L=document.createElement("div");L.className="vditor-wysiwyg__block",L.setAttribute("data-type","code-block"),L.setAttribute("data-block","0"),L.setAttribute("data-marker","```"),o.toString()===""?L.innerHTML=`<pre><code><wbr>
</code></pre>`:(L.innerHTML="<pre><code>".concat(o.toString(),"<wbr></code></pre>"),o.deleteContents()),o.insertNode(L),d&&(d.outerHTML=e.lute.SpinVditorDOM(d.outerHTML)),(0,M.ib)(e.wysiwyg.element,o),e.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__preview[data-render='2']").forEach(function(ae){je(ae,e)}),t.classList.add("vditor-menu--disabled")}else if(a==="link"){if(o.toString()===""){var z=document.createElement("a");z.innerText=k.g.ZWSP,o.insertNode(z),o.setStart(z.firstChild,1),o.collapse(!0),Se(e,z,o);var W=e.wysiwyg.popover.querySelector("input");W.value="",W.focus(),r=!1}else{var L=document.createElement("a");L.setAttribute("href",""),L.innerHTML=o.toString(),o.surroundContents(L),o.insertNode(L),(0,M.Hc)(o),Se(e,L,o);var j=e.wysiwyg.popover.querySelectorAll("input");j[0].value=L.innerText,j[1].focus()}i=!1,t.classList.add("vditor-menu--current")}else if(a==="table"){var K='<table data-block="0"><thead><tr><th>col1<wbr></th><th>col2</th><th>col3</th></tr></thead><tbody><tr><td> </td><td> </td><td> </td></tr><tr><td> </td><td> </td><td> </td></tr></tbody></table>';if(o.toString().trim()==="")d&&d.innerHTML.trim().replace(k.g.ZWSP,"")===""?d.outerHTML=K:document.execCommand("insertHTML",!1,K),o.selectNode(e.wysiwyg.element.querySelector("wbr").previousSibling),e.wysiwyg.element.querySelector("wbr").remove(),(0,M.Hc)(o);else{K='<table data-block="0"><thead><tr>';var Z=o.toString().split(`
`),te=Z[0].split(",").length>Z[0].split("	").length?",":"	";Z.forEach(function(X,ae){ae===0?(X.split(te).forEach(function(he,Ue){Ue===0?K+="<th>".concat(he,"<wbr></th>"):K+="<th>".concat(he,"</th>")}),K+="</tr></thead>"):(ae===1?K+="<tbody><tr>":K+="<tr>",X.split(te).forEach(function(he){K+="<td>".concat(he,"</td>")}),K+="</tr>")}),K+="</tbody></table>",document.execCommand("insertHTML",!1,K),(0,M.ib)(e.wysiwyg.element,o)}i=!1,t.classList.add("vditor-menu--disabled")}else if(a==="line"){if(d){var ue=`<hr data-block="0"><p data-block="0"><wbr>
</p>`;d.innerHTML.trim()===""?d.outerHTML=ue:d.insertAdjacentHTML("afterend",ue),(0,M.ib)(e.wysiwyg.element,o)}}else if(i=!1,t.classList.add("vditor-menu--current"),a==="strike"&&(a="strikeThrough"),o.toString()===""&&(a==="bold"||a==="italic"||a==="strikeThrough")){var se="strong";a==="italic"?se="em":a==="strikeThrough"&&(se="s");var L=document.createElement(se);L.textContent=k.g.ZWSP,o.insertNode(L),L.previousSibling&&L.previousSibling.textContent===k.g.ZWSP&&(L.previousSibling.textContent=""),o.setStart(L.firstChild,1),o.collapse(!0),(0,M.Hc)(o)}else document.execCommand(a,!1,"")}i&&ht(e),r&&I(e)}},Ie=(function(){function e(t,n){var i,r=this;this.element=document.createElement("div"),n.className&&(i=this.element.classList).add.apply(i,n.className.split(" "));var o=n.hotkey?" <".concat((0,l.ns)(n.hotkey),">"):"";n.level===2&&(o=n.hotkey?" &lt;".concat((0,l.ns)(n.hotkey),"&gt;"):"");var a=n.tip?n.tip+o:"".concat(window.VditorI18n[n.name]).concat(o),m=n.name==="upload"?"div":"button";if(n.level===2)this.element.innerHTML="<".concat(m,' data-type="').concat(n.name,'">').concat(a,"</").concat(m,">");else{this.element.classList.add("vditor-toolbar__item");var v=document.createElement(m);v.setAttribute("data-type",n.name),v.className="vditor-tooltipped vditor-tooltipped__".concat(n.tipPosition),v.setAttribute("aria-label",a),v.innerHTML=n.icon,this.element.appendChild(v)}n.prefix&&this.element.children[0].addEventListener((0,l.Le)(),function(d){d.preventDefault(),!r.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)&&(t.currentMode==="wysiwyg"?Zt(t,r.element.children[0],d):t.currentMode==="ir"?Er(t,r.element.children[0],n.prefix||"",n.suffix||""):Ce(t,r.element.children[0],n.prefix||"",n.suffix||""))})}return e})(),mr=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Dt=function(e,t,n){var i;typeof n!="string"?(f(e,["subToolbar","hint"]),n.preventDefault(),i=N(e)):i=n,!(e.currentMode===t&&typeof n!="string")&&(e.devtools&&e.devtools.renderEchart(e),e.options.preview.mode==="both"&&t==="sv"?e.preview.element.style.display="block":e.preview.element.style.display="none",h(e.toolbar.elements,k.g.EDIT_TOOLBARS),g(e.toolbar.elements,k.g.EDIT_TOOLBARS),y(e.toolbar.elements,["outdent","indent"]),t==="ir"?(E(e.toolbar.elements,["both"]),w(e.toolbar.elements,["outdent","indent","outline","insert-before","insert-after"]),e.sv.element.style.display="none",e.wysiwyg.element.parentElement.style.display="none",e.ir.element.parentElement.style.display="block",e.lute.SetVditorIR(!0),e.lute.SetVditorWYSIWYG(!1),e.lute.SetVditorSV(!1),e.currentMode="ir",e.ir.element.innerHTML=e.lute.Md2VditorIRDOM(i),_t(e,{enableAddUndoStack:!0,enableHint:!1,enableInput:!1}),Ve(e),e.ir.element.querySelectorAll(".vditor-ir__preview[data-render='2']").forEach(function(r){je(r,e)}),e.ir.element.querySelectorAll(".vditor-toc").forEach(function(r){(0,ve.H)(r,{cdn:e.options.cdn,math:e.options.preview.math})})):t==="wysiwyg"?(E(e.toolbar.elements,["both"]),w(e.toolbar.elements,["outdent","indent","outline","insert-before","insert-after"]),e.sv.element.style.display="none",e.wysiwyg.element.parentElement.style.display="block",e.ir.element.parentElement.style.display="none",e.lute.SetVditorIR(!1),e.lute.SetVditorWYSIWYG(!0),e.lute.SetVditorSV(!1),e.currentMode="wysiwyg",Ve(e),ct(e,i,{enableAddUndoStack:!0,enableHint:!1,enableInput:!1}),e.wysiwyg.element.querySelectorAll(".vditor-toc").forEach(function(r){(0,ve.H)(r,{cdn:e.options.cdn,math:e.options.preview.math})}),e.wysiwyg.popover.style.display="none"):t==="sv"&&(w(e.toolbar.elements,["both"]),E(e.toolbar.elements,["outdent","indent","outline","insert-before","insert-after"]),e.wysiwyg.element.parentElement.style.display="none",e.ir.element.parentElement.style.display="none",(e.options.preview.mode==="both"||e.options.preview.mode==="editor")&&(e.sv.element.style.display="block"),e.lute.SetVditorIR(!1),e.lute.SetVditorWYSIWYG(!1),e.lute.SetVditorSV(!1),e.currentMode="sv",e.sv.element.value=i,B(e,{enableAddUndoStack:!0,enableHint:!1,enableInput:!1}),Ve(e)),e.undo.resetIcon(e),typeof n!="string"&&(e[e.currentMode].element.focus(),qe(e)),at(e),Oe(e),e.toolbar.elements["edit-mode"]&&(e.toolbar.elements["edit-mode"].querySelectorAll("button").forEach(function(r){r.classList.remove("vditor-menu--current")}),e.toolbar.elements["edit-mode"].querySelector('button[data-mode="'.concat(e.currentMode,'"]')).classList.add("vditor-menu--current")),e.outline.toggle(e,e.currentMode!=="sv"&&e.options.outline.enable,typeof n!="string"))},gr=(function(e){mr(t,e);function t(n,i){var r=e.call(this,n,i)||this,o=document.createElement("div");return o.className="vditor-hint".concat(i.level===2?"":" vditor-panel--arrow"),o.innerHTML='<button data-mode="wysiwyg">'.concat(window.VditorI18n.wysiwyg," &lt;").concat((0,l.ns)("\u2325\u23187"),`></button>
<button data-mode="ir">`).concat(window.VditorI18n.instantRendering," &lt;").concat((0,l.ns)("\u2325\u23188"),`></button>
<button data-mode="sv">`).concat(window.VditorI18n.splitView," &lt;").concat((0,l.ns)("\u2325\u23189"),"></button>"),r.element.appendChild(o),r._bindEvent(n,o,i),r}return t.prototype._bindEvent=function(n,i,r){var o=this.element.children[0];u(n,i,o,r.level),i.children.item(0).addEventListener((0,l.Le)(),function(a){Dt(n,"wysiwyg",a),a.preventDefault(),a.stopPropagation()}),i.children.item(1).addEventListener((0,l.Le)(),function(a){Dt(n,"ir",a),a.preventDefault(),a.stopPropagation()}),i.children.item(2).addEventListener((0,l.Le)(),function(a){Dt(n,"sv",a),a.preventDefault(),a.stopPropagation()})},t})(Ie),dn=function(e,t){return(0,M.Gb)(e,t)?getSelection().toString():""},fn=function(e,t){t.addEventListener("focus",function(){e.options.focus&&e.options.focus(N(e)),f(e,["subToolbar","hint"])})},xn=function(e,t){t.addEventListener("dblclick",function(n){n.target.tagName==="IMG"&&(e.options.image.preview?e.options.image.preview(n.target):e.options.image.isPreview&&(0,ge.E)(n.target,e.options.lang,e.options.theme))})},Sn=function(e,t){t.addEventListener("blur",function(n){if(e.currentMode==="ir"){var i=e.ir.element.querySelector(".vditor-ir__node--expand");i&&i.classList.remove("vditor-ir__node--expand"),e.ir.range=(0,M.zh)(e)}else e.currentMode==="wysiwyg"&&(e.wysiwyg.selectPopover.contains(n.relatedTarget)||e.wysiwyg.hideComment(),e.wysiwyg.range=(0,M.zh)(e));e.options.blur&&e.options.blur(N(e))})},pn=function(e,t,n){n===void 0&&(n=function(i){document.execCommand("insertHTML",!1,i)}),t.addEventListener("dragstart",function(i){i.dataTransfer.setData(k.g.DROP_EDITOR,k.g.DROP_EDITOR)}),t.addEventListener("drop",function(i){i.dataTransfer.getData(k.g.DROP_EDITOR)?fe(e):(i.dataTransfer.types.includes("Files")||i.dataTransfer.types.includes("text/html"))&&sn(e,i,{pasteCode:n})})},Tn=function(e,t,n){t.addEventListener("copy",function(i){return n(i,e)})},Cn=function(e,t,n){t.addEventListener("cut",function(i){n(i,e),e.options.comment.enable&&e.currentMode==="wysiwyg"&&e.wysiwyg.getComments(e),document.execCommand("delete")})},Xe=function(e){if(e.currentMode==="wysiwyg"&&e.options.comment.enable&&e.options.comment.adjustTop(e.wysiwyg.getComments(e,!0)),!!e.options.typewriterMode){var t=e[e.currentMode].element,n;if(e.currentMode==="sv"){var i=parseInt(getComputedStyle(e.sv.element).lineHeight,10)||22;n=(e.sv.element.value.substring(0,e.sv.element.selectionStart).split(`
`).length-1)*i}else n=(0,M.Ny)(t).top;e.options.height==="auto"&&!e.element.classList.contains("vditor--fullscreen")&&window.scrollTo(window.scrollX,n+e.element.offsetTop+e.toolbar.element.offsetHeight-window.innerHeight/2+10),(e.options.height!=="auto"||e.element.classList.contains("vditor--fullscreen"))&&(t.scrollTop=n+t.scrollTop-t.clientHeight/2+10)}},hn=function(e,t){t.addEventListener("keydown",function(n){if(!n.isComposing&&e.options.keydown&&e.options.keydown(n),!((e.options.hint.extend.length>1||e.toolbar.elements.emoji)&&e.hint.select(n,e))){if(e.options.comment.enable&&e.currentMode==="wysiwyg"&&(n.key==="Backspace"||pe("\u2318X",n))&&e.wysiwyg.getComments(e),e.currentMode==="sv"){if(ce(e,n))return}else if(e.currentMode==="wysiwyg"){if(jt(e,n))return}else if(e.currentMode==="ir"&&Ge(e,n))return;if(e.options.ctrlEnter&&pe("\u2318Enter",n)){e.options.ctrlEnter(N(e)),n.preventDefault();return}if(pe("\u2318Z",n)&&!e.toolbar.elements.undo){e.undo.undo(e),n.preventDefault();return}if(pe("\u2318Y",n)&&!e.toolbar.elements.redo){e.undo.redo(e),n.preventDefault();return}if(n.key==="Escape"){e.hint.element.style.display==="block"?e.hint.element.style.display="none":e.options.esc&&!n.isComposing&&e.options.esc(N(e)),n.preventDefault();return}if((0,l.yl)(n)&&n.altKey&&!n.shiftKey&&/^Digit[1-6]$/.test(n.code)){if(e.currentMode==="wysiwyg"){var i=n.code.replace("Digit","H");(0,s.lG)(getSelection().getRangeAt(0).startContainer,i)?qt(e):Ct(e,i),I(e)}else e.currentMode==="sv"?q(e,"#".repeat(parseInt(n.code.replace("Digit",""),10))+" "):e.currentMode==="ir"&&Xt(e,"#".repeat(parseInt(n.code.replace("Digit",""),10))+" ");return n.preventDefault(),!0}if((0,l.yl)(n)&&n.altKey&&!n.shiftKey&&/^Digit[7-9]$/.test(n.code))return n.code==="Digit7"?Dt(e,"wysiwyg",n):n.code==="Digit8"?Dt(e,"ir",n):n.code==="Digit9"&&Dt(e,"sv",n),!0;e.options.toolbar.find(function(r){if(!r.hotkey||r.toolbar){if(r.toolbar){var o=r.toolbar.find(function(a){if(!a.hotkey)return!1;if(pe(a.hotkey,n))return e.toolbar.elements[a.name].children[0].dispatchEvent(new CustomEvent((0,l.Le)())),n.preventDefault(),!0});return!!o}return!1}if(pe(r.hotkey,n))return e.toolbar.elements[r.name].children[0].dispatchEvent(new CustomEvent((0,l.Le)())),n.preventDefault(),!0})}})},Mn=function(e,t){t.addEventListener("selectstart",function(n){t.onmouseup=function(){setTimeout(function(){var i=dn(e[e.currentMode].element);i.trim()?(e.currentMode==="wysiwyg"&&e.options.comment.enable&&(!(0,s.a1)(n.target,"data-type","footnotes-block")&&!(0,s.a1)(n.target,"data-type","link-ref-defs-block")?e.wysiwyg.showComment():e.wysiwyg.hideComment()),e.options.select&&e.options.select(i)):(e.currentMode==="wysiwyg"&&e.options.comment.enable&&e.wysiwyg.hideComment(),typeof e.options.unSelect=="function"&&e.options.unSelect())})}})},br=function(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e},Ln=function(e,t,n,i){function r(o){return o instanceof n?o:new n(function(a){a(o)})}return new(n||(n=Promise))(function(o,a){function m(_){try{d(i.next(_))}catch(L){a(L)}}function v(_){try{d(i.throw(_))}catch(L){a(L)}}function d(_){_.done?o(_.value):r(_.value).then(m,v)}d((i=i.apply(e,t||[])).next())})},An=function(e,t){var n={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},i,r,o,a;return a={next:m(0),throw:m(1),return:m(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function m(d){return function(_){return v([d,_])}}function v(d){if(i)throw new TypeError("Generator is already executing.");for(;a&&(a=0,d[0]&&(n=0)),n;)try{if(i=1,r&&(o=d[0]&2?r.return:d[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,d[1])).done)return o;switch(r=0,o&&(d=[d[0]&2,o.value]),d[0]){case 0:case 1:o=d;break;case 4:return n.label++,{value:d[1],done:!1};case 5:n.label++,r=d[1],d=[0];continue;case 7:d=n.ops.pop(),n.trys.pop();continue;default:if(o=n.trys,!(o=o.length>0&&o[o.length-1])&&(d[0]===6||d[0]===2)){n=0;continue}if(d[0]===3&&(!o||d[1]>o[0]&&d[1]<o[3])){n.label=d[1];break}if(d[0]===6&&n.label<o[1]){n.label=o[1],o=d;break}if(o&&n.label<o[2]){n.label=o[2],n.ops.push(d);break}o[2]&&n.ops.pop(),n.trys.pop();continue}d=t.call(e,n)}catch(_){d=[6,_],r=0}finally{i=o=0}if(d[0]&5)throw d[1];return{value:d[0]?d[1]:void 0,done:!0}}},On=function(e,t,n){if(e.keyCode===229&&e.code===""&&e.key==="Unidentified"&&t.currentMode!=="sv"){var i=(0,s.F9)(n);if(i&&i.textContent.trim()==="")return t[t.currentMode].composingLock=!0,!1}return!0},Dn=function(e,t,n){if(!(n.key==="Enter"||n.key==="Tab"||n.key==="Backspace"||n.key.indexOf("Arrow")>-1||(0,l.yl)(n)||n.key==="Escape"||n.shiftKey||n.altKey)){var i=(0,s.lG)(e.startContainer,"P")||(0,s.lG)(e.startContainer,"LI");if(i&&(0,M.im)(i,t[t.currentMode].element,e).start===0){i.nodeValue&&(i.nodeValue=i.nodeValue.replace(/\u2006/g,""));var r=document.createTextNode(k.g.ZWSP);e.insertNode(r),e.setStartAfter(r)}}},Hn=function(e,t){if(t==="ArrowDown"||t==="ArrowUp"){var n=(0,s.a1)(e.startContainer,"data-type","math-inline")||(0,s.a1)(e.startContainer,"data-type","html-entity")||(0,s.a1)(e.startContainer,"data-type","html-inline");n&&(t==="ArrowDown"&&e.setStartAfter(n.parentElement),t==="ArrowUp"&&e.setStartBefore(n.parentElement))}},Yt=function(e,t){if(e.currentMode==="sv"){var n=e.sv.element;if(t==="beforebegin"){var i=n.value.lastIndexOf(`
`,n.selectionStart-1)+1;n.setRangeText(`
`,i,i,"end"),n.setSelectionRange(i,i)}else{var r=n.value.indexOf(`
`,n.selectionEnd),o=r===-1?n.value.length:r;n.setRangeText(`
`,o,o,"end")}n.focus(),B(e);return}var a=(0,M.zh)(e),m=(0,s.F9)(a.startContainer);m&&(m.insertAdjacentHTML(t,'<p data-block="0">'.concat(k.g.ZWSP,`<wbr>
</p>`)),(0,M.ib)(e[e.currentMode].element,a),qe(e),fe(e))},vr=function(e){var t=(0,s.lG)(e,"TABLE");return t&&t.rows[0].cells[0].isSameNode(e)?t:!1},yr=function(e){var t=(0,s.lG)(e,"TABLE");return t&&t.lastElementChild.lastElementChild.lastElementChild.isSameNode(e)?t:!1},Nn=function(e,t,n){n===void 0&&(n=!0);var i=e.previousElementSibling;return i||(e.parentElement.previousElementSibling?i=e.parentElement.previousElementSibling.lastElementChild:e.parentElement.parentElement.tagName==="TBODY"&&e.parentElement.parentElement.previousElementSibling?i=e.parentElement.parentElement.previousElementSibling.lastElementChild.lastElementChild:i=null),i&&(t.selectNodeContents(i),n||t.collapse(!1),(0,M.Hc)(t)),i},Jt=function(e,t,n,i,r){var o=(0,M.im)(i,e[e.currentMode].element,n);if(t.key==="ArrowDown"&&i.textContent.trimRight().substr(o.start).indexOf(`
`)===-1||t.key==="ArrowRight"&&o.start>=i.textContent.trimRight().length){var a=r.nextElementSibling;return!a||a&&(a.tagName==="TABLE"||a.getAttribute("data-type"))?(r.insertAdjacentHTML("afterend",'<p data-block="0">'.concat(k.g.ZWSP,"<wbr></p>")),(0,M.ib)(e[e.currentMode].element,n)):(n.selectNodeContents(a),n.collapse(!0),(0,M.Hc)(n)),t.preventDefault(),!0}return!1},Bt=function(e,t,n,i,r){var o=(0,M.im)(i,e[e.currentMode].element,n);if(t.key==="ArrowUp"&&i.textContent.substr(0,o.start).indexOf(`
`)===-1||(t.key==="ArrowLeft"||t.key==="Backspace"&&n.toString()==="")&&o.start===0){var a=r.previousElementSibling;return!a||a&&(a.tagName==="TABLE"||a.getAttribute("data-type"))?(r.insertAdjacentHTML("beforebegin",'<p data-block="0">'.concat(k.g.ZWSP,"<wbr></p>")),(0,M.ib)(e[e.currentMode].element,n)):(n.selectNodeContents(a),n.collapse(!1),(0,M.Hc)(n)),t.preventDefault(),!0}return!1},rn=function(e,t,n,i){i===void 0&&(i=!0);var r=(0,s.lG)(t.startContainer,"LI"),o=[],a=(0,s.a1)(t.startContainer,"data-block","0"),m=(0,s.a1)(t.endContainer,"data-block","0");if(a&&m&&a.parentElement.isSameNode(m.parentElement))for(var v=a;v&&(o.push(v),!v.isSameNode(m));)v=v.nextElementSibling;e[e.currentMode].element.querySelectorAll("wbr").forEach(function(ae){ae.remove()});var d=!t.collapsed;if(d){var _=t.cloneRange();_.collapse(!1);var L=document.createElement("wbr");L.setAttribute("data-type","list-selection-end"),_.insertNode(L);var z=t.cloneRange();z.collapse(!0);var W=document.createElement("wbr");W.setAttribute("data-type","list-selection-start"),z.insertNode(W)}else t.insertNode(document.createElement("wbr"));if(i&&r){for(var j="",K=0;K<r.parentElement.childElementCount;K++){var Z=r.parentElement.children[K].querySelector("input");Z&&Z.remove(),j+='<p data-block="0">'.concat(r.parentElement.children[K].innerHTML.trimLeft(),"</p>")}r.parentElement.insertAdjacentHTML("beforebegin",j),r.parentElement.remove()}else if(r)if(n==="check")r.parentElement.querySelectorAll("li").forEach(function(ae){ae.insertAdjacentHTML("afterbegin",'<input type="checkbox" />'.concat(ae.textContent.indexOf(" ")===0?"":" ")),ae.classList.add("vditor-task")});else{r.querySelector("input")&&r.parentElement.querySelectorAll("li").forEach(function(ae){var he=ae.querySelector("input");if(he){var Ue=he.nextSibling;he.remove(),Ue&&Ue.nodeType===3&&Ue.textContent.startsWith(" ")&&(Ue.textContent=Ue.textContent.substring(1))}ae.classList.remove("vditor-task")});var se=void 0;n==="list"?(se=document.createElement("ul"),se.setAttribute("data-marker","*")):(se=document.createElement("ol"),se.setAttribute("data-marker","1.")),se.setAttribute("data-block","0"),se.setAttribute("data-tight",r.parentElement.getAttribute("data-tight")),se.innerHTML=r.parentElement.innerHTML,r.parentElement.parentNode.replaceChild(se,r.parentElement)}else{if(o.length===0){e[e.currentMode].element.querySelector("wbr").remove();var v=e[e.currentMode].element.querySelector("p");v.innerHTML="<wbr>",o.push(v)}var te="";o.forEach(function(ae){n==="check"?te+='<li class="vditor-task"><input type="checkbox" /> '.concat(ae.innerHTML,"</li>"):te+="<li>".concat(ae.innerHTML,"</li>")});var ue=n==="ordered-list"?"ol":"ul";o[0].insertAdjacentHTML("beforebegin","<".concat(ue,' data-block="0">').concat(te,"</").concat(ue,">")),o.forEach(function(ae){return ae.remove()})}if(d){var X=e[e.currentMode].element,W=X.querySelector('[data-type="list-selection-start"]'),L=X.querySelector('[data-type="list-selection-end"]');W&&L&&(t.setStartAfter(W),t.setEndBefore(L),W.remove(),L.remove(),(0,M.Hc)(t))}},Rn=function(e,t,n){var i=t.previousElementSibling;if(t&&i){var r=[t];Array.from(n.cloneContents().children).forEach(function(v,d){v.nodeType!==3&&t&&v.textContent.trim()!==""&&t.getAttribute("data-node-id")===v.getAttribute("data-node-id")&&(d!==0&&r.push(t),t=t.nextElementSibling)}),e[e.currentMode].element.querySelectorAll("wbr").forEach(function(v){v.remove()}),n.insertNode(document.createElement("wbr"));var o=i.parentElement,a="";r.forEach(function(v){var d=v.getAttribute("data-marker");d.length!==1&&(d="1".concat(d.slice(-1))),a+='<li data-node-id="'.concat(v.getAttribute("data-node-id"),'" data-marker="').concat(d,'">').concat(v.innerHTML,"</li>"),v.remove()}),i.insertAdjacentHTML("beforeend","<".concat(o.tagName,' data-block="0">').concat(a,"</").concat(o.tagName,">")),e.currentMode==="wysiwyg"?o.outerHTML=e.lute.SpinVditorDOM(o.outerHTML):o.outerHTML=e.lute.SpinVditorIRDOM(o.outerHTML),(0,M.ib)(e[e.currentMode].element,n);var m=(0,s.O9)(n.startContainer);m&&m.querySelectorAll(".vditor-".concat(e.currentMode,"__preview[data-render='2']")).forEach(function(v){je(v,e),e.currentMode==="wysiwyg"&&v.previousElementSibling.setAttribute("style","display:none")}),fe(e),qe(e)}else e[e.currentMode].element.focus()},mn=function(e,t,n,i){var r=(0,s.lG)(t.parentElement,"LI");if(r){e[e.currentMode].element.querySelectorAll("wbr").forEach(function(L){L.remove()}),n.insertNode(document.createElement("wbr"));var o=t.parentElement,a=o.cloneNode(),m=[t];Array.from(n.cloneContents().children).forEach(function(L,z){L.nodeType!==3&&t&&L.textContent.trim()!==""&&t.getAttribute("data-node-id")===L.getAttribute("data-node-id")&&(z!==0&&m.push(t),t=t.nextElementSibling)});var v=!1,d="";o.querySelectorAll("li").forEach(function(L){v&&(d+=L.outerHTML,!L.nextElementSibling&&!L.previousElementSibling?L.parentElement.remove():L.remove()),L.isSameNode(m[m.length-1])&&(v=!0)}),m.reverse().forEach(function(L){r.insertAdjacentElement("afterend",L)}),d&&(a.innerHTML=d,m[0].insertAdjacentElement("beforeend",a)),e.currentMode==="wysiwyg"?i.outerHTML=e.lute.SpinVditorDOM(i.outerHTML):i.outerHTML=e.lute.SpinVditorIRDOM(i.outerHTML),(0,M.ib)(e[e.currentMode].element,n);var _=(0,s.O9)(n.startContainer);_&&_.querySelectorAll(".vditor-".concat(e.currentMode,"__preview[data-render='2']")).forEach(function(L){je(L,e),e.currentMode==="wysiwyg"&&L.previousElementSibling.setAttribute("style","display:none")}),fe(e),qe(e)}else e[e.currentMode].element.focus()},on=function(e,t){for(var n=getSelection().getRangeAt(0).startContainer.parentElement,i=e.rows[0].cells.length,r=e.rows.length,o=0,a=0;a<r;a++)for(var m=0;m<i;m++)if(e.rows[a].cells[m].isSameNode(n)){o=m;break}for(var v=0;v<r;v++)e.rows[v].cells[o].setAttribute("align",t)},gn=function(e){var t=e.trimRight().split(`
`).pop();return t===""?!1:(t.replace(/ |-/g,"")===""||t.replace(/ |_/g,"")===""||t.replace(/ |\*/g,"")==="")&&t.replace(/ /g,"").length>2?!(t.indexOf("-")>-1&&t.trimLeft().indexOf(" ")===-1&&e.trimRight().split(`
`).length>1||t.indexOf("    ")===0||t.indexOf("	")===0):!1},bn=function(e){var t=e.trimRight().split(`
`);return e=t.pop(),e.indexOf("    ")===0||e.indexOf("	")===0||(e=e.trimLeft(),e===""||t.length===0)?!1:e.replace(/-/g,"")===""||e.replace(/=/g,"")===""},fe=function(e,t){t===void 0&&(t={enableAddUndoStack:!0,enableHint:!1,enableInput:!0}),e.currentMode==="wysiwyg"?I(e,t):e.currentMode==="ir"?_t(e,t):e.currentMode==="sv"&&B(e,t)},wr=function(e){return e.textContent.split(k.g.ZWSP).join("").trim()!==""?!1:!e.querySelector(["audio","canvas","embed","hr","iframe","img","object","ol","pre","svg","table","ul","video","input:not([type='checkbox'])"].join(", "))},In=function(e){var t=e.parentElement,n=t.parentElement,i=document.createElement("p");i.setAttribute("data-block","0"),i.innerHTML="<wbr>";var r;if(e.nextElementSibling){for(r=t.cloneNode(!1);e.nextElementSibling;)r.appendChild(e.nextElementSibling);n.insertBefore(r,t.nextSibling)}return e.remove(),t.childElementCount===0?n.replaceChild(i,t):n.insertBefore(i,r||t.nextSibling),i},Pn=function(e,t,n,i){var r=e.startContainer,o=(0,s.lG)(r,"LI");if(o){if(!(0,l.yl)(i)&&!i.altKey&&i.key==="Enter"&&!i.shiftKey&&n&&o.contains(n)&&n.nextElementSibling)return o&&!o.textContent.endsWith(`
`)&&o.insertAdjacentText("beforeend",`
`),e.insertNode(document.createTextNode(`

`)),e.collapse(!1),fe(t),i.preventDefault(),!0;if(!(0,l.yl)(i)&&!i.shiftKey&&!i.altKey&&i.key==="Enter"&&e.collapsed&&!o.nextElementSibling&&o.parentElement.parentElement.tagName==="LI"&&wr(o)){var a=In(o);return(0,M.ib)(a,e),fe(t),i.preventDefault(),!0}if(!(0,l.yl)(i)&&!i.shiftKey&&!i.altKey&&i.key==="Backspace"&&o.textContent.trim().replace(k.g.ZWSP,"")===""&&e.toString()===""){var a=In(o);return(0,M.ib)(a,e),fe(t),i.preventDefault(),!0}if(!(0,l.yl)(i)&&!i.shiftKey&&!i.altKey&&i.key==="Backspace"&&!o.previousElementSibling&&e.toString()===""&&(0,M.im)(o,t[t.currentMode].element,e).start===0)return o.nextElementSibling?(o.parentElement.insertAdjacentHTML("beforebegin",'<p data-block="0"><wbr>'.concat(o.innerHTML,"</p>")),o.remove()):o.parentElement.outerHTML='<p data-block="0"><wbr>'.concat(o.innerHTML,"</p>"),(0,M.ib)(t[t.currentMode].element,e),fe(t),i.preventDefault(),!0;if(!(0,l.yl)(i)&&!i.altKey&&i.key==="Tab"){var m=!1;if((e.startOffset===0&&(r.nodeType===3&&!r.previousSibling||r.nodeType!==3&&r.nodeName==="LI")||o.classList.contains("vditor-task")&&e.startOffset===1&&r.previousSibling.nodeType!==3&&r.previousSibling.tagName==="INPUT")&&(m=!0),m||e.toString()!=="")return i.shiftKey?mn(t,o,e,o.parentElement):Rn(t,o,e),i.preventDefault(),!0}}return!1},jn=function(e,t,n){if(e.options.tab&&n.key==="Tab")return n.shiftKey||(t.toString()===""?(t.insertNode(document.createTextNode(e.options.tab)),t.collapse(!1)):(t.extractContents(),t.insertNode(document.createTextNode(e.options.tab)),t.collapse(!1))),(0,M.Hc)(t),fe(e),n.preventDefault(),!0},Bn=function(e,t,n,i){if(n){if(!(0,l.yl)(e)&&!e.altKey&&e.key==="Enter"){var r=String.raw(Xn||(Xn=br(["",""],["",""])),n.textContent).replace(/\\\|/g,"").trim(),o=r.split("|");if(r.startsWith("|")&&r.endsWith("|")&&o.length>3){var a=o.map(function(){return"---"}).join("|");return a=n.textContent+`
`+a.substring(3,a.length-3)+`
|<wbr>`,n.outerHTML=t.lute.SpinVditorDOM(a),(0,M.ib)(t[t.currentMode].element,i),fe(t),Xe(t),e.preventDefault(),!0}if(gn(n.innerHTML)&&n.previousElementSibling){var m="",v=n.innerHTML.trimRight().split(`
`);return v.length>1&&(v.pop(),m='<p data-block="0">'.concat(v.join(`
`),"</p>")),n.insertAdjacentHTML("afterend","".concat(m,`<hr data-block="0"><p data-block="0"><wbr>
</p>`)),n.remove(),(0,M.ib)(t[t.currentMode].element,i),fe(t),Xe(t),e.preventDefault(),!0}if(bn(n.innerHTML))return t.currentMode==="wysiwyg"?n.outerHTML=t.lute.SpinVditorDOM(n.innerHTML+`<p data-block="0"><wbr>
</p>`):n.outerHTML=t.lute.SpinVditorIRDOM(n.innerHTML+`<p data-block="0"><wbr>
</p>`),(0,M.ib)(t[t.currentMode].element,i),fe(t),Xe(t),e.preventDefault(),!0}if(i.collapsed&&n.previousElementSibling&&e.key==="Backspace"&&!(0,l.yl)(e)&&!e.altKey&&!e.shiftKey&&n.textContent.trimRight().split(`
`).length>1&&(0,M.im)(n,t[t.currentMode].element,i).start===0){var d=(0,s.DX)(n.previousElementSibling);return d.textContent.endsWith(`
`)||(d.textContent=d.textContent+`
`),d.parentElement.insertAdjacentHTML("beforeend","<wbr>".concat(n.innerHTML)),n.remove(),(0,M.ib)(t[t.currentMode].element,i),!1}return!1}},Un=function(e,t,n){for(var i="",r=0;r<n.parentElement.childElementCount;r++)i+='<td align="'.concat(n.parentElement.children[r].getAttribute("align"),'"> </td>');n.tagName==="TH"?n.parentElement.parentElement.insertAdjacentHTML("afterend","<tbody><tr>".concat(i,"</tr></tbody>")):n.parentElement.insertAdjacentHTML("afterend","<tr>".concat(i,"</tr>")),fe(e)},zn=function(e,t,n){for(var i="",r=0;r<n.parentElement.childElementCount;r++)n.tagName==="TH"?i+='<th align="'.concat(n.parentElement.children[r].getAttribute("align"),'"> </th>'):i+='<td align="'.concat(n.parentElement.children[r].getAttribute("align"),'"> </td>');if(n.tagName==="TH"){n.parentElement.parentElement.insertAdjacentHTML("beforebegin","<thead><tr>".concat(i,"</tr></thead>")),t.insertNode(document.createElement("wbr"));var o=n.parentElement.innerHTML.replace(/<th>/g,"<td>").replace(/<\/th>/g,"</td>");n.parentElement.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",o),n.parentElement.parentElement.remove(),(0,M.ib)(e.ir.element,t)}else n.parentElement.insertAdjacentHTML("beforebegin","<tr>".concat(i,"</tr>"));fe(e)},an=function(e,t,n,i){i===void 0&&(i="afterend");for(var r=0,o=n.previousElementSibling;o;)r++,o=o.previousElementSibling;for(var a=0;a<t.rows.length;a++)a===0?t.rows[a].cells[r].insertAdjacentHTML(i,"<th> </th>"):t.rows[a].cells[r].insertAdjacentHTML(i,"<td> </td>");fe(e)},Wn=function(e,t,n){if(n.tagName==="TD"){var i=n.parentElement.parentElement;n.parentElement.previousElementSibling?t.selectNodeContents(n.parentElement.previousElementSibling.lastElementChild):t.selectNodeContents(i.previousElementSibling.lastElementChild.lastElementChild),i.childElementCount===1?i.remove():n.parentElement.remove(),t.collapse(!1),(0,M.Hc)(t),fe(e)}},Fn=function(e,t,n,i){for(var r=0,o=i.previousElementSibling;o;)r++,o=o.previousElementSibling;(i.previousElementSibling||i.nextElementSibling)&&(t.selectNodeContents(i.previousElementSibling||i.nextElementSibling),t.collapse(!0));for(var a=0;a<n.rows.length;a++){var m=n.rows[a].cells;if(m.length===1){n.remove(),qe(e);break}m[r].remove()}(0,M.Hc)(t),fe(e)},Vn=function(e,t,n){var i=n.startContainer,r=(0,s.lG)(i,"TD")||(0,s.lG)(i,"TH");if(r){if(!(0,l.yl)(t)&&!t.altKey&&t.key==="Enter"){(!r.lastElementChild||r.lastElementChild&&(!r.lastElementChild.isSameNode(r.lastChild)||r.lastElementChild.tagName!=="BR"))&&r.insertAdjacentHTML("beforeend","<br>");var o=document.createElement("br");return n.insertNode(o),n.setStartAfter(o),fe(e),Xe(e),t.preventDefault(),!0}if(t.key==="Tab"){if(t.shiftKey)return Nn(r,n),t.preventDefault(),!0;var a=r.nextElementSibling;return a||(r.parentElement.nextElementSibling?a=r.parentElement.nextElementSibling.firstElementChild:r.parentElement.parentElement.tagName==="THEAD"&&r.parentElement.parentElement.nextElementSibling?a=r.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild:a=null),a&&(n.selectNodeContents(a),(0,M.Hc)(n)),t.preventDefault(),!0}var m=r.parentElement.parentElement.parentElement;if(t.key==="ArrowUp"){if(t.preventDefault(),r.tagName==="TH")return m.previousElementSibling?(n.selectNodeContents(m.previousElementSibling),n.collapse(!1),(0,M.Hc)(n)):Yt(e,"beforebegin"),!0;for(var v=0,d=r.parentElement;v<d.cells.length&&!d.cells[v].isSameNode(r);v++);var _=d.previousElementSibling;return _||(_=d.parentElement.previousElementSibling.firstChild),n.selectNodeContents(_.cells[v]),n.collapse(!1),(0,M.Hc)(n),!0}if(t.key==="ArrowDown"){t.preventDefault();var d=r.parentElement;if(!d.nextElementSibling&&r.tagName==="TD")return m.nextElementSibling?(n.selectNodeContents(m.nextElementSibling),n.collapse(!0),(0,M.Hc)(n)):Yt(e,"afterend"),!0;for(var v=0;v<d.cells.length&&!d.cells[v].isSameNode(r);v++);var a=d.nextElementSibling;return a||(a=d.parentElement.nextElementSibling.firstChild),n.selectNodeContents(a.cells[v]),n.collapse(!0),(0,M.Hc)(n),!0}if(e.currentMode==="wysiwyg"&&!(0,l.yl)(t)&&t.key==="Enter"&&!t.shiftKey&&t.altKey){var L=e.wysiwyg.popover.querySelector(".vditor-input");return L.focus(),L.select(),t.preventDefault(),!0}if(!(0,l.yl)(t)&&!t.shiftKey&&!t.altKey&&t.key==="Backspace"&&n.startOffset===0&&n.toString()===""){var z=Nn(r,n,!1);return!z&&m&&(m.textContent.trim()===""?(m.outerHTML=`<p data-block="0"><wbr>
</p>`,(0,M.ib)(e[e.currentMode].element,n)):(n.setStartBefore(m),n.collapse(!0)),fe(e)),t.preventDefault(),!0}if(pe("\u21E7\u2318F",t))return zn(e,n,r),t.preventDefault(),!0;if(pe("\u2318=",t))return Un(e,n,r),t.preventDefault(),!0;if(pe("\u21E7\u2318G",t))return an(e,m,r,"beforebegin"),t.preventDefault(),!0;if(pe("\u21E7\u2318=",t))return an(e,m,r),t.preventDefault(),!0;if(pe("\u2318-",t))return Wn(e,n,r),t.preventDefault(),!0;if(pe("\u21E7\u2318-",t))return Fn(e,n,m,r),t.preventDefault(),!0;if(pe("\u21E7\u2318L",t)){if(e.currentMode==="ir")return on(m,"left"),fe(e),t.preventDefault(),!0;var W=e.wysiwyg.popover.querySelector('[data-type="left"]');if(W)return W.click(),t.preventDefault(),!0}if(pe("\u21E7\u2318C",t)){if(e.currentMode==="ir")return on(m,"center"),fe(e),t.preventDefault(),!0;var W=e.wysiwyg.popover.querySelector('[data-type="center"]');if(W)return W.click(),t.preventDefault(),!0}if(pe("\u21E7\u2318R",t)){if(e.currentMode==="ir")return on(m,"right"),fe(e),t.preventDefault(),!0;var W=e.wysiwyg.popover.querySelector('[data-type="right"]');if(W)return W.click(),t.preventDefault(),!0}}return!1},qn=function(e,t,n,i){if(n.tagName==="PRE"&&pe("\u2318A",t))return i.selectNodeContents(n.firstElementChild),t.preventDefault(),!0;if(e.options.tab&&t.key==="Tab"&&!t.shiftKey&&i.toString()==="")return i.insertNode(document.createTextNode(e.options.tab)),i.collapse(!1),fe(e),t.preventDefault(),!0;if(t.key==="Backspace"&&!(0,l.yl)(t)&&!t.shiftKey&&!t.altKey){var r=(0,M.im)(n,e[e.currentMode].element,i);if((r.start===0||r.start===1&&n.innerText===`
`)&&i.toString()==="")return n.parentElement.outerHTML='<p data-block="0"><wbr>'.concat(n.firstElementChild.innerHTML,"</p>"),(0,M.ib)(e[e.currentMode].element,i),fe(e),t.preventDefault(),!0}return!(0,l.yl)(t)&&!t.altKey&&t.key==="Enter"?(n.firstElementChild.textContent.endsWith(`
`)||n.firstElementChild.insertAdjacentText("beforeend",`
`),i.extractContents(),i.insertNode(document.createTextNode(`
`)),i.collapse(!1),(0,M.Hc)(i),(0,l.vU)()||(e.currentMode==="wysiwyg"?Ne(e,i):bt(e,i)),Xe(e),t.preventDefault(),!0):!1},Kn=function(e,t,n,i){var r,o=t.startContainer,a=(0,s.lG)(o,"BLOCKQUOTE");if(a&&t.toString()===""){if(i&&n.key==="Enter"&&!(0,l.yl)(n)&&!n.shiftKey&&!n.altKey&&i.parentElement.isSameNode(a)&&(0,s.lG)(a.parentElement,"LI")&&(t.collapsed||!t.cloneContents().firstElementChild)&&i.innerHTML.replace(k.g.ZWSP,"")!==`
`&&i.innerHTML.replace(k.g.ZWSP,"")!==""){var m=t.cloneRange();m.setEnd(i,i.childNodes.length);var v=document.createElement("p");return v.setAttribute("data-block","0"),v.appendChild(m.extractContents()),i.insertAdjacentElement("afterend",v),t.setStart(v,0),t.collapse(!0),(0,M.Hc)(t),fe(e),n.preventDefault(),!0}if(n.key==="Backspace"&&!(0,l.yl)(n)&&!n.shiftKey&&!n.altKey&&(0,M.im)(a,e[e.currentMode].element,t).start===0)return t.insertNode(document.createElement("wbr")),a.outerHTML=a.innerHTML,(0,M.ib)(e[e.currentMode].element,t),fe(e),n.preventDefault(),!0;if(i&&n.key==="Enter"&&!(0,l.yl)(n)&&!n.shiftKey&&!n.altKey&&i.parentElement.tagName==="BLOCKQUOTE"){var d=!1;if(i.innerHTML.replace(k.g.ZWSP,"")===`
`||i.innerHTML.replace(k.g.ZWSP,"")===""?(d=!0,i.remove()):i.innerHTML.endsWith(`

`)&&(0,M.im)(i,e[e.currentMode].element,t).start===i.textContent.length-1&&(i.innerHTML=i.innerHTML.substr(0,i.innerHTML.length-2),d=!0),d)return a.insertAdjacentHTML("afterend",'<p data-block="0">'.concat(k.g.ZWSP,`<wbr>
</p>`)),(0,M.ib)(e[e.currentMode].element,t),fe(e),n.preventDefault(),!0}var _=(0,s.F9)(o);if(e.currentMode==="wysiwyg"&&_&&pe("\u21E7\u2318;",n))return t.insertNode(document.createElement("wbr")),_.outerHTML='<blockquote data-block="0">'.concat(_.outerHTML,"</blockquote>"),(0,M.ib)(e.wysiwyg.element,t),I(e),n.preventDefault(),!0;var L=a.parentElement.tagName==="LI"?a.parentElement:null,z=!a.nextElementSibling&&((r=L?.nextElementSibling)===null||r===void 0?void 0:r.tagName)==="LI"?L:a;if(Jt(e,n,t,a,z))return!0;if(n.key==="ArrowUp"&&L&&!a.previousElementSibling)return!1;if(Bt(e,n,t,a,a))return!0}return!1},Gn=function(e,t,n){var i=t.startContainer,r=(0,s.lG)(i,"LI");if(r&&r.classList.contains("vditor-task")){if(pe("\u21E7\u2318J",n)){var o=r.firstElementChild;return o.checked?o.removeAttribute("checked"):o.setAttribute("checked","checked"),fe(e),n.preventDefault(),!0}if(n.key==="Backspace"&&!(0,l.yl)(n)&&!n.shiftKey&&!n.altKey&&t.toString()===""&&t.startOffset===1&&(i.nodeType===3&&i.previousSibling&&i.previousSibling.tagName==="INPUT"||i.nodeType!==3)){var a=r.previousElementSibling;if(r.querySelector("input").remove(),a){var m=(0,s.DX)(a);m.parentElement.insertAdjacentHTML("beforeend","<wbr>"+r.innerHTML.trim()),r.remove()}else r.parentElement.insertAdjacentHTML("beforebegin",'<p data-block="0"><wbr>'.concat(r.innerHTML.trim()||`
`,"</p>")),r.nextElementSibling?r.remove():r.parentElement.remove();return(0,M.ib)(e[e.currentMode].element,t),fe(e),n.preventDefault(),!0}if(n.key==="Enter"&&!(0,l.yl)(n)&&!n.shiftKey&&!n.altKey){if(r.textContent.trim()==="")if((0,s.fb)(r.parentElement,"vditor-task")){var v=(0,s.O9)(i);v&&mn(e,r,t,v)}else if(r.nextElementSibling){var d="",_="",L=!1;Array.from(r.parentElement.children).forEach(function(K){r.isSameNode(K)?L=!0:L?d+=K.outerHTML:_+=K.outerHTML});var z=r.parentElement.tagName,W=r.parentElement.tagName==="OL"?"":' data-marker="'.concat(r.parentElement.getAttribute("data-marker"),'"'),j="";_&&(j=r.parentElement.tagName==="UL"?"":' start="1"',_="<".concat(z,' data-tight="true"').concat(W,' data-block="0">').concat(_,"</").concat(z,">")),r.parentElement.outerHTML="".concat(_,`<p data-block="0"><wbr>
</p><`).concat(z,`
 data-tight="true"`).concat(W,' data-block="0"').concat(j,">").concat(d,"</").concat(z,">")}else r.parentElement.insertAdjacentHTML("afterend",`<p data-block="0"><wbr>
</p>`),r.parentElement.querySelectorAll("li").length===1?r.parentElement.remove():r.remove();else i.nodeType!==3&&t.startOffset===0&&i.firstChild.tagName==="INPUT"?t.setStart(i.childNodes[1],1):(t.setEndAfter(r.lastChild),r.insertAdjacentHTML("afterend",'<li class="vditor-task" data-marker="'.concat(r.getAttribute("data-marker"),'"><input type="checkbox"> <wbr></li>')),document.querySelector("wbr").after(t.extractContents()));return(0,M.ib)(e[e.currentMode].element,t),fe(e),Xe(e),n.preventDefault(),!0}}return!1},Zn=function(e,t,n,i){if(t.startContainer.nodeType!==3){var r=t.startContainer.children[t.startOffset];if(r&&r.tagName==="HR")return t.selectNodeContents(r.previousElementSibling),t.collapse(!1),n.preventDefault(),!0}if(i){var o=i.previousElementSibling;if(o&&(0,M.im)(i,e[e.currentMode].element,t).start===0&&((0,l.vU)()&&o.tagName==="HR"||o.tagName==="TABLE")){if(o.tagName==="TABLE"){var a=o.lastElementChild.lastElementChild.lastElementChild;a.innerHTML=a.innerHTML.trimLeft()+"<wbr>"+i.textContent.trim(),i.remove()}else o.remove();return(0,M.ib)(e[e.currentMode].element,t),fe(e),n.preventDefault(),!0}}return!1},Yn=function(e){(0,l.vU)()&&e.startContainer.nodeType!==3&&e.startContainer.tagName==="HR"&&e.setStartBefore(e.startContainer)},Jn=function(e,t,n){var i,r;if(!(0,l.vU)())return!1;if(e.key==="ArrowUp"&&t&&((i=t.previousElementSibling)===null||i===void 0?void 0:i.tagName)==="TABLE"){var o=t.previousElementSibling;return n.selectNodeContents(o.rows[o.rows.length-1].lastElementChild),n.collapse(!1),e.preventDefault(),!0}return e.key==="ArrowDown"&&t&&((r=t.nextElementSibling)===null||r===void 0?void 0:r.tagName)==="TABLE"?(n.selectNodeContents(t.nextElementSibling.rows[0].cells[0]),n.collapse(!0),e.preventDefault(),!0):!1},sn=function(e,t,n){return Ln(void 0,void 0,void 0,function(){var i,r,o,a,m,v,d,_,L,z,W,j,K,Z,te,ue,se,X;return An(this,function(ae){switch(ae.label){case 0:return(e.currentMode==="sv"?e.sv.element.disabled:e[e.currentMode].element.getAttribute("contenteditable")!=="true")?[2]:(t.stopPropagation(),t.preventDefault(),"clipboardData"in t?(i=t.clipboardData.getData("text/html"),r=t.clipboardData.getData("text/plain"),o=t.clipboardData.files):(i=t.dataTransfer.getData("text/html"),r=t.dataTransfer.getData("text/plain"),t.dataTransfer.types.includes("Files")&&(o=t.dataTransfer.items)),a={},m=function(he,Ue){if(!Ue)return["",Lute.WalkContinue];var dt=he.__internal_object__.Parent;if(dt.Type===33&&dt.LinkType===3)return["",Lute.WalkContinue];if(e.options.upload.renderLinkDest)return e.options.upload.renderLinkDest(e,he,Ue);var it=he.TokensStr();if(he.__internal_object__.Parent.Type===34&&it&&it.indexOf("file://")===-1&&e.options.upload.linkToImgUrl){var Ae=new XMLHttpRequest;Ae.open("POST",e.options.upload.linkToImgUrl),e.options.upload.token&&Ae.setRequestHeader("X-Upload-Token",e.options.upload.token),e.options.upload.withCredentials&&(Ae.withCredentials=!0),He(e,Ae),Ae.setRequestHeader("Content-Type","application/json; charset=utf-8"),Ae.onreadystatechange=function(){if(Ae.readyState===XMLHttpRequest.DONE){if(Ae.status===200){var ye=Ae.responseText;e.options.upload.linkToImgFormat&&(ye=e.options.upload.linkToImgFormat(Ae.responseText));var Ze=JSON.parse(ye);if(Ze.code!==0){e.tip.show(Ze.msg);return}var $e=Ze.data.originalURL;if(e.currentMode==="sv"){var ot=e.sv.element.selectionStart,Ut=e.sv.element.selectionEnd;e.sv.element.value=e.sv.element.value.split($e).join(Ze.data.url),e.sv.element.setSelectionRange(ot,Ut)}else{var et=e[e.currentMode].element.querySelector('img[src="'.concat($e,'"]'));et.src=Ze.data.url,e.currentMode==="ir"&&(et.previousElementSibling.previousElementSibling.innerHTML=Ze.data.url)}fe(e)}else e.tip.show(Ae.responseText);e.options.upload.linkToImgCallback&&e.options.upload.linkToImgCallback(Ae.responseText)}},Ae.send(JSON.stringify({url:it}))}return e.currentMode==="ir"?['<span class="vditor-ir__marker vditor-ir__marker--link">'.concat(Lute.EscapeHTMLStr(it),"</span>"),Lute.WalkContinue]:e.currentMode==="wysiwyg"?["",Lute.WalkContinue]:["",Lute.WalkContinue]},(i.replace(/&amp;/g,"&").replace(/<(|\/)(html|body|meta)[^>]*?>/ig,"").trim()==='<a href="'.concat(r,'">').concat(r,"</a>")||i.replace(/&amp;/g,"&").replace(/<(|\/)(html|body|meta)[^>]*?>/ig,"").trim()==='<!--StartFragment--><a href="'.concat(r,'">').concat(r,"</a><!--EndFragment-->"))&&(i=""),v=new DOMParser().parseFromString(i,"text/html"),v.body&&(i=v.body.innerHTML),i=Lute.Sanitize(i),e.wysiwyg.getComments(e),d=e[e.currentMode].element.scrollHeight,_=Tt(i,r,e.currentMode),L=e.currentMode==="sv"?(0,s.a1)(t.target,"data-type","code-block"):(0,s.lG)(t.target,"CODE"),z=e.currentMode==="wysiwyg"&&((0,s.lG)((0,M.zh)(e).startContainer,"TD")||(0,s.lG)((0,M.zh)(e).startContainer,"TH")),z&&/[\r\n]/.test(r)?((0,M.oC)(Lute.EscapeHTMLStr(r).replace(/\r\n|\r|\n/g,"<br>"),e),[3,11]):[3,1]);case 1:return L?(e.currentMode==="sv"?document.execCommand("insertHTML",!1,r.replace(/&/g,"&amp;").replace(/</g,"&lt;")):(W=(0,M.im)(t.target,e[e.currentMode].element),L.parentElement.tagName!=="PRE"&&(r+=k.g.ZWSP),L.textContent=L.textContent.substring(0,W.start)+r+L.textContent.substring(W.end),(0,M.$j)(W.start+r.length,W.start+r.length,L.parentElement),!((X=L.parentElement)===null||X===void 0)&&X.nextElementSibling.classList.contains("vditor-".concat(e.currentMode,"__preview"))&&(L.parentElement.nextElementSibling.innerHTML=L.outerHTML,je(L.parentElement.nextElementSibling,e))),[3,11]):[3,2];case 2:return _?(n.pasteCode(_),[3,11]):[3,3];case 3:return i.trim()===""?[3,6]:(j=document.createElement("div"),j.innerHTML=i,e.options.upload.base64ToLink?[3,5]:[4,kr(e,j,("clipboardData"in t?t.clipboardData:t.dataTransfer).getData("text/rtf"))]);case 4:ae.sent(),ae.label=5;case 5:return j.querySelectorAll("[style]").forEach(function(he){he.removeAttribute("style")}),j.querySelectorAll(".vditor-copy").forEach(function(he){he.remove()}),e.currentMode==="ir"?(a.HTML2VditorIRDOM={renderLinkDest:m},e.lute.SetJSRenderers({renderers:a}),(0,M.oC)(e.lute.HTML2VditorIRDOM(j.innerHTML),e)):e.currentMode==="wysiwyg"?(a.HTML2VditorDOM={renderLinkDest:m},e.lute.SetJSRenderers({renderers:a}),(0,M.oC)(e.lute.HTML2VditorDOM(j.innerHTML),e)):de(e,e.lute.HTML2Md(j.innerHTML).trimRight()),e.outline.render(e),[3,11];case 6:return o.length>0?e.options.upload.url||e.options.upload.handler?[4,R(e,o)]:[3,8]:[3,10];case 7:return ae.sent(),[3,9];case 8:K=new FileReader,"clipboardData"in t?(o=t.clipboardData.files,Z=o[0]):t.dataTransfer.types.includes("Files")&&(o=t.dataTransfer.items,Z=o[0].getAsFile()),Z&&Z.type.startsWith("image")&&(K.readAsDataURL(Z),K.onload=function(){var he="";e.currentMode==="wysiwyg"?he+='<img alt="'.concat(Z.name,'" src="').concat(K.result.toString(),`">
`):he+="![".concat(Z.name,"](").concat(K.result.toString(),`)
`),e.currentMode==="sv"?(de(e,he),fe(e)):document.execCommand("insertHTML",!1,he)}),ae.label=9;case 9:return[3,11];case 10:r.trim()!==""&&o.length===0&&(te=e.currentMode==="sv"?e.sv.element.value.substring(e.sv.element.selectionStart,e.sv.element.selectionEnd):(0,M.zh)(e).toString(),te!==""&&e.lute.IsValidLinkDest(r)&&(r="[".concat(te,"](").concat(r,")")),e.currentMode==="ir"?(a.Md2VditorIRDOM={renderLinkDest:m},e.lute.SetJSRenderers({renderers:a}),(0,M.oC)(Lute.Sanitize(e.lute.Md2VditorIRDOM(r)),e)):e.currentMode==="wysiwyg"?(a.Md2VditorDOM={renderLinkDest:m},e.lute.SetJSRenderers({renderers:a}),(0,M.oC)(Lute.Sanitize(e.lute.Md2VditorDOM(r)),e)):de(e,r),e.outline.render(e)),ae.label=11;case 11:return e.currentMode!=="sv"&&(ue=(0,s.F9)((0,M.zh)(e).startContainer),ue&&(se=(0,M.zh)(e),e[e.currentMode].element.querySelectorAll("wbr").forEach(function(he){he.remove()}),se.insertNode(document.createElement("wbr")),e.currentMode==="wysiwyg"?ue.outerHTML=e.lute.SpinVditorDOM(ue.outerHTML):ue.outerHTML=e.lute.SpinVditorIRDOM(ue.outerHTML),(0,M.ib)(e[e.currentMode].element,se)),e[e.currentMode].element.querySelectorAll(".vditor-".concat(e.currentMode,"__preview[data-render='2']")).forEach(function(he){je(he,e)})),e.wysiwyg.triggerRemoveComment(e),fe(e),e[e.currentMode].element.scrollHeight-d>Math.min(e[e.currentMode].element.clientHeight,window.innerHeight)/2&&Xe(e),[2]}})})},kr=function(e,t,n){return Ln(void 0,void 0,void 0,function(){var i,r,o,a,m,v,d,_,L,K,z,W,j,K,Z,te;return An(this,function(ue){switch(ue.label){case 0:if(!n)return[2];if(i=/{\\pict[\s\S]+?\\bliptag-?\d+(\\blipupi-?\d+)?({\\\*\\blipuid\s?[\da-fA-F]+)?[\s}]*?/,r=new RegExp("(?:("+i.source+"))([\\da-fA-F\\s]+)\\}","g"),o=n.match(r),a=[],o)for(m=0,v=o;m<v.length;m++)d=v[m],_=void 0,d.includes("\\pngblip")?_="image/png":d.includes("\\jpegblip")&&(_="image/jpeg"),_&&a.push({hex:d.replace(i,"").replace(/[^\da-fA-F]/g,""),type:_});for(L=[],vn(t,function(se){if(se.tagName==="V:SHAPE")return vn(se,function(X){X.tagName==="V:IMAGEDATA"&&L.push({shape:se,img:X})}),!1}),K=0;K<L.length;K++)z=document.createElement("img"),W="data:"+a[K].type+";base64,"+btoa((a[K].hex.match(/\w{2}/g)||[]).map(function(se){return String.fromCharCode(parseInt(se,16))}).join("")),z.src=W,z.title=L[K].img.getAttribute("title"),L[K].shape.parentNode.replaceChild(z,L[K].shape);j=t.querySelectorAll("img"),K=0,ue.label=1;case 1:return K<j.length?(Z=j[K].src||"",Z?(te=j[K],[4,e.options.upload.base64ToLink(Z)]):[3,3]):[3,4];case 2:te.src=ue.sent(),ue.label=3;case 3:return K++,[3,1];case 4:return[2]}})})},vn=function(e,t){var n=t(e);if(n!==!1)for(var i=0;i<e.children.length;i++)vn(e.children[i],t)},Xn,$n=function(e){var t,n;e.hint.render(e);var i=(0,M.zh)(e).startContainer,r=(0,s.a1)(i,"data-type","code-block-info");if(r)if(r.textContent.replace(k.g.ZWSP,"")===""&&e.hint.recentLanguage){r.textContent=k.g.ZWSP+e.hint.recentLanguage;var o=(0,M.zh)(e);o.selectNodeContents(r)}else{var a=[],m=r.textContent.substring(0,(0,M.im)(r,e.ir.element).start).replace(k.g.ZWSP,"");(e.options.preview.hljs.langs||k.g.ALIAS_CODE_LANGUAGES.concat(((n=(t=window.hljs)===null||t===void 0?void 0:t.listLanguages())!==null&&n!==void 0?n:[]).sort())).forEach(function(v){v.indexOf(m.toLowerCase())>-1&&a.push({html:v,value:v})}),e.hint.genHTML(a,m,e)}},_t=function(e,t){t===void 0&&(t={enableAddUndoStack:!0,enableHint:!1,enableInput:!0}),(0,p.W)(e.ir.element,"ir",e.options.preview.markdown.imageCaption),t.enableHint&&$n(e),clearTimeout(e.ir.processTimeoutId),e.ir.processTimeoutId=window.setTimeout(function(){if(!e.ir.composingLock){var n=N(e);typeof e.options.input=="function"&&t.enableInput&&e.options.input(n),e.options.counter.enable&&e.counter.render(e,n),e.options.cache.enable&&(0,l.pK)()&&(localStorage.setItem(e.options.cache.id,n),e.options.cache.after&&e.options.cache.after(n)),e.devtools&&e.devtools.renderEchart(e),t.enableAddUndoStack&&e.undo.addToUndoStack(e)}},e.options.undoDelay)},Xt=function(e,t){var n=(0,M.zh)(e),i=(0,s.F9)(n.startContainer)||n.startContainer;if(i){var r=i.querySelector(".vditor-ir__marker--heading");r?r.innerHTML=t:(i.insertAdjacentText("afterbegin",t),n.selectNodeContents(i),n.collapse(!1)),bt(e,n.cloneRange()),wt(e)}},ln=function(e,t,n){var i=(0,s.a1)(e.startContainer,"data-type",n);if(i){var r=!e.collapsed;if(i.firstElementChild.remove(),i.lastElementChild.remove(),r){var o=e.cloneRange();o.collapse(!1),o.insertNode(document.createElement("wbr"))}e.insertNode(document.createElement("wbr"));var a=document.createElement("div");if(a.innerHTML=t.lute.SpinVditorIRDOM(i.outerHTML),i.outerHTML=a.firstElementChild.innerHTML.trim(),r){(0,M.ib)(t.ir.element,e);var m=t.ir.element.querySelector("wbr");e.setEndBefore(m),m.remove(),(0,M.Hc)(e)}}},Er=function(e,t,n,i){var r=(0,M.zh)(e),o=t.getAttribute("data-type"),a=r.startContainer;a.nodeType===3&&(a=a.parentElement);var m=!0;if(t.classList.contains("vditor-menu--current"))if(o==="quote"){var v=(0,s.lG)(a,"BLOCKQUOTE");v&&(r.insertNode(document.createElement("wbr")),v.outerHTML=v.innerHTML.trim()===""?'<p data-block="0">'.concat(v.innerHTML,"</p>"):v.innerHTML)}else if(o==="link"){var d=(0,s.a1)(r.startContainer,"data-type","a");if(d){var _=(0,s.fb)(r.startContainer,"vditor-ir__link");_?(r.insertNode(document.createElement("wbr")),d.outerHTML=_.innerHTML):d.outerHTML=d.querySelector(".vditor-ir__link").innerHTML+"<wbr>"}}else o==="italic"?ln(r,e,"em"):o==="bold"?ln(r,e,"strong"):o==="strike"?ln(r,e,"s"):o==="inline-code"?ln(r,e,"code"):(o==="check"||o==="list"||o==="ordered-list")&&(rn(e,r,o),m=!1,t.classList.remove("vditor-menu--current"));else{e.ir.element.childNodes.length===0&&(e.ir.element.innerHTML='<p data-block="0"><wbr></p>',(0,M.ib)(e.ir.element,r));var L=(0,s.F9)(r.startContainer);if(o==="line"){if(L){var z=`<hr data-block="0"><p data-block="0"><wbr>
</p>`;L.innerHTML.trim()===""?L.outerHTML=z:L.insertAdjacentHTML("afterend",z)}}else if(o==="quote")L&&(r.insertNode(document.createElement("wbr")),L.outerHTML='<blockquote data-block="0">'.concat(L.outerHTML,"</blockquote>"),m=!1,t.classList.add("vditor-menu--current"));else if(o==="link"){var W=void 0;r.toString()===""?W="".concat(n,"<wbr>").concat(i):W="".concat(n).concat(r.toString()).concat(i.replace(")","<wbr>)")),document.execCommand("insertHTML",!1,W),m=!1,t.classList.add("vditor-menu--current")}else if(o==="italic"||o==="bold"||o==="strike"||o==="inline-code"||o==="code"||o==="table"){var W=void 0,j=!1;r.toString()===""?W="".concat(n,"<wbr>").concat(i):(o==="code"?W="".concat(n,`
`).concat(r.toString(),"<wbr>").concat(i):o==="table"?W="".concat(n).concat(r.toString(),"<wbr>").concat(i):(W="".concat(n,"<wbr>").concat(r.toString(),"<wbr>").concat(i),j=!0),r.deleteContents()),(o==="table"||o==="code")&&(W=`
`+W+`

`);var K=document.createElement("span");if(K.innerHTML=W,r.insertNode(K),bt(e,r),j){var Z=e.ir.element.querySelector("wbr");r.setEndBefore(Z),Z.remove(),(0,M.Hc)(r)}o==="table"&&(r.selectNodeContents(getSelection().getRangeAt(0).startContainer.parentElement),(0,M.Hc)(r))}else(o==="check"||o==="list"||o==="ordered-list")&&(rn(e,r,o,!1),m=!1,g(e.toolbar.elements,["check","list","ordered-list"]),t.classList.add("vditor-menu--current"))}(0,M.ib)(e.ir.element,r),_t(e),m&&wt(e)},_r=function(e,t,n,i){function r(o){return o instanceof n?o:new n(function(a){a(o)})}return new(n||(n=Promise))(function(o,a){function m(_){try{d(i.next(_))}catch(L){a(L)}}function v(_){try{d(i.throw(_))}catch(L){a(L)}}function d(_){_.done?o(_.value):r(_.value).then(m,v)}d((i=i.apply(e,t||[])).next())})},xr=function(e,t){var n={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},i,r,o,a;return a={next:m(0),throw:m(1),return:m(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function m(d){return function(_){return v([d,_])}}function v(d){if(i)throw new TypeError("Generator is already executing.");for(;a&&(a=0,d[0]&&(n=0)),n;)try{if(i=1,r&&(o=d[0]&2?r.return:d[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,d[1])).done)return o;switch(r=0,o&&(d=[d[0]&2,o.value]),d[0]){case 0:case 1:o=d;break;case 4:return n.label++,{value:d[1],done:!1};case 5:n.label++,r=d[1],d=[0];continue;case 7:d=n.ops.pop(),n.trys.pop();continue;default:if(o=n.trys,!(o=o.length>0&&o[o.length-1])&&(d[0]===6||d[0]===2)){n=0;continue}if(d[0]===3&&(!o||d[1]>o[0]&&d[1]<o[3])){n.label=d[1];break}if(d[0]===6&&n.label<o[1]){n.label=o[1],o=d;break}if(o&&n.label<o[2]){n.label=o[2],n.ops.push(d);break}o[2]&&n.ops.pop(),n.trys.pop();continue}d=t.call(e,n)}catch(_){d=[6,_],r=0}finally{i=o=0}if(d[0]&5)throw d[1];return{value:d[0]?d[1]:void 0,done:!0}}},Sr=(function(){function e(t){var n=this;this.splitChar="",this.lastIndex=-1,this.fillEmoji=function(i,r){if(n.element.style.display="none",r.currentMode!=="sv"){var o=decodeURIComponent(i.getAttribute("data-value")),a=window.getSelection().getRangeAt(0);if(r.currentMode==="ir"){var m=(0,s.a1)(a.startContainer,"data-type","code-block-info");if(m){m.textContent=k.g.ZWSP+o.trimRight(),a.selectNodeContents(m),a.collapse(!1),_t(r),m.parentElement.querySelectorAll("code").forEach(function(L){L.className="language-"+o.trimRight()}),je(m.parentElement.querySelector(".vditor-ir__preview"),r),n.recentLanguage=o.trimRight();return}}if(r.currentMode==="wysiwyg"&&a.startContainer.nodeType!==3){var v=a.startContainer,d=void 0;if(v.classList.contains("vditor-input")?d=v:d=v.firstElementChild,d&&d.classList.contains("vditor-input")){d.value=o.trimRight(),a.selectNodeContents(d),a.collapse(!1),d.dispatchEvent(new CustomEvent("input",{detail:1})),n.recentLanguage=o.trimRight();return}}if(a.setStart(a.startContainer,n.lastIndex),a.deleteContents(),r.options.hint.parse?r.currentMode==="wysiwyg"?(0,M.oC)(r.lute.SpinVditorDOM(o),r):(0,M.oC)(r.lute.SpinVditorIRDOM(o),r):(0,M.oC)(o,r),n.splitChar===":"&&o.indexOf(":")>-1&&a.insertNode(document.createTextNode(" ")),a.collapse(!1),(0,M.Hc)(a),r.currentMode==="wysiwyg"){var _=(0,s.fb)(a.startContainer,"vditor-wysiwyg__block");_&&_.lastElementChild.classList.contains("vditor-wysiwyg__preview")&&(_.lastElementChild.innerHTML=_.firstElementChild.innerHTML,je(_.lastElementChild,r))}else if(r.currentMode==="ir"){var _=(0,s.fb)(a.startContainer,"vditor-ir__marker--pre");_&&_.nextElementSibling.classList.contains("vditor-ir__preview")&&(_.nextElementSibling.innerHTML=_.innerHTML,je(_.nextElementSibling,r))}fe(r)}},this.timeId=-1,this.element=document.createElement("div"),this.element.className="vditor-hint",this.recentLanguage="",t.push({key:":"})}return e.prototype.render=function(t){var n=this;if(t.currentMode==="sv"){this.element.style.display="none";return}if(window.getSelection().focusNode){var i,r=getSelection().getRangeAt(0);i=r.startContainer.textContent.substring(0,r.startOffset)||"";var o=this.getKey(i,t.options.hint.extend);if(typeof o>"u")this.element.style.display="none",clearTimeout(this.timeId);else if(this.splitChar===":"){var a=o===""?t.options.hint.emoji:t.lute.GetEmojis(),m=[];Object.keys(a).forEach(function(v){v.indexOf(o.toLowerCase())===0&&(a[v].indexOf(".")>-1?m.push({html:'<img src="'.concat(a[v],'" title=":').concat(v,':"/> :').concat(v,":"),value:":".concat(v,":")}):m.push({html:'<span class="vditor-hint__emoji">'.concat(a[v],"</span>").concat(v),value:a[v]}))}),this.genHTML(m,o,t)}else t.options.hint.extend.forEach(function(v){v.key===n.splitChar&&(clearTimeout(n.timeId),n.timeId=window.setTimeout(function(){return _r(n,void 0,void 0,function(){var d;return xr(this,function(_){switch(_.label){case 0:return d=this.genHTML,[4,v.hint(o)];case 1:return d.apply(this,[_.sent(),o,t]),[2]}})})},t.options.hint.delay))})}},e.prototype.genHTML=function(t,n,i){var r=this;if(t.length===0){this.element.style.display="none";return}var o=i[i.currentMode].element,a=(0,M.Ny)(o),m=a.left+(i.options.outline.position==="left"?i.outline.element.offsetWidth:0),v=a.top,d="";t.forEach(function(L,z){if(!(z>7)){var W=L.html;if(n!==""){var j=W.lastIndexOf(">")+1,K=W.substr(j),Z=K.toLowerCase().indexOf(n.toLowerCase());Z>-1&&(K=K.substring(0,Z)+"<b>"+K.substring(Z,Z+n.length)+"</b>"+K.substring(Z+n.length),W=W.substr(0,j)+K)}d+='<button type="button" data-value="'.concat(encodeURIComponent(L.value),` "
`).concat(z===0?"class='vditor-hint--current'":"","> ").concat(W,"</button>")}}),this.element.innerHTML=d;var _=parseInt(document.defaultView.getComputedStyle(o,null).getPropertyValue("line-height"),10);this.element.style.top="".concat(v+(_||22),"px"),this.element.style.left="".concat(m,"px"),this.element.style.display="block",this.element.style.right="auto",this.element.querySelectorAll("button").forEach(function(L){L.addEventListener("click",function(z){r.fillEmoji(L,i),z.preventDefault()})}),this.element.getBoundingClientRect().bottom>window.innerHeight&&(this.element.style.top="".concat(v-this.element.offsetHeight,"px")),this.element.getBoundingClientRect().right>window.innerWidth&&(this.element.style.left="auto",this.element.style.right="0")},e.prototype.select=function(t,n){if(this.element.querySelectorAll("button").length===0||this.element.style.display==="none")return!1;var i=this.element.querySelector(".vditor-hint--current");if(t.key==="ArrowDown")return t.preventDefault(),t.stopPropagation(),i.removeAttribute("class"),i.nextElementSibling?i.nextElementSibling.className="vditor-hint--current":this.element.children[0].className="vditor-hint--current",!0;if(t.key==="ArrowUp"){if(t.preventDefault(),t.stopPropagation(),i.removeAttribute("class"),i.previousElementSibling)i.previousElementSibling.className="vditor-hint--current";else{var r=this.element.children.length;this.element.children[r-1].className="vditor-hint--current"}return!0}else if(!(0,l.yl)(t)&&!t.shiftKey&&!t.altKey&&t.key==="Enter"&&!t.isComposing)return t.preventDefault(),t.stopPropagation(),this.fillEmoji(i,n),!0;return!1},e.prototype.getKey=function(t,n){var i=this;this.lastIndex=-1,this.splitChar="",n.forEach(function(d){var _=t.lastIndexOf(d.key);i.lastIndex<_&&(i.splitChar=d.key,i.lastIndex=_)});var r;if(this.lastIndex===-1)return r;var o=t.split(this.splitChar),a=o[o.length-1],m=32;if(o.length>1&&a.trim()===a)if(o.length===2&&o[0]===""&&o[1].length<m)r=o[1];else{var v=o[o.length-2].slice(-1);(0,T.X)(v)===" "&&a.length<m&&(r=a)}return r},e})(),Qn=function(e){return Array.from(e.children).find(function(t){return t.getAttribute("data-type")==="heading-marker"})},er=function(e,t){if(!(!e||!t||e.tagName!==t.tagName||e.getAttribute("data-marker")!==t.getAttribute("data-marker")||t.textContent.trim()===""||Qn(t))){var n=Qn(e);n&&(e.firstElementChild===n?t.insertBefore(n.cloneNode(!0),t.firstChild):e.lastElementChild===n&&t.appendChild(n.cloneNode(!0)))}},Tr=(function(){function e(t){this.composingLock=!1;var n=document.createElement("div");n.className="vditor-ir",n.innerHTML='<pre class="vditor-reset" placeholder="'.concat(t.options.placeholder,`"
 contenteditable="true" spellcheck="false"></pre>`),this.element=n.firstElementChild,this.bindEvent(t),fn(t,this.element),xn(t,this.element),Sn(t,this.element),hn(t,this.element),Mn(t,this.element),pn(t,this.element),Tn(t,this.element,this.copy),Cn(t,this.element,this.copy)}return e.prototype.copy=function(t,n){var i=getSelection().getRangeAt(0);if(i.toString()!==""){t.stopPropagation(),t.preventDefault();var r=document.createElement("div");r.appendChild(i.cloneContents());var o=r.querySelectorAll("h1, h2, h3, h4, h5, h6");er((0,S.W)(i.startContainer),o.item(0)),er((0,S.W)(i.endContainer),o.item(o.length-1)),t.clipboardData.setData("text/plain",n.lute.VditorIRDOM2Md(r.innerHTML).trim()),t.clipboardData.setData("text/html","")}},e.prototype.bindEvent=function(t){var n=this;this.element.addEventListener("paste",function(i){sn(t,i,{pasteCode:function(r){document.execCommand("insertHTML",!1,r)}})}),this.element.addEventListener("scroll",function(){f(t,["hint"])}),this.element.addEventListener("compositionstart",function(i){n.composingLock=!0}),this.element.addEventListener("compositionend",function(i){(0,l.vU)()||bt(t,getSelection().getRangeAt(0).cloneRange()),n.composingLock=!1}),this.element.addEventListener("input",function(i){if(!(i.inputType==="deleteByDrag"||i.inputType==="insertFromDrop")){if(n.preventInput){n.preventInput=!1,_t(t,{enableAddUndoStack:!0,enableHint:!0,enableInput:!0});return}n.composingLock||i.data==="\u2018"||i.data==="\u201C"||i.data==="\u300A"||bt(t,getSelection().getRangeAt(0).cloneRange(),!1,i)}}),this.element.addEventListener("click",function(i){if(i.target.tagName==="INPUT"){i.target.checked?i.target.setAttribute("checked","checked"):i.target.removeAttribute("checked"),n.preventInput=!0,_t(t);return}var r=(0,M.zh)(t),o=(0,s.fb)(i.target,"vditor-ir__preview");if(o||(o=(0,s.fb)(r.startContainer,"vditor-ir__preview")),o&&(o.previousElementSibling.firstElementChild?r.selectNodeContents(o.previousElementSibling.firstElementChild):r.selectNodeContents(o.previousElementSibling),r.collapse(!0),(0,M.Hc)(r),Xe(t)),i.target.tagName==="IMG"){var a=i.target.parentElement.querySelector(".vditor-ir__marker--link");a&&(r.selectNode(a),(0,M.Hc)(r))}var m=(0,s.a1)(i.target,"data-type","a");if(m&&!m.classList.contains("vditor-ir__node--expand")){t.options.link.click?t.options.link.click(m.querySelector(":scope > .vditor-ir__marker--link")):t.options.link.isOpen&&window.open(m.querySelector(":scope > .vditor-ir__marker--link").textContent);return}if(i.target.isEqualNode(n.element)&&n.element.lastElementChild&&r.collapsed){var v=n.element.lastElementChild.getBoundingClientRect();i.y>v.top+v.height&&(n.element.lastElementChild.tagName==="P"&&n.element.lastElementChild.textContent.trim().replace(k.g.ZWSP,"")===""?(r.selectNodeContents(n.element.lastElementChild),r.collapse(!1)):(n.element.insertAdjacentHTML("beforeend",'<p data-block="0">'.concat(k.g.ZWSP,"<wbr></p>")),(0,M.ib)(n.element,r)))}r.toString()===""?Fe(r,t):setTimeout(function(){Fe((0,M.zh)(t),t)}),Ot(i,t),wt(t)}),this.element.addEventListener("keyup",function(i){if(!(i.isComposing||(0,l.yl)(i))){if(i.key==="Enter"&&Xe(t),wt(t),(i.key==="Backspace"||i.key==="Delete")&&t.ir.element.innerHTML!==""&&t.ir.element.childNodes.length===1&&t.ir.element.firstElementChild&&t.ir.element.firstElementChild.tagName==="P"&&t.ir.element.firstElementChild.childElementCount===0&&(t.ir.element.textContent===""||t.ir.element.textContent===`
`)){t.ir.element.innerHTML="";return}var r=(0,M.zh)(t);i.key==="Backspace"?((0,l.vU)()&&r.startContainer.textContent===`
`&&r.startOffset===1&&(r.startContainer.textContent="",Fe(r,t)),n.element.querySelectorAll(".language-math").forEach(function(a){var m=a.querySelector("br");m&&m.remove()})):i.key.indexOf("Arrow")>-1?((i.key==="ArrowLeft"||i.key==="ArrowRight")&&$n(t),Fe(r,t)):i.keyCode===229&&i.code===""&&i.key==="Unidentified"&&Fe(r,t);var o=(0,s.fb)(r.startContainer,"vditor-ir__preview");if(o){if(i.key==="ArrowUp"||i.key==="ArrowLeft")return o.previousElementSibling.firstElementChild?r.selectNodeContents(o.previousElementSibling.firstElementChild):r.selectNodeContents(o.previousElementSibling),r.collapse(!1),i.preventDefault(),!0;if(o.tagName==="SPAN"&&(i.key==="ArrowDown"||i.key==="ArrowRight"))return o.parentElement.getAttribute("data-type")==="html-entity"?(o.parentElement.insertAdjacentText("afterend",k.g.ZWSP),r.setStart(o.parentElement.nextSibling,1)):r.selectNodeContents(o.parentElement.lastElementChild),r.collapse(!1),i.preventDefault(),!0}}})},e})(),tr=function(e){var t="";return e.currentMode==="sv"?t=e.lute.Md2HTML(N(e)):e.currentMode==="wysiwyg"?t=e.lute.VditorDOM2HTML(e.wysiwyg.element.innerHTML):e.currentMode==="ir"&&(t=e.lute.VditorIRDOM2HTML(e.ir.element.innerHTML)),(0,p.V)(t,e.options.preview.markdown.imageCaption)},Cr=F(214),nr=F(436),Mr=(function(){function e(t){this.element=document.createElement("div"),this.element.className="vditor-outline",this.element.innerHTML='<div class="vditor-outline__title">'.concat(t,`</div>
<div class="vditor-outline__content"></div>`)}return e.prototype.render=function(t){var n="";return t.preview.element.style.display==="block"?n=(0,nr.k)(t.preview.previewElement,this.element.lastElementChild,t):n=(0,nr.k)(t[t.currentMode].element,this.element.lastElementChild,t),n},e.prototype.toggle=function(t,n,i){var r;n===void 0&&(n=!0),i===void 0&&(i=!0);var o=(r=t.toolbar.elements.outline)===null||r===void 0?void 0:r.firstElementChild;if(n&&window.innerWidth>=k.g.MOBILE_WIDTH?(this.element.style.display="block",this.render(t),o?.classList.add("vditor-menu--current")):(this.element.style.display="none",o?.classList.remove("vditor-menu--current")),i&&getSelection().rangeCount>0){var a=getSelection().getRangeAt(0);t[t.currentMode].element.contains(a.startContainer)&&(0,M.Hc)(a)}Ve(t)},e})(),Lr=F(280),Ar=(function(){function e(t){var n=this;this.element=document.createElement("div"),this.element.className="vditor-preview",this.previewElement=document.createElement("div"),this.previewElement.className="vditor-reset",t.options.classes.preview&&this.previewElement.classList.add(t.options.classes.preview),this.previewElement.style.maxWidth=t.options.preview.maxWidth+"px",this.previewElement.addEventListener("copy",function(v){if(v.target.tagName!=="TEXTAREA"){var d=document.createElement("div");d.className="vditor-reset",d.appendChild(getSelection().getRangeAt(0).cloneContents()),n.copyToX(t,d,"default"),v.preventDefault()}}),this.previewElement.addEventListener("click",function(v){var d=(0,s.lG)(v.target,"SPAN");if(d&&(0,s.fb)(d,"vditor-toc")){var _=n.previewElement.querySelector("#"+d.getAttribute("data-target-id"));_&&(n.element.scrollTop=_.offsetTop);return}if(v.target.tagName==="A"){t.options.link.click?t.options.link.click(v.target):t.options.link.isOpen&&window.open(v.target.getAttribute("href")),v.preventDefault();return}v.target.tagName==="IMG"&&(t.options.image.preview?t.options.image.preview(v.target):t.options.image.isPreview&&(0,ge.E)(v.target,t.options.lang,t.options.theme))}),this.element.appendChild(this.previewElement);var i=t.options.preview.actions;if(i.length!==0){var r=document.createElement("div");r.className="vditor-preview__action";for(var o=[],a=0;a<i.length;a++){var m=i[a];if(typeof m=="object"){o.push('<button type="button" data-type="'.concat(m.key,'" class="').concat(m.className,'"').concat(m.tooltip?' aria-label="'.concat(m.tooltip,'"'):"",'">').concat(m.text,"</button>"));continue}switch(m){case"desktop":o.push('<button type="button" class="vditor-preview__action--current" data-type="desktop">Desktop</button>');break;case"tablet":o.push('<button type="button" data-type="tablet">Tablet</button>');break;case"mobile":o.push('<button type="button" data-type="mobile">Mobile/Wechat</button>');break;case"mp-wechat":o.push('<button type="button" data-type="mp-wechat" class="vditor-tooltipped vditor-tooltipped__w" aria-label="\u590D\u5236\u5230\u516C\u4F17\u53F7"><svg><use xlink:href="#vditor-icon-mp-wechat"></use></svg></button>');break;case"zhihu":o.push('<button type="button" data-type="zhihu" class="vditor-tooltipped vditor-tooltipped__w" aria-label="\u590D\u5236\u5230\u77E5\u4E4E"><svg><use xlink:href="#vditor-icon-zhihu"></use></svg></button>');break}}r.innerHTML=o.join(""),r.addEventListener((0,l.Le)(),function(v){var d=(0,S.S)(v.target,"BUTTON");if(d){var _=d.getAttribute("data-type"),L=i.find(function(z){return z?.key===_});if(L){L.click(_);return}if(_==="mp-wechat"||_==="zhihu"){n.copyToX(t,n.previewElement.cloneNode(!0),_);return}_==="desktop"?n.previewElement.style.width="auto":_==="tablet"?n.previewElement.style.width="780px":n.previewElement.style.width="360px",n.previewElement.scrollWidth>n.previewElement.parentElement.clientWidth&&(n.previewElement.style.width="auto"),n.render(t),r.querySelectorAll("button").forEach(function(z){z.classList.remove("vditor-preview__action--current")}),d.classList.add("vditor-preview__action--current")}}),this.element.insertBefore(r,this.previewElement)}}return e.prototype.render=function(t,n){var i=this;if(clearTimeout(this.mdTimeoutId),this.element.style.display==="none"){this.element.getAttribute("data-type")==="renderPerformance"&&t.tip.hide();return}if(n){this.previewElement.innerHTML=n,(0,p.W)(this.previewElement,"preview",t.options.preview.markdown.imageCaption);return}if(N(t).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")===""){this.previewElement.innerHTML="";return}var r=new Date().getTime(),o=N(t);this.mdTimeoutId=window.setTimeout(function(){if(t.options.preview.url){var a=new XMLHttpRequest;a.open("POST",t.options.preview.url),a.setRequestHeader("Content-Type","application/json;charset=UTF-8"),a.onreadystatechange=function(){if(a.readyState===XMLHttpRequest.DONE)if(a.status===200){var v=JSON.parse(a.responseText);if(v.code!==0){t.tip.show(v.msg);return}t.options.preview.transform&&(v.data=t.options.preview.transform(v.data)),i.previewElement.innerHTML=v.data,i.afterRender(t,r)}else{var d=t.lute.Md2HTML(o);t.options.preview.transform&&(d=t.options.preview.transform(d)),i.previewElement.innerHTML=d,i.afterRender(t,r)}},a.send(JSON.stringify({markdownText:o}))}else{var m=t.lute.Md2HTML(o);t.options.preview.transform&&(m=t.options.preview.transform(m)),i.previewElement.innerHTML=m,i.afterRender(t,r)}},t.options.preview.delay)},e.prototype.afterRender=function(t,n){(0,p.W)(this.previewElement,"preview",t.options.preview.markdown.imageCaption),t.options.preview.parse&&t.options.preview.parse(this.element);var i=new Date().getTime()-n;new Date().getTime()-n>2600?(t.tip.show(window.VditorI18n.performanceTip.replace("${x}",i.toString())),t.preview.element.setAttribute("data-type","renderPerformance")):t.preview.element.getAttribute("data-type")==="renderPerformance"&&(t.tip.hide(),t.preview.element.removeAttribute("data-type"));var r=t.preview.element.querySelector(".vditor-comment--focus");r&&r.classList.remove("vditor-comment--focus"),(0,G.O)(t.preview.previewElement,t.options.preview.hljs),(0,ke.s)(t.options.preview.hljs,t.preview.previewElement,t.options.cdn),(0,Pe.i)(t.preview.previewElement,t.options.cdn,t.options.theme),(0,Te.K)(t.preview.previewElement,t.options.cdn),(0,Ke.J)(t.preview.previewElement,t.options.cdn,t.options.theme),(0,J.P)(t.preview.previewElement,t.options.cdn),(0,me.v)(t.preview.previewElement,t.options.cdn),(0,St.F)(t.preview.previewElement,t.options.cdn),(0,H.p)(t.preview.previewElement,t.options.cdn,t.options.theme),(0,_e.P)(t.preview.previewElement,t.options.cdn,t.options.theme),(0,De.B)(t.preview.previewElement,t.options.cdn),(0,C.Q)(t.preview.previewElement,t.options.cdn),t.options.preview.render.media.enable&&(0,Lr.Y)(t.preview.previewElement),t.options.customRenders.forEach(function(m){m.render(t.preview.previewElement,t)});var o=t.preview.element,a=t.outline.render(t);a===""&&(a="[ToC]"),o.querySelectorAll('[data-type="toc-block"]').forEach(function(m){m.innerHTML=a,(0,ve.H)(m,{cdn:t.options.cdn,math:t.options.preview.math})}),(0,ve.H)(t.preview.previewElement,{cdn:t.options.cdn,math:t.options.preview.math})},e.prototype.copyToX=function(t,n,i){i===void 0&&(i="mp-wechat"),i!=="zhihu"?n.querySelectorAll(".katex-html .base").forEach(function(o){o.style.display="initial"}):n.querySelectorAll(".language-math").forEach(function(o){o.outerHTML='<img class="Formula-image" data-eeimg="true" src="//www.zhihu.com/equation?tex=" alt="'.concat(o.getAttribute("data-math"),'\\" style="display: block; margin: 0 auto; max-width: 100%;">')}),n.style.backgroundColor="#fff",n.querySelectorAll("code").forEach(function(o){o.style.backgroundImage="none"}),this.element.append(n);var r=n.ownerDocument.createRange();r.selectNode(n),(0,M.Hc)(r),document.execCommand("copy"),n.remove(),t.tip.show(["zhihu","mp-wechat"].includes(i)?"\u5DF2\u590D\u5236\uFF0C\u53EF\u5230".concat(i==="zhihu"?"\u77E5\u4E4E":"\u5FAE\u4FE1\u516C\u4F17\u53F7\u5E73\u53F0","\u8FDB\u884C\u7C98\u8D34"):"\u5DF2\u590D\u5236\u5230\u526A\u5207\u677F")},e})(),Or=(function(){function e(t){this.element=document.createElement("div"),this.element.className="vditor-resize vditor-resize--".concat(t.options.resize.position),this.element.innerHTML='<div><svg><use xlink:href="#vditor-icon-resize"></use></svg></div>',this.bindEvent(t)}return e.prototype.bindEvent=function(t){var n=this;this.element.addEventListener("mousedown",function(i){var r=document,o=i.clientY,a=t.element.offsetHeight,m=63+t.element.querySelector(".vditor-toolbar").clientHeight;r.ondragstart=function(){return!1},window.captureEvents&&window.captureEvents(),n.element.classList.add("vditor-resize--selected"),r.onmousemove=function(v){t.options.resize.position==="top"?t.element.style.height=Math.max(m,a+(o-v.clientY))+"px":t.element.style.height=Math.max(m,a+(v.clientY-o))+"px",t.options.typewriterMode&&(t.sv.element.style.paddingBottom=t.sv.element.parentElement.offsetHeight/2+"px")},r.onmouseup=function(){t.options.resize.after&&t.options.resize.after(t.element.offsetHeight-a),window.captureEvents&&window.captureEvents(),r.onmousemove=null,r.onmouseup=null,r.ondragstart=null,r.onselectstart=null,r.onselect=null,n.element.classList.remove("vditor-resize--selected")}})},e})(),Dr=(function(){function e(t){this.composingLock=!1,this.element=document.createElement("textarea"),this.element.className="vditor-sv vditor-reset",this.element.placeholder=t.options.placeholder,this.element.spellcheck=!1,this.bindEvent(t),fn(t,this.element),hn(t,this.element),pn(t,this.element,function(n){de(t,n.replace(/&lt;/g,"<").replace(/&amp;/g,"&"))})}return e.prototype.bindEvent=function(t){var n=this;this.element.addEventListener("blur",function(){t.options.blur&&t.options.blur(N(t))}),this.element.addEventListener("paste",function(i){sn(t,i,{pasteCode:function(r){de(t,r.replace(/&lt;/g,"<").replace(/&amp;/g,"&"))}})}),this.element.addEventListener("scroll",function(){if(t.preview.element.style.display==="block"){var i=n.element.scrollTop,r=n.element.clientHeight,o=n.element.scrollHeight-parseFloat(n.element.style.paddingBottom||"0"),a=t.preview.element;i/r>.5?a.scrollTop=(i+r)*a.scrollHeight/o-r:a.scrollTop=i*a.scrollHeight/o}}),this.element.addEventListener("compositionstart",function(){n.composingLock=!0}),this.element.addEventListener("compositionend",function(){n.composingLock=!1,(0,l.vU)()||B(t)}),this.element.addEventListener("input",function(){n.composingLock||B(t)}),this.element.addEventListener("select",function(){var i=n.element.value.substring(n.element.selectionStart,n.element.selectionEnd);i.trim()?t.options.select&&t.options.select(i):t.options.unSelect&&t.options.unSelect()})},e})(),rr=(function(){function e(){this.element=document.createElement("div"),this.element.className="vditor-tip"}return e.prototype.show=function(t,n){var i=this;n===void 0&&(n=6e3),this.element.className="vditor-tip vditor-tip--show",n===0?(this.element.innerHTML='<div class="vditor-tip__content">'.concat(t,`
<div class="vditor-tip__close">X</div></div>`),this.element.querySelector(".vditor-tip__close").addEventListener("click",function(){i.hide()})):(this.element.innerHTML='<div class="vditor-tip__content">'.concat(t,"</div>"),setTimeout(function(){i.hide()},n)),this.element.removeAttribute("style"),setTimeout(function(){var r=i.element.getBoundingClientRect();r.top<46&&(i.element.style.position="fixed",i.element.style.top="46px")},150)},e.prototype.hide=function(){this.element.className="vditor-messageElementtip",this.element.innerHTML=""},e})(),yn=function(e,t){if(t.options.preview.mode!==e){switch(t.options.preview.mode=e,e){case"both":t.sv.element.style.display="block",t.preview.element.style.display="block",t.preview.render(t),b(t.toolbar.elements,["both"]);break;case"editor":t.sv.element.style.display="block",t.preview.element.style.display="none",g(t.toolbar.elements,["both"]);break;default:break}t.devtools&&t.devtools.renderEchart(t)}},Hr=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Nr=(function(e){Hr(t,e);function t(n,i){var r=e.call(this,n,i)||this;return n.options.preview.mode==="both"&&r.element.children[0].classList.add("vditor-menu--current"),r.element.children[0].addEventListener((0,l.Le)(),function(o){var a=r.element.firstElementChild;a.classList.contains(k.g.CLASS_MENU_DISABLED)||(o.preventDefault(),n.currentMode==="sv"&&(n.options.preview.mode==="both"?yn("editor",n):yn("both",n)))}),r}return t})(Ie),Rr=(function(){function e(){this.element=document.createElement("div"),this.element.className="vditor-toolbar__br"}return e})(),ir=F(580),Ir=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Pr=(function(e){Ir(t,e);function t(n,i){var r=e.call(this,n,i)||this,o=r.element.children[0],a=document.createElement("div");a.className="vditor-hint".concat(i.level===2?"":" vditor-panel--arrow");var m="";return k.g.CODE_THEME.forEach(function(v){m+="<button>".concat(v,"</button>")}),a.innerHTML='<div style="overflow: auto;max-height:'.concat(window.innerHeight/2,'px">').concat(m,"</div>"),a.addEventListener((0,l.Le)(),function(v){v.target.tagName==="BUTTON"&&(f(n,["subToolbar"]),n.options.preview.hljs.style=v.target.textContent,(0,ir.Y)(v.target.textContent,n.options.cdn),v.preventDefault(),v.stopPropagation())}),r.element.appendChild(a),u(n,a,o,i.level),r}return t})(Ie),jr=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Br=(function(e){jr(t,e);function t(n,i){var r=e.call(this,n,i)||this,o=r.element.children[0],a=document.createElement("div");a.className="vditor-hint".concat(i.level===2?"":" vditor-panel--arrow");var m="";return Object.keys(n.options.preview.theme.list).forEach(function(v){m+='<button data-type="'.concat(v,'">').concat(n.options.preview.theme.list[v],"</button>")}),a.innerHTML='<div style="overflow: auto;max-height:'.concat(window.innerHeight/2,'px">').concat(m,"</div>"),a.addEventListener((0,l.Le)(),function(v){v.target.tagName==="BUTTON"&&(f(n,["subToolbar"]),n.options.preview.theme.current=v.target.getAttribute("data-type"),(0,Be.Z)(n.options.preview.theme.current,n.options.preview.theme.path),v.preventDefault(),v.stopPropagation())}),r.element.appendChild(a),u(n,a,o,i.level),r}return t})(Ie),Ur=(function(){function e(t){this.element=document.createElement("span"),this.element.className="vditor-counter vditor-tooltipped vditor-tooltipped__nw",this.render(t,"")}return e.prototype.render=function(t,n){var i=n.endsWith(`
`)?n.length-1:n.length;if(t.options.counter.type==="text"&&t[t.currentMode]){var r=t[t.currentMode].element.cloneNode(!0);r.querySelectorAll(".vditor-wysiwyg__preview").forEach(function(o){o.remove()}),i=r.textContent.length}typeof t.options.counter.max=="number"?(i>t.options.counter.max?this.element.className="vditor-counter vditor-counter--error":this.element.className="vditor-counter",this.element.innerHTML="".concat(i,"/").concat(t.options.counter.max)):this.element.innerHTML="".concat(i),this.element.setAttribute("aria-label",t.options.counter.type),t.options.counter.after&&t.options.counter.after(i,{enable:t.options.counter.enable,max:t.options.counter.max,type:t.options.counter.type})},e})(),zr=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Wr=(function(e){zr(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r.element.children[0].innerHTML=i.icon,r.element.children[0].addEventListener((0,l.Le)(),function(o){o.preventDefault(),!o.currentTarget.classList.contains(k.g.CLASS_MENU_DISABLED)&&i.click(o,n)}),r}return t})(Ie),Fr=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Vr=(function(e){Fr(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r.element.firstElementChild.addEventListener((0,l.Le)(),function(o){var a=r.element.firstElementChild;a.classList.contains(k.g.CLASS_MENU_DISABLED)||(o.preventDefault(),a.classList.contains("vditor-menu--current")?(a.classList.remove("vditor-menu--current"),n.devtools.element.style.display="none",Ve(n)):(a.classList.add("vditor-menu--current"),n.devtools.element.style.display="block",Ve(n),n.devtools.renderEchart(n)))}),r}return t})(Ie),qr=(function(){function e(){this.element=document.createElement("div"),this.element.className="vditor-toolbar__divider"}return e})(),Kr=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Gr=(function(e){Kr(t,e);function t(n,i){var r=e.call(this,n,i)||this,o=document.createElement("div");o.className="vditor-panel vditor-panel--arrow";var a="";return Object.keys(n.options.hint.emoji).forEach(function(m){var v=n.options.hint.emoji[m];v.indexOf(".")>-1?a+='<button data-value=":'.concat(m,': " data-key=":').concat(m,`:"><img
data-value=":`).concat(m,': " data-key=":').concat(m,':" class="vditor-emojis__icon" src="').concat(v,'"/></button>'):a+='<button data-value="'.concat(v,` "
 data-key="`).concat(m,'"><span class="vditor-emojis__icon">').concat(v,"</span></button>")}),o.innerHTML='<div class="vditor-emojis" style="max-height: '.concat(n.options.height==="auto"?"auto":n.options.height-80,'px">').concat(a,`</div><div class="vditor-emojis__tail">
    <span class="vditor-emojis__tip"></span><span>`).concat(n.options.hint.emojiTail||"",`</span>
</div>`),r.element.appendChild(o),u(n,o,r.element.firstElementChild,i.level),r.bindEvent(n),r}return t.prototype.bindEvent=function(n){var i=this;this.element.lastElementChild.addEventListener((0,l.Le)(),function(r){var o=(0,S.S)(r.target,"BUTTON");if(o){r.preventDefault();var a=o.getAttribute("data-value");if(n.currentMode==="sv"){de(n,a),i.element.lastElementChild.style.display="none",fe(n);return}var m=(0,M.zh)(n),v=a;if(n.currentMode==="wysiwyg"?v=n.lute.SpinVditorDOM(a):n.currentMode==="ir"&&(v=n.lute.SpinVditorIRDOM(a)),a.indexOf(":")>-1){var d=document.createElement("div");d.innerHTML=v,v=d.firstElementChild.firstElementChild.outerHTML+" ",(0,M.oC)(v,n)}else m.extractContents(),m.insertNode(document.createTextNode(a)),(0,s.F9)(m.startContainer)||xe(n,m);m.collapse(!1),(0,M.Hc)(m),i.element.lastElementChild.style.display="none",fe(n)}}),this.element.lastElementChild.addEventListener("mouseover",function(r){var o=(0,S.S)(r.target,"BUTTON");o&&(i.element.querySelector(".vditor-emojis__tip").innerHTML=o.getAttribute("data-key"))})},t})(Ie),or=function(e,t,n){var i=document.createElement("a");"download"in i?(i.download=n,i.style.display="none",i.href=URL.createObjectURL(new Blob([t])),document.body.appendChild(i),i.click(),i.remove()):e.tip.show(window.VditorI18n.downloadTip,0)},Zr=function(e){var t=N(e);or(e,t,t.substr(0,10)+".md")},Yr=function(e){e.tip.show(window.VditorI18n.generate,3800);var t=document.querySelector("#vditorExportIframe");t.contentDocument.open(),t.contentDocument.write('<link rel="stylesheet" href="'.concat(e.options.cdn,`/dist/index.css"/>
<script src="`).concat(e.options.cdn,`/dist/method.min.js"><\/script>
<div id="preview" style="width: 800px"></div>
<script>
window.addEventListener("message", (e) => {
  if(!e.data) {
    return;
  }
  Vditor.preview(document.getElementById('preview'), e.data, {
    cdn: "`).concat(e.options.cdn,`",
    markdown: {
      callout: `).concat(JSON.stringify(e.options.preview.markdown.callout),`,
      inlineMath: `).concat(JSON.stringify(e.options.preview.markdown.inlineMath),`,
      theme: `).concat(JSON.stringify(e.options.preview.theme),`
    },
    hljs: {
      style: "`).concat(e.options.preview.hljs.style,`"
    }
  });
  setTimeout(() => {
        window.print();
    }, 3600);
}, false);
<\/script>`)),t.contentDocument.close(),setTimeout(function(){t.contentWindow.postMessage(N(e),"*")},200)},Jr=function(e){var t=tr(e),n='<html><head><link rel="stylesheet" type="text/css" href="'.concat(e.options.cdn,`/dist/index.css"/>
<script src="`).concat(e.options.cdn,"/dist/js/i18n/").concat(e.options.lang,`.js"><\/script>
<script src="`).concat(e.options.cdn,`/dist/method.min.js"><\/script></head>
<body><div class="vditor-reset" id="preview">`).concat(t,`</div>
<script>
    const previewElement = document.getElementById('preview')
    Vditor.setContentTheme('`).concat(e.options.preview.theme.current,"', '").concat(e.options.preview.theme.path,`');
    Vditor.codeRender(previewElement);
    Vditor.highlightRender(`).concat(JSON.stringify(e.options.preview.hljs),", previewElement, '").concat(e.options.cdn,`');
    Vditor.mathRender(previewElement, {
        cdn: '`).concat(e.options.cdn,`',
        math: `).concat(JSON.stringify(e.options.preview.math),`,
    });
    Vditor.mermaidRender(previewElement, '`).concat(e.options.cdn,"', '").concat(e.options.theme,`');
    Vditor.SMILESRender(previewElement, '`).concat(e.options.cdn,"', '").concat(e.options.theme,`');
    Vditor.markmapRender(previewElement, '`).concat(e.options.cdn,`');
    Vditor.flowchartRender(previewElement, '`).concat(e.options.cdn,`');
    Vditor.graphvizRender(previewElement, '`).concat(e.options.cdn,`');
    Vditor.wavedromRender(previewElement, '`).concat(e.options.cdn,`');
    Vditor.chartRender(previewElement, '`).concat(e.options.cdn,"', '").concat(e.options.theme,`');
    Vditor.mindmapRender(previewElement, '`).concat(e.options.cdn,"', '").concat(e.options.theme,`');
    Vditor.abcRender(previewElement, '`).concat(e.options.cdn,`');
    `).concat(e.options.preview.render.media.enable?"Vditor.mediaRender(previewElement);":"",`
    Vditor.speechRender(previewElement);
<\/script>
<script src="`).concat(e.options.cdn,"/dist/js/icons/").concat(e.options.icon,'.js"><\/script></body></html>');or(e,n,t.substr(0,10)+".html")},Xr=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),$r=(function(e){Xr(t,e);function t(n,i){var r=e.call(this,n,i)||this,o=r.element.children[0],a=document.createElement("div");return a.className="vditor-hint".concat(i.level===2?"":" vditor-panel--arrow"),a.innerHTML=`<button data-type="markdown">Markdown</button>
<button data-type="pdf">PDF</button>
<button data-type="html">HTML</button>`,a.addEventListener((0,l.Le)(),function(m){var v=m.target;if(v.tagName==="BUTTON"){switch(v.getAttribute("data-type")){case"markdown":Zr(n);break;case"pdf":Yr(n);break;case"html":Jr(n);break;default:break}f(n,["subToolbar"]),m.preventDefault(),m.stopPropagation()}}),r.element.appendChild(a),u(n,a,o,i.level),r}return t})(Ie),Qr=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),ei=(function(e){Qr(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r._bindEvent(n,i),r}return t.prototype._bindEvent=function(n,i){this.element.children[0].addEventListener((0,l.Le)(),function(r){r.preventDefault(),n.element.className.includes("vditor--fullscreen")?(i.level||(this.innerHTML=i.icon),n.element.style.zIndex="",document.body.style.overflow="",n.element.classList.remove("vditor--fullscreen"),Object.keys(n.toolbar.elements).forEach(function(o){var a=n.toolbar.elements[o].firstChild;a&&(a.className=a.className.replace("__s","__n"),n.options.toolbar.forEach(function(m){typeof m!="string"&&m.tipPosition&&m.name===a.dataset.type&&(a.className="vditor-tooltipped vditor-tooltipped__".concat(m.tipPosition))}))}),n.counter&&(n.counter.element.className=n.counter.element.className.replace("__s","__n"))):(i.level||(this.innerHTML='<svg><use xlink:href="#vditor-icon-contract"></use></svg>'),n.element.style.zIndex=n.options.fullscreen.index.toString(),document.body.style.overflow="hidden",n.element.classList.add("vditor--fullscreen"),Object.keys(n.toolbar.elements).forEach(function(o){var a=n.toolbar.elements[o].firstChild;a&&(a.className=a.className.replace("__n","__s"))}),n.counter&&(n.counter.element.className=n.counter.element.className.replace("__n","__s"))),n.devtools&&n.devtools.renderEchart(n),i.click&&i.click(r,n),Ve(n),Oe(n)})},t})(Ie),ti=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),ni=(function(e){ti(t,e);function t(n,i){var r=e.call(this,n,i)||this,o=document.createElement("div");return o.className="vditor-hint vditor-panel--arrow",o.innerHTML='<button data-tag="h1" data-value="# ">'.concat(window.VditorI18n.heading1," ").concat((0,l.ns)("&lt;\u2325\u23181>"),`</button>
<button data-tag="h2" data-value="## ">`).concat(window.VditorI18n.heading2," &lt;").concat((0,l.ns)("\u2325\u23182"),`></button>
<button data-tag="h3" data-value="### ">`).concat(window.VditorI18n.heading3," &lt;").concat((0,l.ns)("\u2325\u23183"),`></button>
<button data-tag="h4" data-value="#### ">`).concat(window.VditorI18n.heading4," &lt;").concat((0,l.ns)("\u2325\u23184"),`></button>
<button data-tag="h5" data-value="##### ">`).concat(window.VditorI18n.heading5," &lt;").concat((0,l.ns)("\u2325\u23185"),`></button>
<button data-tag="h6" data-value="###### ">`).concat(window.VditorI18n.heading6," &lt;").concat((0,l.ns)("\u2325\u23186"),"></button>"),r.element.appendChild(o),r._bindEvent(n,o),r}return t.prototype._bindEvent=function(n,i){var r=this.element.children[0];r.addEventListener((0,l.Le)(),function(a){a.preventDefault(),clearTimeout(n.wysiwyg.afterRenderTimeoutId),clearTimeout(n.ir.processTimeoutId),clearTimeout(n.sv.processTimeoutId),!r.classList.contains(k.g.CLASS_MENU_DISABLED)&&(r.blur(),r.classList.contains("vditor-menu--current")?(n.currentMode==="wysiwyg"?(qt(n),I(n)):n.currentMode==="ir"&&Xt(n,""),r.classList.remove("vditor-menu--current")):(f(n,["subToolbar"]),i.style.display="block"))});for(var o=0;o<6;o++)i.children.item(o).addEventListener((0,l.Le)(),function(a){a.preventDefault(),n.currentMode==="wysiwyg"?(Ct(n,a.target.getAttribute("data-tag")),I(n),r.classList.add("vditor-menu--current")):n.currentMode==="ir"?(Xt(n,a.target.getAttribute("data-value")),r.classList.add("vditor-menu--current")):q(n,a.target.getAttribute("data-value")),i.style.display="none"})},t})(Ie),ri=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),ii=(function(e){ri(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r.element.children[0].addEventListener((0,l.Le)(),function(o){o.preventDefault(),n.tip.show(`<div style="margin-bottom:14px;font-size: 14px;line-height: 22px;min-width:300px;max-width: 360px;display: flex;">
<div style="margin-top: 14px;flex: 1">
    <div>Markdown \u4F7F\u7528\u6307\u5357</div>
    <ul style="list-style: none">
        <li><a href="https://ld246.com/article/1583308420519" target="_blank">\u8BED\u6CD5\u901F\u67E5\u624B\u518C</a></li>
        <li><a href="https://ld246.com/article/1583129520165" target="_blank">\u57FA\u7840\u8BED\u6CD5</a></li>
        <li><a href="https://ld246.com/article/1583305480675" target="_blank">\u6269\u5C55\u8BED\u6CD5</a></li>
        <li><a href="https://ld246.com/article/1582778815353" target="_blank">\u952E\u76D8\u5FEB\u6377\u952E</a></li>
    </ul>
</div>
<div style="margin-top: 14px;flex: 1">
    <div>Vditor \u652F\u6301</div>
    <ul style="list-style: none">
        <li><a href="https://github.com/Vanessa219/vditor/issues" target="_blank">Issues</a></li>
        <li><a href="https://ld246.com/tag/vditor" target="_blank">\u5B98\u65B9\u8BA8\u8BBA\u533A</a></li>
        <li><a href="https://ld246.com/article/1549638745630" target="_blank">\u5F00\u53D1\u624B\u518C</a></li>
        <li><a href="https://ld246.com/guide/markdown" target="_blank">\u6F14\u793A\u5730\u5740</a></li>
    </ul>
</div></div>`,0)}),r}return t})(Ie),oi=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),ai=(function(e){oi(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r.element.children[0].addEventListener((0,l.Le)(),function(o){if(o.preventDefault(),!(r.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)||n.currentMode==="sv")){var a=(0,M.zh)(n),m=(0,s.lG)(a.startContainer,"LI");m&&Rn(n,m,a)}}),r}return t})(Ie),si=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),li=(function(e){si(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r.element.children[0].addEventListener((0,l.Le)(),function(o){o.preventDefault(),n.tip.show(`<div style="max-width: 520px; font-size: 14px;line-height: 22px;margin-bottom: 14px;">
<p style="text-align: center;margin: 14px 0">
    <em>\u4E0B\u4E00\u4EE3\u7684 Markdown \u7F16\u8F91\u5668\uFF0C\u4E3A\u672A\u6765\u800C\u6784\u5EFA</em>
</p>
<div style="display: flex;margin-bottom: 14px;flex-wrap: wrap;align-items: center">
    <img src="https://unpkg.com/vditor/dist/images/logo.png" style="margin: 0 auto;height: 68px"/>
    <div>&nbsp;&nbsp;</div>
    <div style="flex: 1;min-width: 250px">
        Vditor \u662F\u4E00\u6B3E\u6D4F\u89C8\u5668\u7AEF\u7684 Markdown \u7F16\u8F91\u5668\uFF0C\u652F\u6301\u6240\u89C1\u5373\u6240\u5F97\u3001\u5373\u65F6\u6E32\u67D3\uFF08\u7C7B\u4F3C Typora\uFF09\u548C\u5206\u5C4F\u9884\u89C8\u6A21\u5F0F\u3002
        \u5B83\u4F7F\u7528 TypeScript \u5B9E\u73B0\uFF0C\u652F\u6301\u539F\u751F JavaScript \u4EE5\u53CA Vue\u3001React\u3001Angular \u548C Svelte \u7B49\u6846\u67B6\u3002
    </div>
</div>
<div style="display: flex;flex-wrap: wrap;">
    <ul style="list-style: none;flex: 1;min-width:148px">
        <li>
        \u9879\u76EE\u5730\u5740\uFF1A<a href="https://b3log.org/vditor" target="_blank">b3log.org/vditor</a>
        </li>
        <li>
        \u5F00\u6E90\u534F\u8BAE\uFF1AMIT
        </li>
    </ul>
    <ul style="list-style: none;margin-right: 18px">
        <li>
        \u7EC4\u4EF6\u7248\u672C\uFF1AVditor v`.concat(k.H," / Lute v").concat(Lute.Version,`
        </li>
        <li>
        \u8D5E\u52A9\u6350\u8D60\uFF1A<a href="https://ld246.com/sponsor" target="_blank">https://ld246.com/sponsor</a>
        </li>
    </ul>
</div>
</div>`),0)}),r}return t})(Ie),ci=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),ui=(function(e){ci(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r.element.children[0].addEventListener((0,l.Le)(),function(o){o.preventDefault(),!(r.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)||n.currentMode==="sv")&&Yt(n,"afterend")}),r}return t})(Ie),di=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),fi=(function(e){di(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r.element.children[0].addEventListener((0,l.Le)(),function(o){o.preventDefault(),!(r.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)||n.currentMode==="sv")&&Yt(n,"beforebegin")}),r}return t})(Ie),pi=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),hi=(function(e){pi(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r.element.children[0].addEventListener((0,l.Le)(),function(o){if(o.preventDefault(),!(r.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)||n.currentMode==="sv")){var a=(0,M.zh)(n),m=(0,s.lG)(a.startContainer,"LI");m&&mn(n,m,a,m.parentElement)}}),r}return t})(Ie),mi=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),gi=(function(e){mi(t,e);function t(n,i){var r=e.call(this,n,i)||this;return n.options.outline&&r.element.firstElementChild.classList.add("vditor-menu--current"),r.element.children[0].addEventListener((0,l.Le)(),function(o){o.preventDefault();var a=n.toolbar.elements.outline.firstElementChild;a.classList.contains(k.g.CLASS_MENU_DISABLED)||(n.options.outline.enable=!r.element.firstElementChild.classList.contains("vditor-menu--current"),n.outline.toggle(n,n.options.outline.enable))}),r}return t})(Ie),bi=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),vi=(function(e){bi(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r._bindEvent(n),r}return t.prototype._bindEvent=function(n){var i=this;this.element.children[0].addEventListener((0,l.Le)(),function(r){r.preventDefault();var o=i.element.firstElementChild;if(!o.classList.contains(k.g.CLASS_MENU_DISABLED)){var a=k.g.EDIT_TOOLBARS.concat(["both","edit-mode","devtools"]);o.classList.contains("vditor-menu--current")?(o.classList.remove("vditor-menu--current"),n.currentMode==="sv"?(n.sv.element.style.display="block",n.options.preview.mode==="both"?n.preview.element.style.display="block":n.preview.element.style.display="none"):(n[n.currentMode].element.parentElement.style.display="block",n.preview.element.style.display="none"),h(n.toolbar.elements,a),n.outline.render(n)):(y(n.toolbar.elements,a),n.preview.element.style.display="block",n.currentMode==="sv"?n.sv.element.style.display="none":n[n.currentMode].element.parentElement.style.display="none",n.preview.render(n),o.classList.add("vditor-menu--current"),f(n,["subToolbar","hint","popover"]),setTimeout(function(){n.outline.render(n)},n.options.preview.delay+10)),Ve(n)}})},t})(Ie),yi=(function(){function e(t){this.SAMPLE_RATE=5e3,this.isRecording=!1,this.readyFlag=!1,this.leftChannel=[],this.rightChannel=[],this.recordingLength=0;var n;if(typeof AudioContext<"u")n=new AudioContext;else if(webkitAudioContext)n=new webkitAudioContext;else return;this.DEFAULT_SAMPLE_RATE=n.sampleRate;var i=n.createGain(),r=n.createMediaStreamSource(t);r.connect(i),this.recorder=n.createScriptProcessor(2048,2,1),this.recorder.onaudioprocess=null,i.connect(this.recorder),this.recorder.connect(n.destination),this.readyFlag=!0}return e.prototype.cloneChannelData=function(t,n){this.leftChannel.push(new Float32Array(t)),this.rightChannel.push(new Float32Array(n)),this.recordingLength+=2048},e.prototype.startRecordingNewWavFile=function(){this.readyFlag&&(this.isRecording=!0,this.leftChannel.length=this.rightChannel.length=0,this.recordingLength=0)},e.prototype.stopRecording=function(){this.isRecording=!1},e.prototype.buildWavFileBlob=function(){for(var t=this.mergeBuffers(this.leftChannel),n=this.mergeBuffers(this.rightChannel),i=new Float32Array(t.length),r=0;r<t.length;++r)i[r]=.5*(t[r]+n[r]);this.DEFAULT_SAMPLE_RATE>this.SAMPLE_RATE&&(i=this.downSampleBuffer(i,this.SAMPLE_RATE));var o=44+i.length*2,a=new ArrayBuffer(o),m=new DataView(a);this.writeUTFBytes(m,0,"RIFF"),m.setUint32(4,o,!0),this.writeUTFBytes(m,8,"WAVE"),this.writeUTFBytes(m,12,"fmt "),m.setUint32(16,16,!0),m.setUint16(20,1,!0),m.setUint16(22,1,!0),m.setUint32(24,this.SAMPLE_RATE,!0),m.setUint32(28,this.SAMPLE_RATE*2,!0),m.setUint16(32,2,!0),m.setUint16(34,16,!0);var v=i.length*2;this.writeUTFBytes(m,36,"data"),m.setUint32(40,v,!0);for(var d=i.length,_=44,L=1,z=0;z<d;z++)m.setInt16(_,i[z]*(32767*L),!0),_+=2;return new Blob([m],{type:"audio/wav"})},e.prototype.downSampleBuffer=function(t,n){if(n===this.DEFAULT_SAMPLE_RATE||n>this.DEFAULT_SAMPLE_RATE)return t;for(var i=this.DEFAULT_SAMPLE_RATE/n,r=Math.round(t.length/i),o=new Float32Array(r),a=0,m=0;a<o.length;){for(var v=Math.round((a+1)*i),d=0,_=0,L=m;L<v&&L<t.length;L++)d+=t[L],_++;o[a]=d/_,a++,m=v}return o},e.prototype.mergeBuffers=function(t){for(var n=new Float32Array(this.recordingLength),i=0,r=t.length,o=0;o<r;++o){var a=t[o];n.set(a,i),i+=a.length}return n},e.prototype.writeUTFBytes=function(t,n,i){for(var r=i.length,o=0;o<r;o++)t.setUint8(n+o,i.charCodeAt(o))},e})(),wi=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),ki=(function(e){wi(t,e);function t(n,i){var r=e.call(this,n,i)||this;return r._bindEvent(n),r}return t.prototype._bindEvent=function(n){var i=this,r;this.element.children[0].addEventListener((0,l.Le)(),function(o){if(o.preventDefault(),!i.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)){var a=n[n.currentMode].element;if(!r){navigator.mediaDevices.getUserMedia({audio:!0}).then(function(v){r=new yi(v),r.recorder.onaudioprocess=function(d){if(r.isRecording){var _=d.inputBuffer.getChannelData(0),L=d.inputBuffer.getChannelData(1);r.cloneChannelData(_,L)}},r.startRecordingNewWavFile(),n.tip.show(window.VditorI18n.recording),n.currentMode==="sv"?n.sv.element.disabled=!0:a.setAttribute("contenteditable","false"),i.element.children[0].classList.add("vditor-menu--current")}).catch(function(){n.tip.show(window.VditorI18n["record-tip"])});return}if(r.isRecording){r.stopRecording(),n.tip.hide();var m=new File([r.buildWavFileBlob()],"record".concat(new Date().getTime(),".wav"),{type:"video/webm"});R(n,[m]),i.element.children[0].classList.remove("vditor-menu--current")}else n.tip.show(window.VditorI18n.recording),n.currentMode==="sv"?n.sv.element.disabled=!0:a.setAttribute("contenteditable","false"),r.startRecordingNewWavFile(),i.element.children[0].classList.add("vditor-menu--current")}})},t})(Ie),Ei=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),_i=(function(e){Ei(t,e);function t(n,i){var r=e.call(this,n,i)||this;return y({redo:r.element},["redo"]),r.element.children[0].addEventListener((0,l.Le)(),function(o){o.preventDefault(),!r.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)&&n.undo.redo(n)}),r}return t})(Ie),xi=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Si=(function(e){xi(t,e);function t(n,i){var r=e.call(this,n,i)||this;return y({undo:r.element},["undo"]),r.element.children[0].addEventListener((0,l.Le)(),function(o){o.preventDefault(),!r.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)&&n.undo.undo(n)}),r}return t})(Ie),Ti=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Ci=(function(e){Ti(t,e);function t(n,i){var r=e.call(this,n,i)||this,o='<input type="file"';return n.options.upload.multiple&&(o+=' multiple="multiple"'),n.options.upload.accept&&(o+=' accept="'.concat(n.options.upload.accept,'"')),r.element.children[0].innerHTML="".concat(i.icon||'<svg><use xlink:href="#vditor-icon-upload"></use></svg>').concat(o,">"),r._bindEvent(n),r}return t.prototype._bindEvent=function(n){var i=this;this.element.children[0].addEventListener((0,l.Le)(),function(r){if(i.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)){r.stopPropagation(),r.preventDefault();return}}),this.element.querySelector("input").addEventListener("change",function(r){if(i.element.firstElementChild.classList.contains(k.g.CLASS_MENU_DISABLED)){r.stopPropagation(),r.preventDefault();return}r.target.files.length!==0&&R(n,r.target.files,r.target)})},t})(Ie),Mi=(function(){function e(t){var n=this,i=t.options;this.elements={},this.element=document.createElement("div"),this.element.className="vditor-toolbar",i.toolbar.forEach(function(r,o){var a=n.genItem(t,r,o);if(n.element.appendChild(a),r.toolbar){var m=document.createElement("div");m.className="vditor-hint vditor-panel--arrow",m.addEventListener((0,l.Le)(),function(v){m.style.display="none"}),r.toolbar.forEach(function(v,d){v.level=2,m.appendChild(n.genItem(t,v,o+d))}),a.appendChild(m),u(t,m,a.children[0],2)}}),t.options.toolbarConfig.hide&&this.element.classList.add("vditor-toolbar--hide"),t.options.toolbarConfig.pin&&this.element.classList.add("vditor-toolbar--pin"),t.options.counter.enable&&(t.counter=new Ur(t),this.element.appendChild(t.counter.element))}return e.prototype.updateConfig=function(t,n){t.options.toolbarConfig=Object.assign({hide:!1,pin:!1},n),t.options.toolbarConfig.hide?this.element.classList.add("vditor-toolbar--hide"):this.element.classList.remove("vditor-toolbar--hide"),t.options.toolbarConfig.pin?this.element.classList.add("vditor-toolbar--pin"):this.element.classList.remove("vditor-toolbar--pin")},e.prototype.genItem=function(t,n,i){var r;switch(n.name){case"bold":case"italic":case"more":case"strike":case"line":case"quote":case"list":case"ordered-list":case"check":case"code":case"inline-code":case"link":case"table":r=new Ie(t,n);break;case"emoji":r=new Gr(t,n);break;case"headings":r=new ni(t,n);break;case"|":r=new qr;break;case"br":r=new Rr;break;case"undo":r=new Si(t,n);break;case"redo":r=new _i(t,n);break;case"help":r=new ii(t,n);break;case"both":r=new Nr(t,n);break;case"preview":r=new vi(t,n);break;case"fullscreen":r=new ei(t,n);break;case"upload":r=new Ci(t,n);break;case"record":r=new ki(t,n);break;case"info":r=new li(t,n);break;case"edit-mode":r=new gr(t,n);break;case"devtools":r=new Vr(t,n);break;case"outdent":r=new hi(t,n);break;case"indent":r=new ai(t,n);break;case"outline":r=new gi(t,n);break;case"insert-after":r=new ui(t,n);break;case"insert-before":r=new fi(t,n);break;case"code-theme":r=new Pr(t,n);break;case"content-theme":r=new Br(t,n);break;case"export":r=new $r(t,n);break;default:r=new Wr(t,n);break}if(r){r.element.querySelectorAll("button").forEach(function(a){a.setAttribute("type","button")});var o=n.name;return(o==="br"||o==="|")&&(o=o+i),this.elements[o]=r.element,r.element}},e})(),Li=F(132),Ai=(function(){function e(){this.stackSize=50,this.resetStack(),this.dmp=new Li}return e.prototype.clearStack=function(t){this.resetStack(),this.resetIcon(t)},e.prototype.resetIcon=function(t){t.toolbar&&(this[t.currentMode].undoStack.length>1?h(t.toolbar.elements,["undo"]):y(t.toolbar.elements,["undo"]),this[t.currentMode].redoStack.length!==0?h(t.toolbar.elements,["redo"]):y(t.toolbar.elements,["redo"]))},e.prototype.undo=function(t){if(!(t.currentMode==="sv"?t.sv.element.disabled:t[t.currentMode].element.getAttribute("contenteditable")==="false")&&!(this[t.currentMode].undoStack.length<2)){var n=this[t.currentMode].undoStack.pop();n&&(this[t.currentMode].redoStack.push(n),this.renderDiff(n,t),this[t.currentMode].hasUndo=!0,f(t,["hint"]))}},e.prototype.redo=function(t){if(!(t.currentMode==="sv"?t.sv.element.disabled:t[t.currentMode].element.getAttribute("contenteditable")==="false")){var n=this[t.currentMode].redoStack.pop();n&&(this[t.currentMode].undoStack.push(n),this.renderDiff(n,t,!0))}},e.prototype.recordFirstPosition=function(t,n){if(!(t.currentMode!=="sv"&&getSelection().rangeCount===0)&&!(this[t.currentMode].undoStack.length!==1||this[t.currentMode].undoStack[0].length===0||this[t.currentMode].redoStack.length>0)&&!((0,l.vU)()&&n.key==="Backspace")&&!(0,l.G6)()){var i=this.addCaret(t);i.replace("<wbr>","").replace(" vditor-ir__node--expand","")===this[t.currentMode].undoStack[0][0].diffs[0][1].replace("<wbr>","")&&(this[t.currentMode].undoStack[0][0].diffs[0][1]=i,this[t.currentMode].lastText=i)}},e.prototype.addToUndoStack=function(t){var n=this.addCaret(t,!0),i=this.dmp.diff_main(n,this[t.currentMode].lastText,!0),r=this.dmp.patch_make(n,this[t.currentMode].lastText,i);r.length===0&&this[t.currentMode].undoStack.length>0||(this[t.currentMode].lastText=n,this[t.currentMode].undoStack.push(r),this[t.currentMode].undoStack.length>this.stackSize&&this[t.currentMode].undoStack.shift(),this[t.currentMode].hasUndo&&(this[t.currentMode].redoStack=[],this[t.currentMode].hasUndo=!1,y(t.toolbar.elements,["redo"])),this[t.currentMode].undoStack.length>1&&h(t.toolbar.elements,["undo"]))},e.prototype.renderDiff=function(t,n,i){i===void 0&&(i=!1);var r;if(i){var o=this.dmp.patch_deepCopy(t).reverse();o.forEach(function(v){v.diffs.forEach(function(d){d[0]=-d[0]})}),r=this.dmp.patch_apply(o,this[n.currentMode].lastText)[0]}else r=this.dmp.patch_apply(t,this[n.currentMode].lastText)[0];if(this[n.currentMode].lastText=r,n.currentMode==="sv"){var a=r.indexOf("<wbr>");n.sv.element.value=r.replace("<wbr>",""),n.sv.element.focus(),a>-1&&n.sv.element.setSelectionRange(a,a)}else if(n[n.currentMode].element.innerHTML=r,n[n.currentMode].element.querySelectorAll(".vditor-".concat(n.currentMode,"__preview")).forEach(function(v){v.parentElement.querySelector(".language-echarts")&&(n.currentMode==="ir"?v.parentElement.outerHTML=n.lute.SpinVditorIRDOM(v.parentElement.outerHTML):v.parentElement.outerHTML=n.lute.SpinVditorDOM(v.parentElement.outerHTML))}),n[n.currentMode].element.querySelectorAll(".vditor-".concat(n.currentMode,"__preview[data-render='2']")).forEach(function(v){je(v,n)}),n[n.currentMode].element.querySelector("wbr"))(0,M.ib)(n[n.currentMode].element,n[n.currentMode].element.ownerDocument.createRange()),Xe(n);else{var m=getSelection().getRangeAt(0);m.setEndBefore(n[n.currentMode].element),m.collapse(!1)}at(n),fe(n,{enableAddUndoStack:!1,enableHint:!1,enableInput:!0}),n.currentMode!=="sv"&&qe(n),n[n.currentMode].element.querySelectorAll(".vditor-".concat(n.currentMode,"__preview[data-render='2']")).forEach(function(v){je(v,n)}),this[n.currentMode].undoStack.length>1?h(n.toolbar.elements,["undo"]):y(n.toolbar.elements,["undo"]),this[n.currentMode].redoStack.length!==0?h(n.toolbar.elements,["redo"]):y(n.toolbar.elements,["redo"])},e.prototype.resetStack=function(){this.ir={hasUndo:!1,lastText:"",redoStack:[],undoStack:[]},this.sv={hasUndo:!1,lastText:"",redoStack:[],undoStack:[]},this.wysiwyg={hasUndo:!1,lastText:"",redoStack:[],undoStack:[]}},e.prototype.addCaret=function(t,n){if(n===void 0&&(n=!1),t.currentMode==="sv"){var i=t.sv.element;return i.value.substring(0,i.selectionStart)+"<wbr>"+i.value.substring(i.selectionStart)}var r;if(getSelection().rangeCount!==0&&!t[t.currentMode].element.querySelector("wbr")){var o=getSelection().getRangeAt(0);if(t[t.currentMode].element.contains(o.startContainer)){r=o.cloneRange();var a=document.createElement("span");a.className="vditor-wbr",o.insertNode(a)}}var m=t[t.currentMode].element.cloneNode(!0);m.querySelectorAll(".vditor-".concat(t.currentMode,"__preview[data-render='1']")).forEach(function(d){d.firstElementChild&&(d.firstElementChild.classList.contains("language-echarts")||d.firstElementChild.classList.contains("language-plantuml")||d.firstElementChild.classList.contains("language-mindmap")?(d.firstElementChild.removeAttribute("_echarts_instance_"),d.firstElementChild.removeAttribute("data-processed"),d.firstElementChild.innerHTML=d.previousElementSibling.firstElementChild.innerHTML,d.setAttribute("data-render","2")):d.firstElementChild.classList.contains("language-math")&&(d.setAttribute("data-render","2"),d.firstElementChild.textContent=d.firstElementChild.getAttribute("data-math"),d.firstElementChild.removeAttribute("data-math")))});var v=m.innerHTML;return t[t.currentMode].element.querySelectorAll(".vditor-wbr").forEach(function(d){d.remove()}),n&&r&&(0,M.Hc)(r),v.replace('<span class="vditor-wbr"></span>',"<wbr>")},e})(),Oi=F(673),Di=(function(){function e(t){this.defaultOptions={rtl:!1,after:void 0,cache:{enable:!0},cdn:k.g.CDN,classes:{preview:""},comment:{enable:!1},counter:{enable:!1,type:"markdown"},customRenders:[],debugger:!1,fullscreen:{index:90},height:"auto",hint:{delay:200,emoji:{"+1":"\u{1F44D}","-1":"\u{1F44E}",confused:"\u{1F615}",eyes:"\u{1F440}\uFE0F",heart:"\u2764\uFE0F",rocket:"\u{1F680}\uFE0F",smile:"\u{1F604}",tada:"\u{1F389}\uFE0F"},emojiPath:"".concat(k.g.CDN,"/dist/images/emoji"),extend:[],parse:!0},icon:"ant",lang:"zh_CN",mode:"ir",outline:{enable:!1,position:"left"},placeholder:"",preview:{actions:["desktop","tablet","mobile","mp-wechat","zhihu"],delay:1e3,hljs:k.g.HLJS_OPTIONS,markdown:k.g.MARKDOWN_OPTIONS,math:k.g.MATH_OPTIONS,maxWidth:800,mode:"both",theme:k.g.THEME_OPTIONS,render:{media:{enable:!0}}},link:{isOpen:!0},image:{isPreview:!0},resize:{enable:!1,position:"bottom"},theme:"classic",toolbar:["emoji","headings","bold","italic","strike","link","|","list","ordered-list","check","outdent","indent","|","quote","line","code","inline-code","insert-before","insert-after","|","upload","record","table","|","undo","redo","|","fullscreen","edit-mode",{name:"more",toolbar:["both","code-theme","content-theme","export","outline","preview","devtools","info","help"]}],toolbarConfig:{hide:!1,pin:!1},typewriterMode:!1,undoDelay:800,upload:{extraData:{},fieldName:"file[]",filename:function(n){return n.replace(/\W/g,"")},linkToImgUrl:"",max:10*1024*1024,multiple:!0,url:"",withCredentials:!1},value:"",width:"auto"},this.options=t}return e.prototype.merge=function(){var t,n,i,r,o,a,m,v,d;this.options&&(this.options.toolbar?this.options.toolbar=this.mergeToolbar(this.options.toolbar):this.options.toolbar=this.mergeToolbar(this.defaultOptions.toolbar),!((n=(t=this.options.preview)===null||t===void 0?void 0:t.theme)===null||n===void 0)&&n.list&&(this.defaultOptions.preview.theme.list=this.options.preview.theme.list),!((o=(r=(i=this.options.preview)===null||i===void 0?void 0:i.render)===null||r===void 0?void 0:r.media)===null||o===void 0)&&o.enable&&(this.defaultOptions.preview.render.media.enable=this.options.preview.render.media.enable),!((a=this.options.hint)===null||a===void 0)&&a.emoji&&(this.defaultOptions.hint.emoji=this.options.hint.emoji),this.options.comment&&(this.defaultOptions.comment=this.options.comment),this.options.cdn&&(!((v=(m=this.options.preview)===null||m===void 0?void 0:m.theme)===null||v===void 0)&&v.path||(this.defaultOptions.preview.theme.path="".concat(this.options.cdn,"/dist/css/content-theme")),!((d=this.options.hint)===null||d===void 0)&&d.emojiPath||(this.defaultOptions.hint.emojiPath="".concat(this.options.cdn,"/dist/images/emoji"))));var _=(0,Oi.T)(this.defaultOptions,this.options);if(_.cache.enable&&!_.cache.id)throw new Error("need options.cache.id, see https://ld246.com/article/1549638745630#options");return _},e.prototype.mergeToolbar=function(t){var n=this,i=[{icon:'<svg><use xlink:href="#vditor-icon-export"></use></svg>',name:"export",tipPosition:"ne"},{hotkey:"\u2318E",icon:'<svg><use xlink:href="#vditor-icon-emoji"></use></svg>',name:"emoji",tipPosition:"ne"},{hotkey:"\u2318H",icon:'<svg><use xlink:href="#vditor-icon-headings"></use></svg>',name:"headings",tipPosition:"ne"},{hotkey:"\u2318B",icon:'<svg><use xlink:href="#vditor-icon-bold"></use></svg>',name:"bold",prefix:"**",suffix:"**",tipPosition:"ne"},{hotkey:"\u2318I",icon:'<svg><use xlink:href="#vditor-icon-italic"></use></svg>',name:"italic",prefix:"*",suffix:"*",tipPosition:"ne"},{hotkey:"\u2318D",icon:'<svg><use xlink:href="#vditor-icon-strike"></use></svg>',name:"strike",prefix:"~~",suffix:"~~",tipPosition:"ne"},{hotkey:"\u2318K",icon:'<svg><use xlink:href="#vditor-icon-link"></use></svg>',name:"link",prefix:"[",suffix:"](https://)",tipPosition:"n"},{name:"|"},{hotkey:"\u2318L",icon:'<svg><use xlink:href="#vditor-icon-list"></use></svg>',name:"list",prefix:"* ",tipPosition:"n"},{hotkey:"\u2318O",icon:'<svg><use xlink:href="#vditor-icon-ordered-list"></use></svg>',name:"ordered-list",prefix:"1. ",tipPosition:"n"},{hotkey:"\u2318J",icon:'<svg><use xlink:href="#vditor-icon-check"></use></svg>',name:"check",prefix:"* [ ] ",tipPosition:"n"},{hotkey:"\u21E7\u2318I",icon:'<svg><use xlink:href="#vditor-icon-outdent"></use></svg>',name:"outdent",tipPosition:"n"},{hotkey:"\u21E7\u2318O",icon:'<svg><use xlink:href="#vditor-icon-indent"></use></svg>',name:"indent",tipPosition:"n"},{name:"|"},{hotkey:"\u2318;",icon:'<svg><use xlink:href="#vditor-icon-quote"></use></svg>',name:"quote",prefix:"> ",tipPosition:"n"},{hotkey:"\u21E7\u2318H",icon:'<svg><use xlink:href="#vditor-icon-line"></use></svg>',name:"line",prefix:"***",tipPosition:"n"},{hotkey:"\u2318U",icon:'<svg><use xlink:href="#vditor-icon-code"></use></svg>',name:"code",prefix:"```",suffix:"\n```",tipPosition:"n"},{hotkey:"\u2318G",icon:'<svg><use xlink:href="#vditor-icon-inline-code"></use></svg>',name:"inline-code",prefix:"`",suffix:"`",tipPosition:"n"},{hotkey:"\u21E7\u2318B",icon:'<svg><use xlink:href="#vditor-icon-before"></use></svg>',name:"insert-before",tipPosition:"n"},{hotkey:"\u21E7\u2318E",icon:'<svg><use xlink:href="#vditor-icon-after"></use></svg>',name:"insert-after",tipPosition:"n"},{name:"|"},{icon:'<svg><use xlink:href="#vditor-icon-upload"></use></svg>',name:"upload",tipPosition:"n"},{icon:'<svg><use xlink:href="#vditor-icon-record"></use></svg>',name:"record",tipPosition:"n"},{hotkey:"\u2318M",icon:'<svg><use xlink:href="#vditor-icon-table"></use></svg>',name:"table",prefix:"| col1",suffix:` | col2 | col3 |
| --- | --- | --- |
|  |  |  |
|  |  |  |`,tipPosition:"n"},{name:"|"},{hotkey:"\u2318Z",icon:'<svg><use xlink:href="#vditor-icon-undo"></use></svg>',name:"undo",tipPosition:"nw"},{hotkey:"\u2318Y",icon:'<svg><use xlink:href="#vditor-icon-redo"></use></svg>',name:"redo",tipPosition:"nw"},{name:"|"},{icon:'<svg><use xlink:href="#vditor-icon-more"></use></svg>',name:"more",tipPosition:"e"},{hotkey:"\u2318'",icon:'<svg><use xlink:href="#vditor-icon-fullscreen"></use></svg>',name:"fullscreen",tipPosition:"nw"},{icon:'<svg><use xlink:href="#vditor-icon-edit"></use></svg>',name:"edit-mode",tipPosition:"nw"},{hotkey:"\u2318P",icon:'<svg><use xlink:href="#vditor-icon-both"></use></svg>',name:"both",tipPosition:"nw"},{icon:'<svg><use xlink:href="#vditor-icon-preview"></use></svg>',name:"preview",tipPosition:"nw"},{icon:'<svg><use xlink:href="#vditor-icon-align-center"></use></svg>',name:"outline",tipPosition:"nw"},{icon:'<svg><use xlink:href="#vditor-icon-theme"></use></svg>',name:"content-theme",tipPosition:"nw"},{icon:'<svg><use xlink:href="#vditor-icon-code-theme"></use></svg>',name:"code-theme",tipPosition:"nw"},{icon:'<svg><use xlink:href="#vditor-icon-bug"></use></svg>',name:"devtools",tipPosition:"nw"},{icon:'<svg><use xlink:href="#vditor-icon-info"></use></svg>',name:"info",tipPosition:"nw"},{icon:'<svg><use xlink:href="#vditor-icon-help"></use></svg>',name:"help",tipPosition:"nw"},{name:"br"}],r=[];return t.forEach(function(o){var a=o;i.forEach(function(m){typeof o=="string"&&m.name===o&&(a=m),typeof o=="object"&&m.name===o.name&&(a=Object.assign({},m,o))}),o.toolbar&&(a.toolbar=n.mergeToolbar(o.toolbar)),r.push(a)}),r},e})(),Hi=(function(){function e(t){var n=this;this.composingLock=!1,this.commentIds=[];var i=document.createElement("div");i.className="vditor-wysiwyg",i.innerHTML='<pre class="vditor-reset" placeholder="'.concat(t.options.placeholder,`"
 contenteditable="true" spellcheck="false"></pre>
<div class="vditor-panel vditor-panel--none"></div>
<div class="vditor-panel vditor-panel--none">
    <button type="button" aria-label="`).concat(window.VditorI18n.comment,`" class="vditor-icon vditor-tooltipped vditor-tooltipped__n">
        <svg><use xlink:href="#vditor-icon-comment"></use></svg>
    </button>
</div>`),this.element=i.firstElementChild,this.popover=i.firstElementChild.nextElementSibling,this.selectPopover=i.lastElementChild,this.bindEvent(t),fn(t,this.element),xn(t,this.element),Sn(t,this.element),hn(t,this.element),Mn(t,this.element),pn(t,this.element),Tn(t,this.element,this.copy),Cn(t,this.element,this.copy),t.options.comment.enable&&(this.selectPopover.querySelector("button").onclick=function(){var r=Lute.NewNodeID(),o=getSelection().getRangeAt(0),a=o.cloneRange(),m=o.extractContents(),v,d,_=!1,L=!1;m.childNodes.forEach(function(j,K){var Z=!1;if(j.nodeType===3?Z=!0:j.classList.contains("vditor-comment")?j.classList.contains("vditor-comment")&&j.setAttribute("data-cmtids",j.getAttribute("data-cmtids")+" "+r):Z=!0,Z)if(j.nodeType!==3&&j.getAttribute("data-block")==="0"&&K===0&&a.startOffset>0)j.innerHTML='<span class="vditor-comment" data-cmtids="'.concat(r,'">').concat(j.innerHTML,"</span>"),v=j;else if(j.nodeType!==3&&j.getAttribute("data-block")==="0"&&K===m.childNodes.length-1&&a.endOffset<a.endContainer.textContent.length)j.innerHTML='<span class="vditor-comment" data-cmtids="'.concat(r,'">').concat(j.innerHTML,"</span>"),d=j;else if(j.nodeType!==3&&j.getAttribute("data-block")==="0")K===0?_=!0:K===m.childNodes.length-1&&(L=!0),j.innerHTML='<span class="vditor-comment" data-cmtids="'.concat(r,'">').concat(j.innerHTML,"</span>");else{var te=document.createElement("span");te.classList.add("vditor-comment"),te.setAttribute("data-cmtids",r),j.parentNode.insertBefore(te,j),te.appendChild(j)}});var z=(0,s.F9)(a.startContainer);z&&(v?(z.insertAdjacentHTML("beforeend",v.innerHTML),v.remove()):z.textContent.trim().replace(k.g.ZWSP,"")===""&&_&&z.remove());var W=(0,s.F9)(a.endContainer);W&&(d?(W.insertAdjacentHTML("afterbegin",d.innerHTML),d.remove()):W.textContent.trim().replace(k.g.ZWSP,"")===""&&L&&W.remove()),o.insertNode(m),t.options.comment.add(r,o.toString(),n.getComments(t,!0)),I(t,{enableAddUndoStack:!0,enableHint:!1,enableInput:!1}),n.hideComment()})}return e.prototype.getComments=function(t,n){var i=this;if(n===void 0&&(n=!1),t.currentMode==="wysiwyg"&&t.options.comment.enable){this.commentIds=[],this.element.querySelectorAll(".vditor-comment").forEach(function(o){i.commentIds=i.commentIds.concat(o.getAttribute("data-cmtids").split(" "))}),this.commentIds=Array.from(new Set(this.commentIds));var r=[];if(n)return this.commentIds.forEach(function(o){r.push({id:o,top:i.element.querySelector('.vditor-comment[data-cmtids="'.concat(o,'"]')).offsetTop})}),r}else return[]},e.prototype.triggerRemoveComment=function(t){var n=function(o,a){var m=new Set(a);return o.filter(function(v){return!m.has(v)})};if(t.currentMode==="wysiwyg"&&t.options.comment.enable&&t.wysiwyg.commentIds.length>0){var i=JSON.parse(JSON.stringify(this.commentIds));this.getComments(t);var r=n(i,this.commentIds);r.length>0&&t.options.comment.remove(r)}},e.prototype.showComment=function(){var t=(0,M.Ny)(this.element);this.selectPopover.setAttribute("style","left:".concat(t.left,"px;display:block;top:").concat(Math.max(-8,t.top-21),"px"))},e.prototype.hideComment=function(){this.selectPopover.setAttribute("style","display:none")},e.prototype.unbindListener=function(){window.removeEventListener("scroll",this.scrollListener)},e.prototype.copy=function(t,n){var i=getSelection().getRangeAt(0);if(i.toString()!==""){t.stopPropagation(),t.preventDefault();var r=(0,s.lG)(i.startContainer,"CODE"),o=(0,s.lG)(i.endContainer,"CODE");if(r&&o&&o.isSameNode(r)){var a="";r.parentElement.tagName==="PRE"?a=i.toString():a="`"+i.toString()+"`",t.clipboardData.setData("text/plain",a),t.clipboardData.setData("text/html","");return}var m=(0,s.lG)(i.startContainer,"A"),v=(0,s.lG)(i.endContainer,"A");if(m&&v&&v.isSameNode(m)){var d=m.getAttribute("title")||"";d&&(d=' "'.concat(d,'"')),t.clipboardData.setData("text/plain","[".concat(i.toString(),"](").concat(m.getAttribute("href")).concat(d,")")),t.clipboardData.setData("text/html","");return}var _=document.createElement("div");_.appendChild(i.cloneContents()),t.clipboardData.setData("text/plain",n.lute.VditorDOM2Md(_.innerHTML).trim()),t.clipboardData.setData("text/html","")}},e.prototype.bindEvent=function(t){var n=this;this.unbindListener(),window.addEventListener("scroll",this.scrollListener=function(){if(f(t,["hint"]),!(n.popover.style.display!=="block"||n.selectPopover.style.display!=="block")){var i=parseInt(n.popover.getAttribute("data-top"),10);if(t.options.height!=="auto"){if(t.options.toolbarConfig.pin&&t.toolbar.element.getBoundingClientRect().top===0){var r=Math.max(window.scrollY-t.element.offsetTop-8,Math.min(i-t.wysiwyg.element.scrollTop,n.element.clientHeight-21))+"px";n.popover.style.display==="block"&&(n.popover.style.top=r),n.selectPopover.style.display==="block"&&(n.selectPopover.style.top=r)}return}else if(!t.options.toolbarConfig.pin)return;var o=Math.max(i,window.scrollY-t.element.offsetTop-8)+"px";n.popover.style.display==="block"&&(n.popover.style.top=o),n.selectPopover.style.display==="block"&&(n.selectPopover.style.top=o)}}),this.element.addEventListener("scroll",function(){if(f(t,["hint"]),t.options.comment&&t.options.comment.enable&&t.options.comment.scroll&&t.options.comment.scroll(t.wysiwyg.element.scrollTop),n.popover.style.display==="block"){var i=parseInt(n.popover.getAttribute("data-top"),10)-t.wysiwyg.element.scrollTop,r=-8;t.options.toolbarConfig.pin&&t.toolbar.element.getBoundingClientRect().top===0&&(r=window.scrollY-t.element.offsetTop+r);var o=Math.max(r,Math.min(i,n.element.clientHeight-21))+"px";n.popover.style.top=o,n.selectPopover.style.top=o}}),this.element.addEventListener("paste",function(i){sn(t,i,{pasteCode:function(r){var o=(0,M.zh)(t),a=document.createElement("template");a.innerHTML=r,o.insertNode(a.content.cloneNode(!0));var m=(0,s.a1)(o.startContainer,"data-block","0");m?m.outerHTML=t.lute.SpinVditorDOM(m.outerHTML):t.wysiwyg.element.innerHTML=t.lute.SpinVditorDOM(t.wysiwyg.element.innerHTML),(0,M.ib)(t.wysiwyg.element,o)}})}),this.element.addEventListener("compositionstart",function(){n.composingLock=!0}),this.element.addEventListener("compositionend",function(i){var r=(0,S.W)(getSelection().getRangeAt(0).startContainer);if(r&&r.textContent===""){at(t);return}(0,l.vU)()||Ne(t,getSelection().getRangeAt(0).cloneRange(),i),n.composingLock=!1}),this.element.addEventListener("input",function(i){if(!(i.inputType==="deleteByDrag"||i.inputType==="insertFromDrop")){if(n.preventInput){n.preventInput=!1,I(t);return}if(n.composingLock||i.data==="\u2018"||i.data==="\u201C"||i.data==="\u300A"){I(t);return}var r=getSelection().getRangeAt(0),o=(0,s.F9)(r.startContainer);if(o||(xe(t,r),o=(0,s.F9)(r.startContainer)),!!o){for(var a=(0,M.im)(o,t.wysiwyg.element,r).start,m=!0,v=a-1;v>o.textContent.substr(0,a).lastIndexOf(`
`);v--)if(o.textContent.charAt(v)!==" "&&o.textContent.charAt(v)!=="	"){m=!1;break}a===0&&(m=!1);for(var d=!0,v=a-1;v<o.textContent.length;v++)if(o.textContent.charAt(v)!==" "&&o.textContent.charAt(v)!==`
`){d=!1;break}d&&/^#{1,6} $/.test(o.textContent)&&(d=!1);var _=(0,S.W)(getSelection().getRangeAt(0).startContainer);if(_&&_.textContent===""&&(at(t),_.remove()),m&&o.getAttribute("data-type")!=="code-block"||d||bn(o.innerHTML)||gn(o.innerHTML)&&o.previousElementSibling){typeof t.options.input=="function"&&t.options.input(N(t));return}i.inputType==="insertParagraph"&&n.element.innerHTML==="<p><br></p><p><br></p>"&&o.previousElementSibling.remove(),Ne(t,r,i)}}}),this.element.addEventListener("click",function(i){if(i.target.tagName==="INPUT"){var r=i.target;r.checked?r.setAttribute("checked","checked"):r.removeAttribute("checked"),n.preventInput=!0,getSelection().rangeCount>0&&(0,M.Hc)(getSelection().getRangeAt(0)),I(t);return}if(i.target.tagName==="IMG"&&!i.target.parentElement.classList.contains("vditor-wysiwyg__preview")){i.target.getAttribute("data-type")==="link-ref"?Gt(t,i.target):ze(i,t);return}var o=(0,s.lG)(i.target,"A");if(o){t.options.link.click?t.options.link.click(o):t.options.link.isOpen&&window.open(o.getAttribute("href")),i.preventDefault();return}var a=(0,M.zh)(t);if(i.target.isEqualNode(n.element)&&n.element.lastElementChild&&a.collapsed){var m=n.element.lastElementChild.getBoundingClientRect();i.y>m.top+m.height&&(n.element.lastElementChild.tagName==="P"&&n.element.lastElementChild.textContent.trim().replace(k.g.ZWSP,"")===""?(a.selectNodeContents(n.element.lastElementChild),a.collapse(!1)):(n.element.insertAdjacentHTML("beforeend",'<p data-block="0">'.concat(k.g.ZWSP,"<wbr></p>")),(0,M.ib)(n.element,a)))}ht(t);var v=(0,s.fb)(i.target,"vditor-wysiwyg__preview");v||(v=(0,s.fb)((0,M.zh)(t).startContainer,"vditor-wysiwyg__preview")),v&&Mt(v,t),Ot(i,t)}),this.element.addEventListener("keyup",function(i){if(!(i.isComposing||(0,l.yl)(i))){i.key==="Enter"&&Xe(t),(i.key==="Backspace"||i.key==="Delete")&&t.wysiwyg.element.innerHTML!==""&&t.wysiwyg.element.childNodes.length===1&&t.wysiwyg.element.firstElementChild&&t.wysiwyg.element.firstElementChild.tagName==="P"&&t.wysiwyg.element.firstElementChild.childElementCount===0&&(t.wysiwyg.element.textContent===""||t.wysiwyg.element.textContent===`
`)&&(t.wysiwyg.element.innerHTML="");var r=(0,M.zh)(t);if(i.key==="Backspace"&&(0,l.vU)()&&r.startContainer.textContent===`
`&&r.startOffset===1&&(r.startContainer.textContent=""),xe(t,r),ht(t),!(i.key!=="ArrowDown"&&i.key!=="ArrowRight"&&i.key!=="Backspace"&&i.key!=="ArrowLeft"&&i.key!=="ArrowUp")){(i.key==="ArrowLeft"||i.key==="ArrowRight")&&t.hint.render(t);var o=(0,s.fb)(r.startContainer,"vditor-wysiwyg__preview");if(!o&&r.startContainer.nodeType!==3&&r.startOffset>0){var a=r.startContainer;a.classList.contains("vditor-wysiwyg__block")&&(o=a.lastElementChild)}if(o){var m=o.previousElementSibling;if(m.style.display==="none"){i.key==="ArrowDown"||i.key==="ArrowRight"?Mt(o,t):Mt(o,t,!1);return}var v=o.previousElementSibling;if(v.tagName==="PRE"&&(v=v.firstElementChild),i.key==="ArrowDown"||i.key==="ArrowRight"){var a=o.parentElement,d=le(a);if(d&&d.nodeType!==3){var _=d.querySelector(".vditor-wysiwyg__preview");if(_){Mt(_,t);return}}if(d.nodeType===3){for(;d.textContent.length===0&&d.nextSibling;)d=d.nextSibling;r.setStart(d,1)}else r.setStart(d.firstChild,0)}else r.selectNodeContents(v),r.collapse(!1)}}}})},e})(),Ni=(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function i(){this.constructor=t}t.prototype=n===null?Object.create(n):(i.prototype=n.prototype,new i)}})(),Ri=(function(e){Ni(t,e);function t(n,i){var r=e.call(this)||this;if(r.isDestroyed=!1,r.version=k.H,typeof n=="string"){if(i?i.cache?i.cache.id||(i.cache.id="vditor".concat(n)):i.cache={id:"vditor".concat(n)}:i={cache:{id:"vditor".concat(n)}},!document.getElementById(n))return r.showErrorTip("Failed to get element by id: ".concat(n)),r;n=document.getElementById(n)}var o=new Di(i),a=o.merge();if(a.i18n)window.VditorI18n=a.i18n,r.init(n,a);else if(["de_DE","en_US","es_ES","fr_FR","ja_JP","ko_KR","pt_BR","ru_RU","sv_SE","vi_VN","zh_CN","zh_TW"].includes(a.lang)){var m="vditorI18nScript",v=m+a.lang;document.querySelectorAll('head script[id^="'.concat(m,'"]')).forEach(function(d){d.id!==v&&document.head.removeChild(d)}),(0,A.G)("".concat(a.cdn,"/dist/js/i18n/").concat(a.lang,".js"),v).then(function(){r.init(n,a)}).catch(function(d){r.showErrorTip("GET ".concat(a.cdn,"/dist/js/i18n/").concat(a.lang,".js net::ERR_ABORTED 404 (Not Found)"))})}else throw new Error("options.lang error, see https://ld246.com/article/1549638745630#options");return r}return t.prototype.showErrorTip=function(n){var i=new rr;document.body.appendChild(i.element),i.show(n,0)},t.prototype.updateToolbarConfig=function(n){this.vditor.toolbar.updateConfig(this.vditor,n)},t.prototype.setTheme=function(n,i,r,o){this.vditor.options.theme=n,Re(this.vditor),i&&(this.vditor.options.preview.theme.current=i,(0,Be.Z)(i,o||this.vditor.options.preview.theme.path)),r&&(this.vditor.options.preview.hljs.style=r,(0,ir.Y)(r,this.vditor.options.cdn))},t.prototype.getValue=function(){return N(this.vditor)},t.prototype.getCurrentMode=function(){return this.vditor.currentMode},t.prototype.focus=function(){this.vditor.currentMode==="sv"?this.vditor.sv.element.focus():this.vditor.currentMode==="wysiwyg"?this.vditor.wysiwyg.element.focus():this.vditor.currentMode==="ir"&&this.vditor.ir.element.focus()},t.prototype.blur=function(){this.vditor.currentMode==="sv"?this.vditor.sv.element.blur():this.vditor.currentMode==="wysiwyg"?this.vditor.wysiwyg.element.blur():this.vditor.currentMode==="ir"&&this.vditor.ir.element.blur()},t.prototype.disabled=function(){f(this.vditor,["subToolbar","hint","popover"]),y(this.vditor.toolbar.elements,k.g.EDIT_TOOLBARS.concat(["undo","redo","fullscreen","edit-mode"])),this.vditor.currentMode==="sv"?this.vditor.sv.element.disabled=!0:this.vditor[this.vditor.currentMode].element.setAttribute("contenteditable","false")},t.prototype.enable=function(){h(this.vditor.toolbar.elements,k.g.EDIT_TOOLBARS.concat(["undo","redo","fullscreen","edit-mode"])),this.vditor.undo.resetIcon(this.vditor),this.vditor.currentMode==="sv"?this.vditor.sv.element.disabled=!1:this.vditor[this.vditor.currentMode].element.setAttribute("contenteditable","true")},t.prototype.getSelection=function(){if(this.vditor.currentMode==="wysiwyg")return dn(this.vditor.wysiwyg.element);if(this.vditor.currentMode==="sv")return this.vditor.sv.element.value.substring(this.vditor.sv.element.selectionStart,this.vditor.sv.element.selectionEnd);if(this.vditor.currentMode==="ir")return dn(this.vditor.ir.element)},t.prototype.renderPreview=function(n){this.vditor.preview.render(this.vditor,n)},t.prototype.getCursorPosition=function(){if(this.vditor.currentMode==="sv"){var n=this.vditor.sv.element,i=parseInt(getComputedStyle(n).lineHeight,10)||22,r=n.value.substring(0,n.selectionStart).split(`
`).length-1;return{left:0,top:r*i-n.scrollTop}}return(0,M.Ny)(this.vditor[this.vditor.currentMode].element)},t.prototype.isUploading=function(){return this.vditor.upload.isUploading},t.prototype.clearCache=function(){this.vditor.options.cache.enable&&(0,l.pK)()&&localStorage.removeItem(this.vditor.options.cache.id)},t.prototype.disabledCache=function(){this.vditor.options.cache.enable=!1},t.prototype.enableCache=function(){if(!this.vditor.options.cache.id)throw new Error("need options.cache.id, see https://ld246.com/article/1549638745630#options");this.vditor.options.cache.enable=!0},t.prototype.html2md=function(n){return this.vditor.lute.HTML2Md(n)},t.prototype.exportJSON=function(n){return this.vditor.lute.RenderJSON(n)},t.prototype.getHTML=function(){return tr(this.vditor)},t.prototype.tip=function(n,i){this.vditor.tip.show(n,i)},t.prototype.setPreviewMode=function(n){yn(n,this.vditor)},t.prototype.deleteValue=function(){if(this.vditor.currentMode==="sv"){if(this.vditor.sv.element.selectionStart===this.vditor.sv.element.selectionEnd)return;de(this.vditor,""),B(this.vditor);return}window.getSelection().isCollapsed||document.execCommand("delete",!1)},t.prototype.updateValue=function(n){if(this.vditor.currentMode==="sv"){de(this.vditor,n),B(this.vditor);return}document.execCommand("insertHTML",!1,n)},t.prototype.insertValue=function(n,i){if(i===void 0&&(i=!0),this.vditor.currentMode==="sv"){de(this.vditor,n),i&&B(this.vditor);return}var r=(0,M.zh)(this.vditor);r.collapse(!0);var o=document.createElement("template");o.innerHTML=n,r.insertNode(o.content.cloneNode(!0)),r.collapse(!1),this.vditor.currentMode==="wysiwyg"?i&&Ne(this.vditor,getSelection().getRangeAt(0)):this.vditor.currentMode==="ir"&&(this.vditor.ir.preventInput=!0,i&&bt(this.vditor,getSelection().getRangeAt(0),!0))},t.prototype.insertMD=function(n){this.vditor.currentMode==="ir"?(0,M.oC)(this.vditor.lute.Md2VditorIRDOM(n),this.vditor):this.vditor.currentMode==="wysiwyg"?(0,M.oC)(this.vditor.lute.Md2VditorDOM(n),this.vditor):de(this.vditor,n),this.vditor.outline.render(this.vditor),fe(this.vditor)},t.prototype.setValue=function(n,i){var r=this;i===void 0&&(i=!1),this.vditor.currentMode==="sv"?(this.vditor.sv.element.value=n,B(this.vditor,{enableAddUndoStack:!0,enableHint:!1,enableInput:!1})):this.vditor.currentMode==="wysiwyg"?ct(this.vditor,n,{enableAddUndoStack:!0,enableHint:!1,enableInput:!1}):(this.vditor.ir.element.innerHTML=this.vditor.lute.Md2VditorIRDOM(n),this.vditor.ir.element.querySelectorAll(".vditor-ir__preview[data-render='2']").forEach(function(o){je(o,r.vditor)}),_t(this.vditor,{enableAddUndoStack:!0,enableHint:!1,enableInput:!1})),this.vditor.outline.render(this.vditor),n||(f(this.vditor,["emoji","headings","submenu","hint"]),this.vditor.wysiwyg.popover&&(this.vditor.wysiwyg.popover.style.display="none"),this.clearCache()),i&&this.clearStack()},t.prototype.insertEmptyBlock=function(n){Yt(this.vditor,n)},t.prototype.clearStack=function(){this.vditor.undo.clearStack(this.vditor),this.vditor.undo.addToUndoStack(this.vditor)},t.prototype.destroy=function(){this.vditor.element.innerHTML=this.vditor.originalInnerHTML,this.vditor.element.classList.remove("vditor"),this.vditor.element.removeAttribute("style");var n=document.getElementById("vditorIconScript");n&&n.remove(),this.clearCache(),Ht(),this.vditor.wysiwyg.unbindListener(),this.vditor.options.after=void 0,this.isDestroyed=!0},t.prototype.getCommentIds=function(){return this.vditor.currentMode!=="wysiwyg"?[]:this.vditor.wysiwyg.getComments(this.vditor,!0)},t.prototype.hlCommentIds=function(n){if(this.vditor.currentMode==="wysiwyg"){var i=function(r){r.classList.remove("vditor-comment--hover"),n.forEach(function(o){r.getAttribute("data-cmtids").indexOf(o)>-1&&r.classList.add("vditor-comment--hover")})};this.vditor.wysiwyg.element.querySelectorAll(".vditor-comment").forEach(function(r){i(r)}),this.vditor.preview.element.style.display!=="none"&&this.vditor.preview.element.querySelectorAll(".vditor-comment").forEach(function(r){i(r)})}},t.prototype.unHlCommentIds=function(n){if(this.vditor.currentMode==="wysiwyg"){var i=function(r){n.forEach(function(o){r.getAttribute("data-cmtids").indexOf(o)>-1&&r.classList.remove("vditor-comment--hover")})};this.vditor.wysiwyg.element.querySelectorAll(".vditor-comment").forEach(function(r){i(r)}),this.vditor.preview.element.style.display!=="none"&&this.vditor.preview.element.querySelectorAll(".vditor-comment").forEach(function(r){i(r)})}},t.prototype.removeCommentIds=function(n){var i=this;if(this.vditor.currentMode==="wysiwyg"){var r=function(o,a){var m=o.getAttribute("data-cmtids").split(" ");m.find(function(v,d){if(v===a)return m.splice(d,1),!0}),m.length===0?(o.outerHTML=o.innerHTML,(0,M.zh)(i.vditor).collapse(!0)):o.setAttribute("data-cmtids",m.join(" "))};n.forEach(function(o){i.vditor.wysiwyg.element.querySelectorAll(".vditor-comment").forEach(function(a){r(a,o)}),i.vditor.preview.element.style.display!=="none"&&i.vditor.preview.element.querySelectorAll(".vditor-comment").forEach(function(a){r(a,o)})}),I(this.vditor,{enableAddUndoStack:!0,enableHint:!1,enableInput:!1})}},t.prototype.init=function(n,i){var r=this;this.isDestroyed||(this.vditor={currentMode:i.mode,element:n,hint:new Sr(i.hint.extend),lute:void 0,options:i,originalInnerHTML:n.innerHTML,outline:new Mr(window.VditorI18n.outline),tip:new rr},this.vditor.sv=new Dr(this.vditor),this.vditor.undo=new Ai,this.vditor.wysiwyg=new Hi(this.vditor),this.vditor.ir=new Tr(this.vditor),this.vditor.toolbar=new Mi(this.vditor),i.resize.enable&&(this.vditor.resize=new Or(this.vditor)),this.vditor.toolbar.elements.devtools&&(this.vditor.devtools=new c),(i.upload.url||i.upload.handler)&&(this.vditor.upload=new oe),(0,A.G)(i._lutePath||"".concat(i.cdn,"/dist/js/lute/lute.min.js"),"vditorLuteScript").then(function(){r.vditor.lute=(0,Cr.X)({autoSpace:r.vditor.options.preview.markdown.autoSpace,callout:r.vditor.options.preview.markdown.callout,inlineMath:r.vditor.options.preview.markdown.inlineMath,gfmAutoLink:r.vditor.options.preview.markdown.gfmAutoLink,codeBlockPreview:r.vditor.options.preview.markdown.codeBlockPreview,emojiSite:r.vditor.options.hint.emojiPath,emojis:r.vditor.options.hint.emoji,fixTermTypo:r.vditor.options.preview.markdown.fixTermTypo,footnotes:r.vditor.options.preview.markdown.footnotes,headingAnchor:!1,inlineMathDigit:r.vditor.options.preview.math.inlineDigit,linkBase:r.vditor.options.preview.markdown.linkBase,linkPrefix:r.vditor.options.preview.markdown.linkPrefix,listStyle:r.vditor.options.preview.markdown.listStyle,mark:r.vditor.options.preview.markdown.mark,mathBlockPreview:r.vditor.options.preview.markdown.mathBlockPreview,paragraphBeginningSpace:r.vditor.options.preview.markdown.paragraphBeginningSpace,sanitize:r.vditor.options.preview.markdown.sanitize,sub:r.vditor.options.preview.markdown.sub,sup:r.vditor.options.preview.markdown.sup,toc:r.vditor.options.preview.markdown.toc}),r.vditor.preview=new Ar(r.vditor),nt(r.vditor),i.after&&i.after(),i.icon&&(0,A.J)("".concat(i.cdn,"/dist/js/icons/").concat(i.icon,".js"),"vditorIconScript")}))},t})(ne.default);let Ii=Ri})(),ft=ft.default,ft})()})});var hr=Vi(fr(),1);var pr=`/*!
 * Vditor v4.0.1 - A markdown editor written in TypeScript.
 *
 * MIT License
 *
 * Copyright (c) 2018-present B3log \u5F00\u6E90, b3log.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
/*!
 * Vditor v4.0.1 - A markdown editor written in TypeScript.
 *
 * MIT License
 *
 * Copyright (c) 2018-present B3log \u5F00\u6E90, b3log.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
.vditor {
  --border-color: #d1d5da;
  --second-color: rgba(88, 96, 105, 0.36);
  --panel-background-color: #fff;
  --panel-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  --toolbar-background-color: #f6f8fa;
  --toolbar-icon-color: #586069;
  --toolbar-icon-hover-color: #4285f4;
  --toolbar-height: 35px;
  --toolbar-divider-margin-top: 8px;
  --textarea-background-color: #fafbfc;
  --textarea-text-color: #24292e;
  --resize-icon-color: var(--toolbar-icon-color);
  --resize-background-color: var(--toolbar-background-color);
  --resize-hover-icon-color: var(--panel-background-color);
  --resize-hover-background-color: var(--toolbar-icon-hover-color);
  --count-background-color: rgba(27, 31, 35, 0.05);
  --heading-border-color: #eaecef;
  --blockquote-color: #6a737d;
  --blockquote-border-color: #e0e0e0;
  --blockquote-text-color: #5f6368;
  --callout-note-color: #3575f0;
  --callout-tip-color: #65b84d;
  --callout-important-color: #8957e5;
  --callout-warning-color: #ff9632;
  --callout-caution-color: #d23f31;
  --ir-heading-color: #660e7a;
  --ir-title-color: #808080;
  --ir-bi-color: #0033b3;
  --ir-link-color: #008000;
  --ir-bracket-color: #0000ff;
  --ir-paren-color: #008000;
}
.vditor--dark {
  --border-color: #141414;
  --second-color: rgba(185, 185, 185, 0.36);
  --panel-background-color: #24292e;
  --panel-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
  --toolbar-background-color: #1d2125;
  --toolbar-icon-color: #b9b9b9;
  --toolbar-icon-hover-color: #fff;
  --textarea-background-color: #2f363d;
  --textarea-text-color: #d1d5da;
  --resize-icon-color: var(--border-color);
  --resize-background-color: var(--second-color);
  --resize-hover-icon-color: var(--toolbar-icon-hover-color);
  --resize-hover-background-color: rgba(185, 185, 185, 0.86);
  --count-background-color: rgba(66, 133, 244, 0.36);
  --heading-border-color: var(--textarea-text-color);
  --blockquote-color: var(--toolbar-icon-color);
  --blockquote-border-color: rgba(230, 230, 230, 0.1);
  --blockquote-text-color: #9aa0a6;
  --callout-note-color: #3575f0;
  --callout-tip-color: #65b84d;
  --callout-important-color: #b388ff;
  --callout-warning-color: #ff9632;
  --callout-caution-color: #d23f31;
  --ir-heading-color: #9876aa;
  --ir-title-color: #808080;
  --ir-bi-color: #cc7832;
  --ir-link-color: #ffc66d;
  --ir-bracket-color: #287bde;
  --ir-paren-color: #6a8759;
}
/**
 * tool tip.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 0.1.0.0, Jan 25, 2019
 */
@keyframes tooltip-appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.vditor-tooltipped {
  position: relative;
  cursor: pointer;
}
.vditor-tooltipped::after {
  position: absolute;
  z-index: 1000000;
  display: none;
  padding: 5px 8px;
  font-size: 11px;
  font-weight: normal;
  -webkit-font-smoothing: subpixel-antialiased;
  color: #fff;
  text-align: center;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: break-word;
  white-space: pre;
  pointer-events: none;
  content: attr(aria-label);
  background: #3b3e43;
  border-radius: 3px;
  line-height: 16px;
  opacity: 0;
}
.vditor-tooltipped::before {
  position: absolute;
  z-index: 1000001;
  display: none;
  width: 0;
  height: 0;
  color: #3b3e43;
  pointer-events: none;
  content: "";
  border: 5px solid transparent;
  opacity: 0;
}
.vditor-tooltipped--hover::before,
.vditor-tooltipped--hover::after,
.vditor-tooltipped:hover::before,
.vditor-tooltipped:hover::after,
.vditor-tooltipped:active::before,
.vditor-tooltipped:active::after,
.vditor-tooltipped:focus::before,
.vditor-tooltipped:focus::after {
  display: inline-block;
  text-decoration: none;
  animation-name: tooltip-appear;
  animation-duration: 0.15s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
}
.vditor-tooltipped__s::after,
.vditor-tooltipped__se::after,
.vditor-tooltipped__sw::after {
  top: 100%;
  right: 50%;
  margin-top: 5px;
}
.vditor-tooltipped__s::before,
.vditor-tooltipped__se::before,
.vditor-tooltipped__sw::before {
  top: auto;
  right: 50%;
  bottom: -5px;
  margin-right: -5px;
  border-bottom-color: #3b3e43;
}
.vditor-tooltipped__se::after {
  right: auto;
  left: 50%;
  margin-left: -15px;
}
.vditor-tooltipped__sw::after {
  margin-right: -15px;
}
.vditor-tooltipped__n::after,
.vditor-tooltipped__ne::after,
.vditor-tooltipped__nw::after {
  right: 50%;
  bottom: 100%;
  margin-bottom: 5px;
}
.vditor-tooltipped__n::before,
.vditor-tooltipped__ne::before,
.vditor-tooltipped__nw::before {
  top: -5px;
  right: 50%;
  bottom: auto;
  margin-right: -5px;
  border-top-color: #3b3e43;
}
.vditor-tooltipped__ne::after {
  right: auto;
  left: 50%;
  margin-left: -15px;
}
.vditor-tooltipped__nw::after {
  margin-right: -15px;
}
.vditor-tooltipped__s::after,
.vditor-tooltipped__n::after {
  transform: translateX(50%);
}
.vditor-tooltipped__w::after {
  right: 100%;
  bottom: 50%;
  margin-right: 5px;
  transform: translateY(50%);
}
.vditor-tooltipped__w::before {
  top: 50%;
  bottom: 50%;
  left: -5px;
  margin-top: -5px;
  border-left-color: #3b3e43;
}
.vditor-tooltipped__e::after {
  bottom: 50%;
  left: 100%;
  margin-left: 5px;
  transform: translateY(50%);
}
.vditor-tooltipped__e::before {
  top: 50%;
  right: -5px;
  bottom: 50%;
  margin-top: -5px;
  border-right-color: #3b3e43;
}
@media screen and (max-width: 520px) {
  .vditor-tooltipped:before,
  .vditor-tooltipped:after {
    content: none;
  }
}
/**
 * panel.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 1.0.0.0, Jan 22, 2020
 */
@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.vditor-panel {
  background-color: var(--panel-background-color);
  position: absolute;
  box-shadow: var(--panel-shadow);
  border-radius: 3px;
  padding: 5px;
  z-index: 3;
  font-size: 14px;
  display: none;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  max-width: 320px;
  min-width: 80px;
  animation-duration: 0.15s;
  animation-name: scale-in;
  animation-timing-function: cubic-bezier(0.2, 0, 0.13, 1.5);
  color: var(--toolbar-icon-color);
}
.vditor-panel--none {
  padding: 0;
  animation: none;
  min-width: auto;
  max-width: none;
  white-space: nowrap;
  opacity: 0.86;
}
.vditor-panel--arrow:before {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  content: " ";
  border: 7px solid transparent;
  top: -14px;
  left: 5px;
  border-bottom-color: var(--panel-background-color);
}
.vditor-panel--left {
  right: 0;
}
.vditor-panel--left.vditor-panel--arrow:before {
  right: 5px;
  left: auto;
}
.vditor-input {
  border: 0;
  padding: 3px 5px;
  background-color: var(--panel-background-color);
  font-size: 12px;
  color: var(--textarea-text-color);
}
.vditor-input:focus {
  background-color: var(--toolbar-background-color);
  outline: none;
}
.vditor-icon {
  color: var(--toolbar-icon-color);
  cursor: pointer;
  float: left;
  padding: 4px 5px;
  height: 21px;
  width: 23px;
  background-color: transparent;
  border: 0;
  box-sizing: border-box;
}
.vditor-icon:hover,
.vditor-icon--current {
  color: var(--toolbar-icon-hover-color);
  background-color: transparent;
}
.vditor-icon:focus {
  outline: none;
}
.vditor-icon svg {
  height: 13px !important;
  width: 13px !important;
  float: left;
  fill: currentColor;
  pointer-events: none;
}
.vditor-toolbar {
  background-color: var(--toolbar-background-color);
  border-bottom: 1px solid var(--border-color);
  padding: 0 5px;
  line-height: 1;
}
.vditor-toolbar--pin {
  position: sticky;
  top: 0;
  z-index: 1;
}
.vditor-toolbar--hide {
  transition: all 0.15s ease-in-out;
  height: 5px;
  overflow: hidden;
}
.vditor-toolbar--hide:hover {
  background-color: var(--toolbar-background-color);
  height: auto;
  overflow: visible;
}
.vditor-toolbar__item {
  float: left;
  position: relative;
}
.vditor-toolbar__item .vditor-tooltipped {
  color: var(--toolbar-icon-color);
  border: 0;
  padding: 10px 5px;
  background-color: transparent;
  height: var(--toolbar-height);
  width: 25px;
  box-sizing: border-box;
  font-size: 0;
}
.vditor-toolbar__item .vditor-tooltipped:focus {
  outline: none;
}
.vditor-toolbar__item .vditor-tooltipped:focus {
  cursor: pointer;
  color: var(--toolbar-icon-hover-color);
}
.vditor-toolbar__item svg {
  fill: currentColor;
  display: inline-block;
  stroke-width: 0;
  stroke: currentColor;
  width: 15px;
  height: 15px;
}
.vditor-toolbar__item input {
  position: absolute;
  width: 25px;
  height: var(--toolbar-height);
  top: 0;
  left: 0;
  cursor: pointer;
  opacity: 0.001;
  overflow: hidden;
}
.vditor-toolbar__divider {
  float: left;
  height: calc(var(--toolbar-height) - (var(--toolbar-divider-margin-top) * 2));
  border-left: 1px solid var(--second-color);
  margin: var(--toolbar-divider-margin-top) 8px;
}
.vditor-toolbar__br {
  width: 100%;
  padding: 0 !important;
  height: 0 !important;
}
.vditor-menu--current {
  color: var(--toolbar-icon-hover-color) !important;
}
.vditor-menu--disabled {
  color: var(--second-color) !important;
  cursor: not-allowed !important;
}
.vditor-emojis {
  display: inline-block;
  overflow: auto;
}
.vditor-emojis::-webkit-scrollbar {
  display: none;
}
.vditor-emojis__tip {
  flex: 1;
  min-width: 1px;
  width: 200px;
  margin-right: 10px;
  color: var(--toolbar-icon-color);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.vditor-emojis__tail {
  margin-top: 5px;
  font-size: 12px;
  color: var(--toolbar-icon-color);
  display: flex;
}
.vditor-emojis__tail a {
  text-decoration: none;
  color: var(--toolbar-icon-color);
}
.vditor-emojis__tail a:hover {
  color: var(--toolbar-icon-hover-color);
}
.vditor-emojis button {
  cursor: pointer;
  border-radius: 3px;
  float: left;
  height: 30px;
  width: 30px;
  text-align: center;
  line-height: 26px;
  padding: 3px;
  box-sizing: border-box;
  font-size: 16px;
  transition: all 0.15s ease-in-out;
  border: 0;
  margin: 0;
  background-color: transparent;
  overflow: hidden;
}
.vditor-emojis button:focus {
  outline: none;
}
.vditor-emojis button:hover .vditor-emojis__icon {
  display: inline-block;
  transform: scale(1.2);
}
.vditor-emojis img {
  height: 20px;
  width: 20px;
  float: left;
  margin: 3px 0 0 3px;
}
@media screen and (max-width: 520px) {
  .vditor-toolbar__item {
    padding: 0 12px;
  }
  .vditor-panel--left.vditor-panel--arrow:before {
    right: 17px;
  }
}
@media (hover: hover) and (pointer: fine) {
  .vditor-toolbar__item .vditor-tooltipped:hover {
    color: var(--toolbar-icon-hover-color);
  }
}
@keyframes slideInDown {
  from {
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
.vditor {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  box-sizing: border-box;
  font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", "Hiragino Sans GB", "Microsoft Yahei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", "EmojiSymbols";
}
.vditor--fullscreen {
  position: fixed;
  top: 0;
  width: 100% !important;
  left: 0;
  height: 100vh !important;
  z-index: 90;
  border-radius: 0;
}
.vditor-content {
  display: flex;
  min-height: 60px;
  flex: 1;
  min-width: 1px;
  position: relative;
}
.vditor-preview {
  flex: 1;
  min-width: 1px;
  overflow: auto;
  margin-left: -1px;
  border-left: 1px solid var(--border-color);
  box-sizing: border-box;
  border-radius: 0 0 3px 0;
  background-color: var(--textarea-background-color);
}
.vditor-preview::-webkit-scrollbar {
  display: none;
}
.vditor-preview__action {
  text-align: center;
  padding: 10px;
  background-color: var(--toolbar-background-color);
}
.vditor-preview__action button {
  background-color: var(--toolbar-background-color);
  color: var(--toolbar-icon-color);
  line-height: 20px;
  border: 0;
  margin: 0 10px;
  cursor: pointer;
  padding: 0 7px;
  font-size: 12px;
}
.vditor-preview__action button.vditor-preview__action--current,
.vditor-preview__action button:hover {
  color: var(--toolbar-icon-hover-color);
  background-color: var(--toolbar-background-color);
}
.vditor-preview__action button:focus {
  outline: none;
}
.vditor-preview__action button svg {
  fill: currentColor;
  height: 15px;
  width: 15px;
  vertical-align: middle;
}
.vditor-preview > .vditor-reset {
  padding: 10px;
  margin: 0 auto;
}
.vditor-preview img:not(.emoji) {
  cursor: pointer;
}
.vditor-devtools {
  display: none;
  background-color: var(--textarea-background-color);
  overflow: auto;
  flex: 1;
  min-width: 1px;
  box-shadow: inset 1px 0 var(--border-color);
  box-sizing: border-box;
  border-radius: 0 0 3px 0;
  padding: 10px;
}
.vditor-counter {
  padding: 3px;
  color: var(--toolbar-icon-color);
  background-color: var(--count-background-color);
  border-radius: 3px;
  font-size: 12px;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  float: right;
  margin: 8px 3px 0 0;
}
.vditor-counter--error {
  color: #d23f31;
  background-color: rgba(210, 63, 49, 0.1);
}
.vditor-resize {
  padding: 3px 0;
  cursor: row-resize;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  position: absolute;
  width: 100%;
}
.vditor-resize--top {
  top: -3px;
}
.vditor-resize--bottom {
  bottom: -3px;
}
.vditor-resize > div {
  height: 3px;
  background-color: var(--resize-background-color);
  transition: all 0.15s ease-in-out;
}
.vditor-resize:hover > div,
.vditor-resize--selected > div {
  background-color: var(--resize-hover-background-color);
}
.vditor-resize:hover svg,
.vditor-resize--selected svg {
  color: var(--resize-hover-icon-color);
}
.vditor-resize svg {
  fill: currentColor;
  stroke-width: 0;
  stroke: currentColor;
  width: 13px;
  height: 3px;
  display: block;
  margin: 0 auto;
  color: var(--resize-icon-color);
}
.vditor-upload {
  position: absolute;
  height: 3px;
  left: 0;
  top: -2px;
  transition: all 0.15s ease-in-out;
  background-color: #4285f4;
}
.vditor-tip {
  position: absolute;
  font-size: 12px;
  top: 10px;
  animation-duration: 0.15s;
  animation-fill-mode: both;
  left: 50%;
  z-index: 5;
}
.vditor-tip--show {
  display: block;
  animation-name: slideInDown;
}
.vditor-tip__content {
  text-align: left;
  display: inline-block;
  line-height: 16px;
  padding: 3px 10px;
  border-radius: 3px;
  background: var(--toolbar-background-color);
  position: relative;
  margin-left: -50%;
  color: var(--toolbar-icon-color);
  max-width: 100%;
  box-shadow: var(--panel-shadow);
}
.vditor-tip__content ul {
  margin: 2px 0;
  padding: 0 0 0 18px;
}
.vditor-tip__content a {
  color: #4285f4;
}
.vditor-tip__close {
  position: absolute;
  color: var(--toolbar-icon-color);
  top: -7px;
  right: -15px;
  font-weight: bold;
  cursor: pointer;
}
.vditor-tip__close:hover {
  color: var(--toolbar-icon-hover-color);
}
.vditor-img {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
}
.vditor-img__bar {
  border-bottom: 1px solid var(--border-color);
  background-color: var(--toolbar-background-color);
  text-align: center;
  height: 36px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vditor-img__btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 24px;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  color: var(--toolbar-icon-color);
}
.vditor-img__btn:hover {
  color: var(--toolbar-icon-hover-color);
}
.vditor-img__btn svg {
  height: 14px;
  width: 14px;
  margin-right: 8px;
  fill: currentColor;
}
.vditor-img__img {
  flex: 1;
  background-color: var(--textarea-background-color);
  overflow: auto;
  cursor: zoom-out;
}
.vditor-img__img img {
  max-width: none;
}
.vditor-hint {
  background-color: var(--panel-background-color);
  position: absolute;
  box-shadow: var(--panel-shadow);
  border-radius: 3px;
  padding: 5px 0;
  z-index: 4;
  line-height: 20px;
  list-style: none;
  font-size: 12px;
  margin: 0;
  max-width: 250px;
  min-width: 80px;
  display: none;
}
.vditor-hint .vditor-hint {
  margin-top: -31px;
  left: 100%;
  right: auto;
}
.vditor-hint .vditor-hint.vditor-panel--left {
  right: 100%;
  left: auto;
}
.vditor-hint button {
  color: var(--toolbar-icon-color);
  display: block;
  padding: 3px 10px;
  border: 0;
  border-radius: 0;
  line-height: 20px;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.vditor-hint button:focus {
  outline: none;
}
.vditor-hint--current,
.vditor-hint button:not(.vditor-menu--disabled):hover {
  background-color: var(--toolbar-background-color) !important;
  color: var(--toolbar-icon-hover-color) !important;
}
.vditor-hint__emoji {
  font-size: 16px;
  float: left;
  margin-right: 3px;
}
.vditor-hint img {
  height: 20px;
  width: 20px;
  float: left;
  margin-right: 3px;
}
.vditor-reset {
  color: #24292e;
  font-variant-ligatures: no-common-ligatures;
  font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", "Hiragino Sans GB", "Microsoft Yahei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", "EmojiSymbols";
  word-wrap: break-word;
  overflow: auto;
  line-height: 1.5;
  font-size: 16px;
  word-break: break-word;
}
.vditor-reset--anchor {
  padding-left: 20px;
}
.vditor-reset--error {
  color: #d23f31;
  font-size: 12px;
  display: block;
  line-height: 16px;
}
.vditor-reset ul ul ul {
  list-style-type: square;
}
.vditor-reset ul ul {
  list-style-type: circle;
}
.vditor-reset ul {
  list-style-type: disc;
}
.vditor-reset ul,
.vditor-reset ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}
.vditor-reset li + li {
  margin-top: 0.25em;
}
.vditor-reset li p {
  margin-top: 16px;
}
.vditor-reset audio {
  max-width: 100%;
}
.vditor-reset audio:focus {
  outline: none;
}
.vditor-reset video {
  max-height: 90vh;
  max-width: 100%;
}
.vditor-reset img {
  max-width: 100%;
}
.vditor-reset img.emoji {
  cursor: auto;
  max-width: 20px;
  vertical-align: sub;
}
.vditor-reset figure.vditor-image {
  margin: 0 0 16px;
  text-align: center;
}
.vditor-reset figure.vditor-image figcaption {
  font-size: 0.875em;
  margin-top: 4px;
  opacity: 0.65;
  white-space: pre-wrap;
}
.vditor-reset span.vditor-image[data-image-caption] {
  display: inline-block;
  max-width: 100%;
  text-align: center;
  vertical-align: top;
}
.vditor-reset span.vditor-image[data-image-caption]::after {
  content: attr(data-image-caption);
  display: block;
  font-size: 0.875em;
  line-height: 1.5;
  margin-top: 4px;
  opacity: 0.65;
  white-space: pre-wrap;
}
.vditor-reset h1,
.vditor-reset h2,
.vditor-reset h3,
.vditor-reset h4,
.vditor-reset h5,
.vditor-reset h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}
.vditor-reset h1:hover .vditor-anchor svg,
.vditor-reset h2:hover .vditor-anchor svg,
.vditor-reset h3:hover .vditor-anchor svg,
.vditor-reset h4:hover .vditor-anchor svg,
.vditor-reset h5:hover .vditor-anchor svg,
.vditor-reset h6:hover .vditor-anchor svg {
  visibility: visible;
}
.vditor-reset h1 {
  font-size: 1.75em;
}
.vditor-reset h2 {
  font-size: 1.55em;
}
.vditor-reset h3 {
  font-size: 1.38em;
}
.vditor-reset h4 {
  font-size: 1.25em;
}
.vditor-reset h5 {
  font-size: 1.13em;
}
.vditor-reset h6 {
  font-size: 1em;
}
.vditor-reset hr {
  height: 2px;
  padding: 0;
  margin: 24px 0;
  background-color: #eaecef;
  border: 0;
}
.vditor-reset p {
  margin-top: 0;
  margin-bottom: 16px;
}
.vditor-reset blockquote:not(.callout) {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 0 0 calc(0.25em + 6px);
  color: var(--blockquote-text-color, #5f6368);
  background-color: transparent;
  border: 0;
  margin: 0 0 16px 0;
}
.vditor-reset blockquote:not(.callout)::before {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 2px;
  width: 0.25em;
  content: "";
  background-color: var(--blockquote-border-color, #e0e0e0);
  border-radius: 6px;
}
.vditor-reset blockquote:not(.callout) > :first-child {
  margin-top: 0;
}
.vditor-reset blockquote:not(.callout) > :last-child {
  margin-bottom: 0;
}
.vditor-reset blockquote:not(.callout) > p {
  padding: 4px;
  margin: 2px 0;
  line-height: 1.625;
  border-radius: 6px;
}
.vditor-reset ins > iframe {
  border: 0;
}
.vditor-reset iframe {
  border: 1px solid #d1d5da;
  max-width: 100%;
  box-sizing: border-box;
}
.vditor-reset iframe.iframe__video {
  min-width: 80%;
  min-height: 36vh;
}
.vditor-reset table {
  border-collapse: collapse;
  empty-cells: show;
  margin-bottom: 16px;
  overflow: auto;
  border-spacing: 0;
  display: block;
  word-break: keep-all;
  width: 100%;
}
.vditor-reset table tr {
  background-color: #fafbfc;
  border-top: 1px solid #c6cbd1;
}
.vditor-reset table td,
.vditor-reset table th {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
  word-break: normal;
  white-space: nowrap;
}
.vditor-reset table td:first-child::after,
.vditor-reset table th:first-child::after {
  content: "";
  display: inline-block;
  vertical-align: top;
  min-height: 24px;
}
.vditor-reset table th {
  font-weight: 600;
}
.vditor-reset table tbody tr:nth-child(2n) {
  background-color: #fff;
}
.vditor-reset code:not(.hljs):not(.highlight-chroma) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  border-radius: 3px;
  font-family: mononoki, Consolas, "Liberation Mono", Menlo, Courier, monospace, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", "EmojiSymbols";
  word-break: break-word;
  background-size: 20px 20px;
  white-space: pre-wrap;
}
.vditor-reset pre {
  margin: 1em 0;
}
.vditor-reset pre > code {
  margin: 0;
  font-size: 85%;
  padding: 0.5em;
  border-radius: 5px;
  display: block;
  overflow: auto;
  white-space: pre;
  font-family: mononoki, Consolas, "Liberation Mono", Menlo, Courier, monospace, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", "EmojiSymbols";
  background-size: 20px 20px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8AgMAAABHkjHhAAAACVBMVEWAgIBaWlo+Pj7rTFvWAAAAA3RSTlMHCAw+VhR4AAAA+klEQVQoz4WSMW7EQAhFPxKWNh2FCx+HkaZI6RRb5DYbyVfIJXLKDCFoMbaTKSw/8ZnPAPjaH2xgZcUNUDADD7D9LtDBCLZ45fbkvo/30K8yeI64pPwl6znd/3n/Oe93P3ho9qeh72btTFzqkz0rsJle8Zr81OLEwZ1dv/713uWqvu2pl+k0fy7MWtj9r/tN5q/02z89qa/L4Dc2LvM93kezPfXlME/O86EbY/V9GB9ePX8G1/6W+/9h1dq/HGfTfzT3j/xNo7522Bfnqe5jO/fvhVthlfk434v3iO9zG/UOphyPeinPl1J8Gtaa7xPTa/Dk+RIs4deMvwGvcGsmsCvJ0AAAAABJRU5ErkJggg==);
  word-break: initial;
  word-wrap: normal;
}
.vditor-reset pre:hover div.vditor-copy {
  display: block;
}
.vditor-reset .language-math,
.vditor-reset .language-echarts,
.vditor-reset .language-mindmap,
.vditor-reset .language-plantuml,
.vditor-reset .language-mermaid,
.vditor-reset .language-smiles,
.vditor-reset .language-markmap,
.vditor-reset .language-abc,
.vditor-reset .language-flowchart,
.vditor-reset .language-graphviz,
.vditor-reset .language-wavedrom {
  margin-bottom: 16px;
}
.vditor-reset .language-math mjx-container:focus {
  outline: none;
  cursor: context-menu;
}
.vditor-reset .language-math .katex-display > .katex > .katex-html > .tag {
  display: inline-block;
  font-size: 1.21rem;
  right: 2px;
}
.vditor-reset .language-echarts,
.vditor-reset .language-mindmap {
  overflow: hidden;
  height: 420px;
}
.vditor-reset .language-mermaid,
.vditor-reset .language-markmap,
.vditor-reset .language-flowchart,
.vditor-reset .language-graphviz,
.vditor-reset .language-wavedrom {
  text-align: center;
}
.vditor-reset .language-graphviz parsererror {
  overflow: auto;
}
.vditor-reset kbd {
  display: inline-block;
  padding: 3px 5px;
  font: 11px Consolas, "Liberation Mono", Menlo, Courier, monospace;
  line-height: 10px;
  color: #24292e;
  vertical-align: middle;
  background-color: #fafbfc;
  border: solid 1px #d1d5da;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 #d1d5da;
}
.vditor-reset summary {
  cursor: pointer;
}
.vditor-reset summary:focus {
  outline: none;
}
.vditor-reset svg {
  height: auto;
  width: auto;
  stroke-width: initial;
}
.vditor-reset p:last-child,
.vditor-reset blockquote:last-child,
.vditor-reset pre:last-child,
.vditor-reset ul:last-child,
.vditor-reset ol:last-child,
.vditor-reset hr:last-child {
  margin-bottom: 0;
}
.vditor-comment {
  border-bottom: 2px solid #f8e6ab;
}
.vditor-comment--focus,
.vditor-comment--hover {
  background-color: #faf1d1;
  border-bottom: 2px solid #ffc60a;
}
.vditor-comment--focus .vditor-comment,
.vditor-comment--hover .vditor-comment {
  border-bottom: 2px solid #ffc60a;
}
.vditor-task {
  list-style: none !important;
  word-break: break-all;
}
.vditor-task input {
  margin: 0 0.2em 0.25em -1.6em;
  font-size: 12px;
  vertical-align: middle;
}
.vditor-copy {
  position: relative;
  display: none;
  z-index: 1;
}
.vditor-copy textarea {
  position: absolute;
  left: -100000px;
  height: 10px;
}
.vditor-copy span {
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 0.5em;
}
.vditor-copy svg {
  color: #586069;
  height: 14px;
  width: 14px !important;
  display: block;
  fill: currentColor;
}
.vditor-linenumber {
  padding-left: 4em !important;
  position: relative;
}
.vditor-linenumber__rows {
  position: absolute;
  pointer-events: none;
  top: 1em;
  left: 0;
  width: 3em;
  /* works for line-numbers below 1000 lines */
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  counter-reset: linenumber;
}
.vditor-linenumber__rows > span {
  pointer-events: none;
  display: block;
}
.vditor-linenumber__rows > span::before {
  counter-increment: linenumber;
  content: counter(linenumber);
  color: rgba(158, 150, 150, 0.38);
  display: block;
  padding-right: 1em;
  text-align: right;
}
.vditor-speech {
  position: absolute;
  display: none;
  background-color: #f6f8fa;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  padding: 3px;
  cursor: pointer;
  color: #586069;
}
.vditor-speech:hover,
.vditor-speech--current {
  color: #4285f4;
}
.vditor-speech svg {
  height: 14px;
  width: 14px;
  fill: currentColor;
  display: block;
  stroke-width: 0;
  stroke: currentColor;
}
.vditor-anchor {
  margin-left: 5px;
}
.vditor-anchor--left {
  float: left;
  padding-right: 4px;
  margin-left: -20px;
}
.vditor-anchor svg {
  visibility: hidden;
}
.vditor-anchor:hover svg {
  visibility: visible;
}
.vditor-anchor:focus {
  outline: none;
}
.vditor-linkcard {
  margin: 31px auto 16px;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  max-width: 768px;
  padding: 0 10px;
}
.vditor-linkcard a {
  border-radius: 3px;
  background-color: #f6f8fa;
  overflow: hidden;
  max-height: 250px;
  display: flex;
  text-decoration: none;
  flex-wrap: wrap-reverse;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.vditor-linkcard a:hover {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.13), 0 3px 6px rgba(0, 0, 0, 0.26);
  text-decoration: none;
}
.vditor-linkcard a:visited .vditor-linkcard__abstract {
  color: rgba(88, 96, 105, 0.36);
}
.vditor-linkcard__info {
  padding: 10px;
  min-width: 200px;
  box-sizing: border-box;
  flex: 1;
}
.vditor-linkcard__title {
  font-size: 14px;
  font-weight: 400;
  color: #24292e;
  display: flex;
  align-items: center;
}
.vditor-linkcard__title img {
  cursor: pointer;
  height: 20px;
  width: 20px;
  border-radius: 3px;
  flex-shrink: 0;
  margin-right: 5px;
}
.vditor-linkcard__abstract {
  word-wrap: break-word;
  word-break: break-all;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  font-size: 13px;
  color: #586069;
  margin: 5px 0;
}
.vditor-linkcard__site {
  font-size: 12px;
  color: #4285f4;
}
.vditor-linkcard__image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  max-width: 250px;
  min-width: 126px;
  cursor: pointer;
  background-color: rgba(88, 96, 105, 0.36);
}
.vditor-footnotes__goto-ref {
  text-decoration: none;
}
.vditor-toc {
  margin-bottom: 16px;
  -webkit-user-select: text;
     -moz-user-select: text;
          user-select: text;
  color: #4285f4;
}
.vditor-toc .vditor-outline__action {
  display: none;
}
.vditor-toc ul {
  list-style: none !important;
  padding-left: 1em;
}
.vditor-toc > ul {
  padding-left: 0;
}
.vditor-toc span {
  cursor: pointer;
}
.vditor-toc li > span > svg {
  width: 0;
  height: 0;
}
.vditor-outline {
  width: 250px;
  border-right: 1px solid var(--border-color);
  background-color: var(--panel-background-color);
  display: none;
  overflow: auto;
}
.vditor-outline--right {
  border-right: 0;
  border-left: 1px solid var(--border-color);
}
.vditor-outline::-webkit-scrollbar {
  display: none;
}
.vditor-outline ul {
  list-style: none !important;
  padding-left: 1em;
  margin: 0;
}
.vditor-outline__content > ul {
  padding-left: 0;
}
.vditor-outline li > span {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  color: var(--textarea-text-color);
}
.vditor-outline li > span > svg {
  height: 10px;
  width: 10px;
  flex-shrink: 0;
}
.vditor-outline li > span:hover {
  color: var(--toolbar-icon-hover-color);
}
.vditor-outline li > span > span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vditor-outline__title {
  border-bottom: 1px dashed var(--border-color);
  padding: 5px 10px;
  color: var(--toolbar-icon-color);
  font-size: 12px;
}
.vditor-outline__action {
  transition: all 0.15s ease-in-out;
  fill: currentColor;
  margin-right: 5px;
  flex-shrink: 0;
}
.vditor-outline__action--close {
  transform: rotate(-90deg);
}
.vditor-reset .callout,
.vditor-wysiwyg blockquote.callout,
.vditor-ir blockquote.callout {
  --callout-color: var(--callout-note-color, #3575f0);
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 0 16px;
  padding: 0 0 0 calc(0.25em + 6px);
  color: var(--blockquote-text-color, #5f6368);
  border: 0;
}
.vditor-reset .callout::before,
.vditor-wysiwyg blockquote.callout::before,
.vditor-ir blockquote.callout::before {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 2px;
  width: 0.25em;
  content: "";
  background-color: var(--callout-color);
  border-radius: 6px;
}
.vditor-reset .callout[data-subtype="TIP"],
.vditor-wysiwyg blockquote.callout[data-subtype="TIP"],
.vditor-ir blockquote.callout[data-subtype="TIP"] {
  --callout-color: var(--callout-tip-color, #65b84d);
}
.vditor-reset .callout[data-subtype="IMPORTANT"],
.vditor-wysiwyg blockquote.callout[data-subtype="IMPORTANT"],
.vditor-ir blockquote.callout[data-subtype="IMPORTANT"] {
  --callout-color: var(--callout-important-color, #8957e5);
}
.vditor-reset .callout[data-subtype="WARNING"],
.vditor-wysiwyg blockquote.callout[data-subtype="WARNING"],
.vditor-ir blockquote.callout[data-subtype="WARNING"] {
  --callout-color: var(--callout-warning-color, #ff9632);
}
.vditor-reset .callout[data-subtype="CAUTION"],
.vditor-wysiwyg blockquote.callout[data-subtype="CAUTION"],
.vditor-ir blockquote.callout[data-subtype="CAUTION"] {
  --callout-color: var(--callout-caution-color, #d23f31);
}
.vditor-reset .callout > .callout-info,
.vditor-wysiwyg blockquote.callout > .callout-info,
.vditor-ir blockquote.callout > .callout-info {
  display: flex;
  align-items: center;
  min-height: 1.5em;
  margin: 2px 0;
  padding: 4px;
  color: var(--callout-color);
}
.vditor-reset .callout > .callout-info .callout-icon,
.vditor-wysiwyg blockquote.callout > .callout-info .callout-icon,
.vditor-ir blockquote.callout > .callout-info .callout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.2em;
  height: 1.2em;
  padding: 4px;
  line-height: 1.2em;
  text-align: center;
  font-variant-emoji: emoji;
  border-radius: 6px;
}
.vditor-reset .callout > .callout-info .callout-icon:empty,
.vditor-wysiwyg blockquote.callout > .callout-info .callout-icon:empty,
.vditor-ir blockquote.callout > .callout-info .callout-icon:empty {
  display: none;
}
.vditor-reset .callout > .callout-info .callout-title,
.vditor-wysiwyg blockquote.callout > .callout-info .callout-title,
.vditor-ir blockquote.callout > .callout-info .callout-title {
  flex: 1;
  min-width: 1px;
  margin-left: 4px;
  font-size: 114%;
  font-weight: 500;
  opacity: 0.86;
}
.vditor-reset .callout > .callout-info .callout-img,
.vditor-wysiwyg blockquote.callout > .callout-info .callout-img,
.vditor-ir blockquote.callout > .callout-info .callout-img,
.vditor-reset .callout > .callout-info > .callout-img,
.vditor-wysiwyg blockquote.callout > .callout-info > .callout-img,
.vditor-ir blockquote.callout > .callout-info > .callout-img {
  height: 1.2em;
  width: 100%;
}
.vditor-reset .callout > p:not(.callout-info),
.vditor-wysiwyg blockquote.callout > p:not(.callout-info),
.vditor-ir blockquote.callout > p:not(.callout-info),
.vditor-reset .callout > .callout-content > p,
.vditor-wysiwyg blockquote.callout > .callout-content > p,
.vditor-ir blockquote.callout > .callout-content > p {
  padding: 4px;
  margin: 2px 0;
  line-height: 1.625;
  border-radius: 6px;
}
.vditor-wysiwyg blockquote.callout > .callout-info,
.vditor-ir blockquote.callout > .callout-info {
  font-size: 114%;
  font-weight: 500;
  opacity: 0.86;
}
.vditor-wysiwyg__callout-marker {
  display: none;
}
.vditor-wysiwyg {
  box-sizing: border-box;
  flex: 1;
  position: relative;
  width: 100%;
  min-width: 1px;
}
.vditor-wysiwyg pre.vditor-reset {
  background-color: var(--panel-background-color);
  margin: 0;
  white-space: pre-wrap;
  height: 100%;
  box-sizing: border-box;
}
.vditor-wysiwyg pre.vditor-reset[contenteditable="false"] {
  opacity: 0.3;
  cursor: not-allowed;
}
.vditor-wysiwyg pre.vditor-reset:empty::before {
  content: attr(placeholder);
  color: var(--second-color);
}
.vditor-wysiwyg pre.vditor-reset:focus {
  outline: none;
  background-color: var(--textarea-background-color);
}
.vditor-wysiwyg pre.vditor-reset:after {
  content: "";
  height: var(--editor-bottom);
  display: block;
}
.vditor-wysiwyg blockquote:empty::before,
.vditor-wysiwyg pre > code:empty::before,
.vditor-wysiwyg p:empty::before,
.vditor-wysiwyg h1:empty::after,
.vditor-wysiwyg h2:empty::after,
.vditor-wysiwyg h3:empty::after,
.vditor-wysiwyg h4:empty::after,
.vditor-wysiwyg h5:empty::after,
.vditor-wysiwyg h6:empty::after {
  content: ' ';
}
.vditor-wysiwyg code[data-marker="\`"] {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.vditor-wysiwyg__block pre:first-child {
  margin-bottom: -1em;
}
.vditor-wysiwyg__block pre:first-child code {
  color: var(--textarea-text-color);
  height: auto;
  text-align: left;
}
.vditor-wysiwyg__block pre:last-child {
  margin-bottom: 1em;
}
.vditor-wysiwyg__preview {
  cursor: pointer;
  white-space: initial;
  min-height: 27px;
}
.vditor-wysiwyg > .vditor-reset > h1:before,
.vditor-wysiwyg > .vditor-reset > h2:before,
.vditor-wysiwyg > .vditor-reset > h3:before,
.vditor-wysiwyg > .vditor-reset > h4:before,
.vditor-wysiwyg > .vditor-reset > h5:before,
.vditor-wysiwyg > .vditor-reset > h6:before,
.vditor-wysiwyg div.vditor-wysiwyg__block:before,
.vditor-wysiwyg div[data-type="link-ref-defs-block"]:before,
.vditor-wysiwyg div[data-type="footnotes-block"]:before,
.vditor-wysiwyg .vditor-toc:before {
  float: left;
  padding-right: 4px;
  margin-left: -29px;
  content: 'H1';
  font-size: 0.85rem;
  font-weight: normal;
  color: var(--second-color);
}
.vditor-wysiwyg > .vditor-reset > h2:before {
  content: 'H2';
}
.vditor-wysiwyg > .vditor-reset > h3:before {
  content: 'H3';
}
.vditor-wysiwyg > .vditor-reset > h4:before {
  content: 'H4';
}
.vditor-wysiwyg > .vditor-reset > h5:before {
  content: 'H5';
}
.vditor-wysiwyg > .vditor-reset > h6:before {
  content: 'H6';
}
.vditor-wysiwyg div[data-type="link-ref-defs-block"]:before {
  content: '"A"';
}
.vditor-wysiwyg div[data-type="footnotes-block"]:before {
  content: '^F';
}
.vditor-wysiwyg div.vditor-wysiwyg__block:before {
  content: "</>";
}
.vditor-wysiwyg div.vditor-wysiwyg__block[data-type="yaml-front-matter"]:before {
  content: "F";
}
.vditor-wysiwyg div.vditor-wysiwyg__block[data-type="math-block"]:before {
  content: "$$";
}
.vditor-wysiwyg .vditor-toc:before {
  content: "ToC";
}
.vditor-wysiwyg hr {
  display: inline-block;
  margin: 12px 0;
  width: 100%;
}
.vditor-wysiwyg details {
  white-space: initial;
}
.vditor-wysiwyg a {
  cursor: pointer;
}
.vditor-wysiwyg span[data-type="backslash"] > span {
  display: none;
  color: var(--second-color);
}
.vditor-wysiwyg span[data-type="link-ref"],
.vditor-wysiwyg sup[data-type="footnotes-ref"] {
  color: #4285f4;
}
.vditor-wysiwyg span[data-type="toc-h"] {
  color: #4285f4;
  text-decoration: underline;
}
.vditor-wysiwyg div[data-type="footnotes-block"] {
  border-top: 2px solid var(--heading-border-color);
  padding-top: 24px;
  margin-top: 24px;
}
.vditor-wysiwyg div[data-type="link-ref-defs-block"] {
  color: var(--blockquote-color);
}
.vditor-wysiwyg__mobile-toolbar {
  display: none;
}
@media screen and (max-width: 520px) {
  .vditor-wysiwyg__mobile-toolbar {
    display: block;
    float: left;
    height: 21px;
    position: relative;
    width: 23px;
  }
  .vditor-wysiwyg__mobile-actions {
    box-sizing: border-box;
    flex-wrap: wrap;
    left: 0;
    padding: 5px;
    top: 26px;
    white-space: normal;
  }
  .vditor-wysiwyg__mobile-actions.vditor-panel--left {
    left: auto;
    right: 0;
  }
  .vditor-wysiwyg__mobile-actions--open {
    display: flex;
  }
  .vditor-wysiwyg h1:before,
  .vditor-wysiwyg h2:before,
  .vditor-wysiwyg h3:before,
  .vditor-wysiwyg h4:before,
  .vditor-wysiwyg h5:before,
  .vditor-wysiwyg h6:before,
  .vditor-wysiwyg div.vditor-wysiwyg__block:before,
  .vditor-wysiwyg div[data-type="link-ref-defs-block"]:before,
  .vditor-wysiwyg div[data-type="footnotes-block"]:before,
  .vditor-wysiwyg .vditor-toc:before {
    content: none;
  }
}
.vditor-ir {
  box-sizing: border-box;
  flex: 1;
  min-width: 1px;
  position: relative;
  width: 100%;
}
.vditor-ir__node[data-type="code-block"]:before,
.vditor-ir__node[data-type="code-block"]:after,
.vditor-ir__node[data-type="yaml-front-matter"]:before,
.vditor-ir__node[data-type="yaml-front-matter"]:after,
.vditor-ir__node[data-type="math-block"]:before,
.vditor-ir__node[data-type="math-block"]:after {
  content: ' ';
  color: var(--second-color);
}
.vditor-ir__node:not(.vditor-ir__node--expand) .vditor-ir__marker {
  padding: 0 !important;
}
.vditor-ir__node:not(.vditor-ir__node--expand)[data-type="a"] {
  cursor: pointer;
}
.vditor-ir__node[data-type="link-ref"],
.vditor-ir__node[data-type="footnotes-ref"] {
  color: #4285f4;
}
.vditor-ir__node[data-type="html-block"] {
  margin-bottom: 1em;
}
.vditor-ir__node .vditor-ir__marker {
  width: 0;
  overflow: hidden;
  display: inline-block;
  height: 0;
  transition: all 0.15s ease-in-out;
}
.vditor-ir__node--hidden .vditor-ir__marker {
  visibility: hidden;
}
.vditor-ir__node--expand .vditor-ir__marker {
  color: var(--second-color);
  display: inline;
  height: auto;
  width: auto;
}
.vditor-ir__node--expand .vditor-ir__marker--hide {
  display: none;
}
.vditor-ir__node--expand .vditor-ir__marker--heading {
  color: var(--ir-heading-color);
}
.vditor-ir__node--expand .vditor-ir__marker--bi {
  color: var(--ir-bi-color);
}
.vditor-ir__node--expand .vditor-ir__marker--link {
  color: var(--ir-link-color);
}
.vditor-ir__node--expand .vditor-ir__marker--title {
  color: var(--ir-title-color);
}
.vditor-ir__node--expand .vditor-ir__marker--bracket {
  color: var(--ir-bracket-color);
  text-decoration: underline;
}
.vditor-ir__node--expand .vditor-ir__marker--paren {
  color: var(--ir-paren-color);
}
.vditor-ir__node--expand .vditor-ir__marker--info {
  color: var(--ir-heading-color);
}
.vditor-ir__node--expand .vditor-ir__marker--pre code {
  color: var(--textarea-text-color);
  height: auto;
  text-align: left;
}
.vditor-ir__node--expand[data-type="code-block"]:before,
.vditor-ir__node--expand[data-type="code-block"]:after {
  content: '\`\`\`';
}
.vditor-ir__node--expand[data-type="yaml-front-matter"]:before,
.vditor-ir__node--expand[data-type="yaml-front-matter"]:after {
  content: '---';
}
.vditor-ir__node--expand[data-type="math-block"]:before,
.vditor-ir__node--expand[data-type="math-block"]:after {
  content: '$$';
}
.vditor-ir__node span[data-type="code-block-open-marker"],
.vditor-ir__node span[data-type="code-block-close-marker"],
.vditor-ir__node span[data-type="yaml-front-matter-open-marker"],
.vditor-ir__node span[data-type="yaml-front-matter-close-marker"],
.vditor-ir__node span[data-type="math-block-open-marker"],
.vditor-ir__node span[data-type="math-block-close-marker"] {
  display: none;
}
.vditor-ir__preview {
  cursor: pointer;
  white-space: initial;
  min-height: 27px;
}
.vditor-ir__link {
  color: var(--ir-bracket-color);
  text-decoration: underline;
}
.vditor-ir pre.vditor-reset {
  background-color: var(--panel-background-color);
  margin: 0;
  white-space: pre-wrap;
  height: 100%;
  box-sizing: border-box;
}
.vditor-ir pre.vditor-reset[contenteditable="false"] {
  opacity: 0.3;
  cursor: not-allowed;
}
.vditor-ir pre.vditor-reset:empty::before {
  content: attr(placeholder);
  color: var(--second-color);
}
.vditor-ir pre.vditor-reset:focus {
  outline: none;
  background-color: var(--textarea-background-color);
}
.vditor-ir pre.vditor-reset:after {
  content: "";
  height: var(--editor-bottom);
  display: block;
}
.vditor-ir pre.vditor-reset pre {
  margin: 0;
}
.vditor-ir hr {
  display: inline-block;
  margin: 12px 0;
  width: 100%;
}
.vditor-ir blockquote:empty::before,
.vditor-ir pre > code:empty::before,
.vditor-ir p:empty::before,
.vditor-ir h1:empty::after,
.vditor-ir h2:empty::after,
.vditor-ir h3:empty::after,
.vditor-ir h4:empty::after,
.vditor-ir h5:empty::after,
.vditor-ir h6:empty::after {
  content: ' ';
}
.vditor-ir .vditor-reset > h1:before,
.vditor-ir .vditor-reset > h2:before,
.vditor-ir .vditor-reset > h3:before,
.vditor-ir .vditor-reset > h4:before,
.vditor-ir .vditor-reset > h5:before,
.vditor-ir .vditor-reset > h6:before,
.vditor-ir div[data-type="link-ref-defs-block"]:before,
.vditor-ir div[data-type="footnotes-block"]:before,
.vditor-ir .vditor-toc:before {
  float: left;
  padding-right: 4px;
  margin-left: -29px;
  content: 'H1';
  font-size: 0.85rem;
  font-weight: normal;
  color: var(--second-color);
}
.vditor-ir .vditor-reset > h2:before {
  content: 'H2';
}
.vditor-ir .vditor-reset > h3:before {
  content: 'H3';
}
.vditor-ir .vditor-reset > h4:before {
  content: 'H4';
}
.vditor-ir .vditor-reset > h5:before {
  content: 'H5';
}
.vditor-ir .vditor-reset > h6:before {
  content: 'H6';
}
.vditor-ir div[data-type="link-ref-defs-block"] {
  color: var(--blockquote-color);
}
.vditor-ir div[data-type="link-ref-defs-block"]:before {
  content: '"A"';
}
.vditor-ir div[data-type="footnotes-block"] {
  border-top: 2px solid var(--heading-border-color);
  padding-top: 24px;
  margin-top: 24px;
}
.vditor-ir div[data-type="footnotes-block"]:before {
  content: '^F';
}
.vditor-ir div[data-type="footnotes-block"] > div[data-type="footnotes-def"] > ul,
.vditor-ir div[data-type="footnotes-block"] > div[data-type="footnotes-def"] > ol,
.vditor-ir div[data-type="footnotes-block"] > div[data-type="footnotes-def"] > p,
.vditor-ir div[data-type="footnotes-block"] > div[data-type="footnotes-def"] > blockquote,
.vditor-ir div[data-type="footnotes-block"] > div[data-type="footnotes-def"] > pre,
.vditor-ir div[data-type="footnotes-block"] > div[data-type="footnotes-def"] > table,
.vditor-ir div[data-type="footnotes-block"] > div[data-type="footnotes-def"] > hr {
  margin-left: 8px;
}
.vditor-ir .vditor-toc:before {
  content: "ToC";
}
.vditor-ir .vditor-toc span[data-type="toc-h"] {
  color: #4285f4;
  text-decoration: underline;
}
@media screen and (max-width: 520px) {
  .vditor-ir h1:before,
  .vditor-ir h2:before,
  .vditor-ir h3:before,
  .vditor-ir h4:before,
  .vditor-ir h5:before,
  .vditor-ir h6:before,
  .vditor-ir div[data-type="link-ref-defs-block"]:before,
  .vditor-ir div[data-type="footnotes-block"]:before,
  .vditor-ir .vditor-toc:before {
    content: none;
  }
}
.vditor-sv {
  font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", "Hiragino Sans GB", "Microsoft Yahei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", "EmojiSymbols";
  margin: 0 1px 0 0;
  overflow: auto;
  width: 100%;
  flex: 1;
  min-width: 1px;
  border: 0;
  resize: none;
  padding: 10px 9px 10px 10px;
  box-sizing: border-box;
  background-color: var(--panel-background-color);
  outline: 0 none;
  font-size: 16px;
  line-height: 22px;
  color: var(--textarea-text-color);
  border-radius: 0 0 3px 3px;
  font-variant-ligatures: no-common-ligatures;
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
}
.vditor-sv:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.vditor-sv::-moz-placeholder {
  color: var(--second-color);
}
.vditor-sv::placeholder {
  color: var(--second-color);
}
.vditor-sv:focus {
  background-color: var(--textarea-background-color);
}

`;window.__ModuleLoader__.load({id:"@local/dsh-markdown-editor",factory(Je){let Q=Je("react"),F=Q.createElement,ft="markdown-inline-editor",ne="@local/dsh-markdown-editor/markdown",k="markdown-inline-editor/read",T="markdown-inline-editor/save",N=2e4,A=3e4,c=620,p="dsh.markdown-editor.mode",l=8e3,g={"viewer.label":"Markdown \u7F16\u8F91\u5668","toolbar.split":"\u5206\u680F","toolbar.source":"\u6E90\u7801","toolbar.preview":"\u9884\u89C8","toolbar.ir":"\u6240\u89C1\u5373\u6240\u5F97","toolbar.save":"\u4FDD\u5B58","toolbar.overwrite":"\u8986\u76D6\u4FDD\u5B58","toolbar.saving":"\u4FDD\u5B58\u4E2D\u2026","toolbar.saved":"\u5DF2\u4FDD\u5B58","toolbar.dirty":"\u672A\u4FDD\u5B58","toolbar.hint":"Ctrl/Cmd+S \u4FDD\u5B58","status.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","status.external":"\u78C1\u76D8\u4E0A\u7684\u6587\u4EF6\u5DF2\u88AB\u4FEE\u6539\uFF0C\u8FD9\u91CC\u7684\u7F16\u8F91\u5185\u5BB9\u53EF\u80FD\u5DF2\u8FC7\u671F\u3002","status.reload":"\u91CD\u65B0\u52A0\u8F7D","status.reloaded":"\u5DF2\u6309\u78C1\u76D8\u5185\u5BB9\u91CD\u65B0\u52A0\u8F7D","status.draft":"\u5DF2\u6062\u590D\u4E0A\u6B21\u672A\u4FDD\u5B58\u7684\u8349\u7A3F","status.reloadDirty":"\u91CD\u65B0\u52A0\u8F7D\uFF08\u4E22\u5F03\u672C\u5730\u4FEE\u6539\uFF09","status.irLoading":"\u6B63\u5728\u52A0\u8F7D\u6240\u89C1\u5373\u6240\u5F97\u7F16\u8F91\u5668\u2026","status.irFailed":"\u6240\u89C1\u5373\u6240\u5F97\u7F16\u8F91\u5668\u52A0\u8F7D\u5931\u8D25\uFF0C\u53EF\u4EE5\u5207\u56DE\u5206\u680F\u7EE7\u7EED\u7F16\u8F91\u3002","status.irFallback":"\u5207\u56DE\u5206\u680F","dialog.retry":"\u91CD\u8BD5","source.label":"Markdown \u6E90\u7801","preview.label":"Markdown \u9884\u89C8","error.load":"\u8BFB\u53D6\u5931\u8D25","error.save":"\u4FDD\u5B58\u5931\u8D25","error.timeout":"\u8BF7\u6C42\u8D85\u65F6","error.changed":"\u6587\u4EF6\u5DF2\u5728\u78C1\u76D8\u4E0A\u88AB\u4FEE\u6539\uFF1B\u518D\u6309\u4FDD\u5B58\u4F1A\u8986\u76D6\u5B83\u3002","error.notLive":"\u8FD9\u4E2A\u4F1A\u8BDD\u4E0D\u5728\u5F53\u524D Host \u4E2D\u8FD0\u884C\uFF0C\u65E0\u6CD5\u4FDD\u5B58\u3002","error.outside":"\u8BE5\u6587\u4EF6\u4E0D\u5728\u5F53\u524D\u4F1A\u8BDD\u7684\u5DE5\u4F5C\u76EE\u5F55\u5185\u3002","error.tooLarge":"\u6587\u4EF6\u8D85\u8FC7 2 MiB\uFF0C\u4E0D\u80FD\u5728\u4FA7\u8FB9\u680F\u5185\u7F16\u8F91\u3002","error.notText":"\u6587\u4EF6\u4E0D\u662F\u6709\u6548\u7684 UTF-8 \u6587\u672C\u3002","error.notFound":"\u6587\u4EF6\u4E0D\u5B58\u5728\u6216\u4E0D\u662F\u666E\u901A\u6587\u4EF6\u3002","error.notMarkdown":"\u53EA\u6709 Markdown \u6587\u4EF6\u53EF\u4EE5\u8FD9\u6837\u7F16\u8F91\u3002","error.symlink":"\u7B26\u53F7\u94FE\u63A5\u6587\u4EF6\u4E0D\u53EF\u7F16\u8F91\u3002","error.unauthorized":"\u6D4F\u89C8\u5668\u4F1A\u8BDD\u672A\u901A\u8FC7\u9274\u6743\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u3002","error.noPath":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8BE5\u6587\u4EF6\u7684\u7EDD\u5BF9\u8DEF\u5F84\uFF0C\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u3002"},b={"viewer.label":"Markdown editor","toolbar.split":"Split","toolbar.source":"Source","toolbar.preview":"Preview","toolbar.ir":"WYSIWYG","toolbar.save":"Save","toolbar.overwrite":"Overwrite","toolbar.saving":"Saving\u2026","toolbar.saved":"Saved","toolbar.dirty":"Unsaved","toolbar.hint":"Ctrl/Cmd+S to save","status.loading":"Reading the file\u2026","status.external":"The file changed on disk; these edits may be out of date.","status.reload":"Reload","status.reloaded":"Reloaded from disk","status.draft":"Restored unsaved changes","status.reloadDirty":"Reload (discard edits)","status.irLoading":"Loading the WYSIWYG editor\u2026","status.irFailed":"The WYSIWYG editor could not load; switch back to Split to keep editing.","status.irFallback":"Switch to Split","dialog.retry":"Retry","source.label":"Markdown source","preview.label":"Markdown preview","error.load":"Could not read the file","error.save":"Could not save the file","error.timeout":"the request timed out","error.changed":"The file changed on disk; saving again overwrites it.","error.notLive":"This Session is not live in the Host, so it cannot save.","error.outside":"The file is outside the current Session workspace.","error.tooLarge":"The file exceeds 2 MiB and cannot be edited here.","error.notText":"The file is not valid UTF-8 text.","error.notFound":"The file is missing or not a regular file.","error.notMarkdown":"Only Markdown files can be edited this way.","error.symlink":"Symbolic links are not editable.","error.unauthorized":"The browser session is not authorized; reload the page.","error.noPath":"The absolute path is not known yet, so the file cannot be read."},h={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function y(x){return String(x).replace(/[&<>"']/g,O=>h[O])}function E(x){return/^[/\\]/.test(x)||/^[A-Za-z]:[/\\]/.test(x)}function w(x){if(/^[/\\]{2}/.test(x)||/[\u0000-\u001f\u007f]/.test(x))return null;try{return new URL("api/file?path="+encodeURIComponent(x),document.baseURI).href}catch{return null}}function f(x,O){let R=String(x).trim();if(/^https?:/i.test(R)||/^data:image\//i.test(R))return R;let I=/^[A-Za-z]:[/\\]/.test(R);if(!I&&/^[A-Za-z][A-Za-z\d+.-]*:/.test(R))return null;let U=R;try{let le=R.search(/[?#]/);U=decodeURIComponent(le===-1?R:R.slice(0,le))}catch{return null}if(U==="")return null;if(I||E(U))return w(U);if(typeof O!="string"||O==="")return U;let P=Math.max(O.lastIndexOf("/"),O.lastIndexOf("\\")),re=P===-1?"":O.slice(0,P+1);return w(re+U)}function u(x){let O=String(x).trim();return O===""?null:/^(https?:|mailto:)/i.test(O)?O:/^[A-Za-z][A-Za-z\d+.-]*:/.test(O)?null:O}function s(x,O,R,I){let U=O==="image"?"![":"[",V="",P=0;for(;P<x.length;){let re=x.indexOf(U,P);if(re===-1){V+=x.slice(P);break}V+=x.slice(P,re);let le=re+U.length,be=x.indexOf("]",le);if(be===-1||x[be+1]!=="("){V+=x.slice(re,le),P=le;continue}let xe=be+2,Ne=1,pe="",tt=-1;for(;xe<x.length;){let ge=x[xe];if(ge==="(")Ne+=1;else if(ge===")"&&(Ne-=1,Ne===0)){tt=xe;break}pe+=ge,xe+=1}if(tt===-1){V+=x.slice(re,le),P=le;continue}let st=/^(\S*?)(?:\s+["'](.*)["'])?\s*$/.exec(pe),Fe=st===null?pe.trim():st[1],Ge=st===null?void 0:st[2];V+=R(I(x.slice(le,be),Fe,Ge)),P=tt+1}return V}function S(x,O){let R=[],I=V=>(R.push(V),"\0"+String(R.length-1)+"\0"),U=String(x);U=U.replace(/\\([\\`*_{}[\]()#+\-.!>~|])/g,(V,P)=>I(y(P))),U=U.replace(/(`+)([\s\S]*?)\1/g,(V,P,re)=>I("<code>"+y(String(re).replace(/^ (.*) $/,"$1"))+"</code>")),U=s(U,"image",I,(V,P,re)=>{let le=f(P,O.documentPath);if(le===null)return y(V);let be=re===void 0?"":' title="'+y(re)+'"';return'<img src="'+y(le)+'" alt="'+y(V)+'"'+be+' loading="lazy">'}),U=s(U,"link",I,(V,P,re)=>{let le=u(P);if(le===null)return S(V,O);let be=re===void 0?"":' title="'+y(re)+'"';return'<a href="'+y(le)+'"'+be+' target="_blank" rel="noreferrer noopener">'+S(V,O)+"</a>"}),U=U.replace(/<((?:https?:\/\/|mailto:)[^>\s]+)>/g,(V,P)=>I('<a href="'+y(P)+'" target="_blank" rel="noreferrer noopener">'+y(P)+"</a>")),U=y(U),U=U.replace(/&lt;br\s*\/?&gt;/gi,"<br>"),U=U.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),U=U.replace(/__([^_]+)__/g,"<strong>$1</strong>"),U=U.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g,"$1<em>$2</em>"),U=U.replace(/(^|[^_\w])_([^_\n]+)_(?![\w_])/g,"$1<em>$2</em>"),U=U.replace(/~~([^~]+)~~/g,"<del>$1</del>");for(let V=0;V<8;V+=1){let P=!1;if(U=U.replace(/\u0000(\d+)\u0000/g,(re,le)=>{let be=R[Number(le)];return be===void 0?re:(P=!0,be)}),!P)break}return U}function D(x){return String(x).trim()===""}function C(x){let O=String(x).trim().replace(/^\|/,"").replace(/\|$/,""),R=[],I="";for(let U=0;U<O.length;U+=1){let V=O[U];if(V==="\\"&&O[U+1]==="|"){I+="|",U+=1;continue}if(V==="|"){R.push(I),I="";continue}I+=V}return R.push(I),R.map(U=>U.trim())}function H(x,O){let R=x[O],I=x[O+1];if(typeof R!="string"||typeof I!="string"||!R.includes("|")||!I.includes("|"))return!1;let U=C(I);return U.length>0&&U.every(V=>/^:?-{1,}:?$/.test(V))}function G(x,O){let R=x[O];return D(R)||/^\s{0,3}(#{1,6})\s+/.test(R)||/^\s{0,3}(`{3,}|~{3,})/.test(R)||/^\s{0,3}>/.test(R)||/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(R)||/^(\s*)([-+*]|\d{1,9}[.)])(\s+)/.test(R)?!0:H(x,O)}function J(x,O,R){let I=x.lines,U=O[0];x.index+=1;let V=[];for(;x.index<I.length;){let re=I[x.index],le=re.trim();if(le[0]===U&&le.length>=3&&/^(`{3,}|~{3,})$/.test(le)&&le.replace(new RegExp("\\"+U,"g"),"")===""){x.index+=1;break}V.push(re),x.index+=1}return'<div class="dsh-md-code">'+(R===""?"":'<span class="dsh-md-lang">'+y(R)+"</span>")+"<pre><code>"+y(V.join(`
`))+"</code></pre></div>"}function me(x){let O=[];for(;x.index<x.lines.length;){let I=x.lines[x.index];if(!/^\s{0,3}>/.test(I))break;O.push(I.replace(/^\s{0,3}>\s?/,"")),x.index+=1}let R={lines:O,index:0,documentPath:x.documentPath};return"<blockquote>"+_e(R)+"</blockquote>"}function ke(x){let O=C(x.lines[x.index]),R=C(x.lines[x.index+1]).map(P=>{let re=P.startsWith(":"),le=P.endsWith(":");return re&&le?"center":le?"right":re?"left":""});x.index+=2;let I=[];for(;x.index<x.lines.length;){let P=x.lines[x.index];if(D(P)||!P.includes("|"))break;I.push(C(P)),x.index+=1}let U=(P,re,le)=>{let be=R[le]===void 0||R[le]===""?"":' style="text-align:'+R[le]+'"';return"<"+P+be+">"+S(re,x)+"</"+P+">"},V='<div class="dsh-md-table"><table><thead><tr>';O.forEach((P,re)=>{V+=U("th",P,re)}),V+="</tr></thead><tbody>";for(let P of I)V+="<tr>",O.forEach((re,le)=>{V+=U("td",P[le]===void 0?"":P[le],le)}),V+="</tr>";return V+="</tbody></table></div>",V}function ve(x){let O=x.lines,R=/^(\s*)([-+*]|\d{1,9}[.)])(\s+)/.exec(O[x.index]),I=R[1].length,U=/\d/.test(R[2]),V=U?parseInt(R[2],10):1,P=[];for(;x.index<O.length;){let xe=/^(\s*)([-+*]|\d{1,9}[.)])(\s+)(.*)$/.exec(O[x.index]);if(xe===null||xe[1].length!==I||/\d/.test(xe[2])!==U)break;let Ne=I+xe[2].length+xe[3].length,pe=[xe[4]];for(x.index+=1;x.index<O.length;){let tt=O[x.index];if(D(tt)){let Fe=O[x.index+1],Ge=Fe===void 0?0:/^\s*/.exec(Fe)[0].length;if(Fe!==void 0&&!D(Fe)&&Ge>=Ne){pe.push(""),x.index+=1;continue}break}if(/^\s*/.exec(tt)[0].length<Ne)break;pe.push(tt.slice(Ne)),x.index+=1}P.push(pe)}let re=U?"ol":"ul",le=U&&V!==1?' start="'+String(V)+'"':"",be="<"+re+le+">";for(let xe of P)be+="<li>"+Pe(xe,x.documentPath)+"</li>";return be+"</"+re+">"}function Pe(x,O){let R=x,I="",U=/^\[([ xX])\]\s+/.exec(R[0]===void 0?"":R[0]);U!==null&&(I='<input type="checkbox" disabled'+(U[1].toLowerCase()==="x"?" checked":"")+"> ",R=[R[0].slice(U[0].length)].concat(R.slice(1)));let P=_e({lines:R,index:0,documentPath:O}),re=/^<p>([\s\S]*?)<\/p>(?:\n|$)/.exec(P);return re!==null&&(P=re[1]+P.slice(re[0].length)),I+P}function Te(x){let O=x.lines,R=[],I=0;for(;x.index<O.length;){let V=O[x.index];if(D(V)||R.length>0&&G(O,x.index))break;if(R.push(V),x.index+=1,R.length===1&&x.index<O.length){let P=O[x.index].trim();if(/^={2,}$/.test(P)){I=1,x.index+=1;break}if(/^-{2,}$/.test(P)&&V.trim()!==""){I=2,x.index+=1;break}}}let U="";for(let V=0;V<R.length;V+=1){let P=R[V],re=/(?: {2,}|\\)$/.test(P),le=re?P.replace(/(?: {2,}|\\)$/,""):P;U+=S(le,x),V<R.length-1&&(U+=re?"<br>":" ")}return I>0?"<h"+String(I)+">"+U+"</h"+String(I)+">":"<p>"+U+"</p>"}function _e(x){let O=[],R=x.lines;for(;x.index<R.length;){let I=R[x.index];if(D(I)){x.index+=1;continue}let U=/^\s{0,3}(`{3,}|~{3,})\s*([^`~]*)$/.exec(I);if(U!==null){O.push(J(x,U[1],U[2].trim()));continue}let V=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(I);if(V!==null){let P=String(V[1].length);O.push("<h"+P+">"+S(V[2],x)+"</h"+P+">"),x.index+=1;continue}if(/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(I)){O.push("<hr>"),x.index+=1;continue}if(/^\s{0,3}>/.test(I)){O.push(me(x));continue}if(H(R,x.index)){O.push(ke(x));continue}if(/^(\s*)([-+*]|\d{1,9}[.)])(\s+)/.test(I)){O.push(ve(x));continue}O.push(Te(x))}return O.join(`
`)}function De(x,O){let R=String(x).replace(/\r\n?/g,`
`).split(`
`),I={lines:R,index:0,documentPath:typeof O=="string"?O:""},U="";if(R.length>0&&/^---\s*$/.test(R[0])){let V=-1;for(let P=1;P<R.length;P+=1)if(/^(---|\.\.\.)\s*$/.test(R[P])){V=P;break}V>0&&(U='<pre class="dsh-md-frontmatter">'+y(R.slice(1,V).join(`
`))+"</pre>",I.index=V+1)}return U+_e(I)}function Ke(x,O,R){let I=x!==null&&typeof x=="object"&&typeof x.code=="string"?x.code:"",U={"session-not-live":"error.notLive","outside-workspace":"error.outside","too-large":"error.tooLarge","not-text":"error.notText","not-found":"error.notFound","not-regular-file":"error.notFound","not-markdown":"error.notMarkdown",symlink:"error.symlink"};if(I!==""&&Object.prototype.hasOwnProperty.call(U,I))return O(U[I]);let V=x!==null&&typeof x=="object"&&typeof x.message=="string"?x.message:"",P=O(R===void 0?"error.load":R);return V===""?P:P+": "+V}function St(x,O){return x instanceof Error&&x.name==="AbortError"?O("error.timeout"):x instanceof Error?x.message:String(x)}let Tt="zh";function je(x){let R=String(Tt).toLowerCase().startsWith("zh")?g:b;return Object.prototype.hasOwnProperty.call(R,x)?R[x]:Object.prototype.hasOwnProperty.call(g,x)?g[x]:x}function M(x){if(typeof x.t=="function"){let O;try{O=x.t("toolbar.split")}catch{O=void 0}if(typeof O=="string"&&O!=="toolbar.split")return x.t}return je}async function at(x,O,R){let I=new AbortController,U=setTimeout(()=>{I.abort()},R);try{return await fetch(x,{method:"POST",headers:{"content-type":"application/json",accept:"application/json"},body:JSON.stringify(O),signal:I.signal})}finally{clearTimeout(U)}}async function Ot(x,O){let R=await at(k,{sessionId:x,path:O},N),I=await R.json().catch(()=>null);return{response:R,payload:I}}let gt=new Map,bt=["ir","split","source","preview"],Y=de();function de(){try{let x=window.localStorage.getItem(p);if(bt.includes(x))return x}catch{}return"split"}function B(x){Y=x;try{window.localStorage.setItem(p,x)}catch{}}function q(x,O){return String(x)+"\0"+String(O)}function Ce(x){let O=String(x);if(!O.startsWith("---"))return{front:"",body:O};let R=/^---[ \t]*\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/.exec(O);return R===null?{front:"",body:O}:{front:O.slice(0,R[0].length),body:O.slice(R[0].length)}}function ee(){try{return new URL("markdown-inline-editor/vditor",document.baseURI).href.replace(/\/+$/,"")}catch{return""}}function He(){try{let x=getComputedStyle(document.documentElement).getPropertyValue("--dsw-alias-bg-base").trim(),O,R,I,U=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(x);if(U!==null){let V=U[1].length===3?U[1].split("").map(P=>P+P).join(""):U[1];O=parseInt(V.slice(0,2),16),R=parseInt(V.slice(2,4),16),I=parseInt(V.slice(4,6),16)}else{let V=/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(x);if(V===null)return!1;O=Number(V[1]),R=Number(V[2]),I=Number(V[3])}return .2126*O+.7152*R+.0722*I<128}catch{return!1}}let Me=[".dsh-md-root{position:absolute;inset:0;display:flex;flex-direction:column;min-height:0;box-sizing:border-box;overflow:hidden;white-space:normal;font-family:var(--dsw-font-family,ui-sans-serif,system-ui,sans-serif)}",".dsh-md-toolbar{display:flex;flex:none;flex-wrap:wrap;align-items:center;gap:6px;padding:4px 8px;border-bottom:0.5px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}",".dsh-md-group{display:inline-flex;gap:2px;padding:2px;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-2)}",".dsh-md-chip{height:28px;padding:0 10px;border:0;border-radius:var(--dsw-radius-sm,5px);background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;cursor:pointer}",'.dsh-md-chip[aria-pressed="true"]{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}',".dsh-md-chip:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}",".dsh-md-state{margin-left:auto;color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap}",'.dsh-md-state[data-dirty="true"]{color:var(--dsw-alias-state-warn-primary)}',".dsh-md-save{height:28px;padding:0 12px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,5px);background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;cursor:pointer;white-space:nowrap}",'.dsh-md-save[data-primary="true"]{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}',".dsh-md-save:disabled{opacity:.5;cursor:default}",".dsh-md-notice{display:flex;flex:none;gap:8px;align-items:center;padding:4px 10px;font-size:11px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border-bottom:0.5px solid var(--dsw-alias-border-l1)}",'.dsh-md-notice[data-tone="error"]{color:var(--dsw-alias-state-error-primary)}',".dsh-md-notice button{padding:0;border:0;background:transparent;color:inherit;font:inherit;text-decoration:underline;cursor:pointer}",".dsh-md-panes{display:flex;flex:1 1 auto;min-width:0;min-height:0}",".dsh-md-pane{display:flex;flex:1 1 0;min-width:0;min-height:0;flex-direction:column}",".dsh-md-pane[hidden]{display:none}",".dsh-md-source{flex:1 1 auto;width:100%;min-height:0;margin:0;padding:10px 12px;border:0;outline:none;resize:none;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-markdown-code-block,13px/1.65 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace);tab-size:2}",".dsh-md-source:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}",".dsh-md-preview{flex:1 1 auto;min-height:0;overflow:auto;padding:12px 14px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.75;overflow-wrap:anywhere}",".dsh-md-preview:focus{outline:none}",".dsh-md-split-line{flex:none;width:0.5px;background:var(--dsw-alias-border-l1)}",".dsh-md-split-line-h{width:auto;height:0.5px}",".dsh-md-preview h1,.dsh-md-preview h2,.dsh-md-preview h3,.dsh-md-preview h4,.dsh-md-preview h5,.dsh-md-preview h6{margin:18px 0 8px;font-weight:600;line-height:1.35}",".dsh-md-preview h1{font-size:20px}.dsh-md-preview h2{font-size:17px}.dsh-md-preview h3{font-size:15px}.dsh-md-preview h4,.dsh-md-preview h5,.dsh-md-preview h6{font-size:13px}",".dsh-md-preview h1:first-child,.dsh-md-preview h2:first-child,.dsh-md-preview p:first-child{margin-top:0}",".dsh-md-preview p{margin:8px 0}",".dsh-md-preview ul,.dsh-md-preview ol{margin:8px 0;padding-left:22px}",".dsh-md-preview li{margin:2px 0}",".dsh-md-preview li>p{margin:2px 0}",'.dsh-md-preview li input[type="checkbox"]{margin:0 6px 0 -18px;vertical-align:middle}',".dsh-md-preview blockquote{margin:8px 0;padding:2px 12px;color:var(--dsw-alias-label-secondary);border-left:2px solid var(--dsw-alias-border-l2)}",".dsh-md-preview hr{margin:16px 0;border:0;border-top:0.5px solid var(--dsw-alias-border-l2)}",".dsh-md-preview a{color:var(--dsw-alias-brand-primary);text-decoration:none}",".dsh-md-preview a:hover{text-decoration:underline}",".dsh-md-preview code{padding:1px 4px;border-radius:4px;background:var(--dsw-alias-bg-layer-2);font:var(--dsw-font-markdown-code-block,12px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace)}",".dsh-md-code{margin:10px 0;border:0.5px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}",".dsh-md-lang{display:block;padding:4px 10px;color:var(--dsw-alias-label-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:.04em}",".dsh-md-code pre{margin:0;padding:10px 12px;overflow:auto}",".dsh-md-code code{padding:0;background:transparent;font:var(--dsw-font-markdown-code-block,12px/1.65 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace);white-space:pre}",".dsh-md-frontmatter{margin:0 0 10px;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre-wrap}",".dsh-md-table{overflow:auto;margin:10px 0}",".dsh-md-table table{border-collapse:collapse;font-size:12px}",".dsh-md-table th,.dsh-md-table td{padding:4px 10px;border:0.5px solid var(--dsw-alias-border-l2);text-align:left}",".dsh-md-table th{background:var(--dsw-alias-bg-layer-2);font-weight:600}",".dsh-md-preview img{max-width:100%;height:auto;border-radius:4px}",".dsh-md-placeholder{flex:1;display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center;padding:24px;color:var(--dsw-alias-label-secondary);font-size:12px;text-align:center}",".dsh-md-ir{position:relative;flex:1 1 auto;min-height:0;overflow:auto;background:var(--dsw-alias-bg-base)}",".dsh-md-ir .vditor{height:auto!important;min-height:100%;border:0!important;background:transparent!important}",".dsh-md-ir .vditor-toolbar{display:none!important}",".dsh-md-ir .vditor-reset{color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family,ui-sans-serif,system-ui,sans-serif);font-size:13px;line-height:1.75;padding:12px 16px 24px}",".dsh-md-ir .vditor-ir{padding:0}",".dsh-md-ir .vditor-panel{border:0.5px solid var(--dsw-alias-border-l2);border-radius:6px}",".dsh-md-ir-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);font-size:12px}"].join(`
`);function We(x){let O=M(x),R=Q.useRef(x.text),I=Q.useRef(x.onInput),U=Q.useRef(x.onSave),V=Q.useRef(x.documentPath);Q.useLayoutEffect(()=>{R.current=x.text,I.current=x.onInput,U.current=x.onSave,V.current=x.documentPath},[x.text,x.onInput,x.onSave,x.documentPath]);let P=Q.useRef(null),re=Q.useRef(null),le=Q.useRef(""),be=Q.useRef(""),[xe,Ne]=Q.useState(!1),[pe,tt]=Q.useState(!1),[st,Fe]=Q.useState(He),Ge=Q.useCallback(()=>{let ge=P.current;if(ge===null)return;let ce=ge.querySelectorAll("img");for(let Be=0;Be<ce.length;Be+=1){let Re=ce[Be],nt=Re.getAttribute("data-src"),Ve=nt===null?Re.getAttribute("src"):nt;if(Ve===null||Ve==="")continue;let Oe=f(Ve,V.current);Oe!==null&&(Re.getAttribute("src")!==Oe&&Re.setAttribute("src",Oe),nt!==null&&nt!==Oe&&Re.setAttribute("data-src",Oe))}},[]);return Q.useEffect(()=>{let ge=P.current;if(ge===null||(Ge(),typeof MutationObserver>"u"))return;let ce=0,Be=()=>{ce===0&&(ce=window.requestAnimationFrame(()=>{ce=0,Ge()}))},Re=new MutationObserver(Be);return Re.observe(ge,{childList:!0,subtree:!0}),()=>{Re.disconnect(),ce!==0&&window.cancelAnimationFrame(ce)}},[Ge]),Q.useEffect(()=>{Ge()},[Ge,x.documentPath]),Q.useEffect(()=>{if(typeof MutationObserver>"u")return;let ge=new MutationObserver(()=>{Fe(He())});return ge.observe(document.documentElement,{attributes:!0,attributeFilter:["class","style","data-theme"]}),()=>{ge.disconnect()}},[]),Q.useEffect(()=>{let ge=P.current;if(ge===null)return;let ce=Ce(R.current);le.current=ce.front,be.current=ce.body;let Be=!0,Re=!1,nt,Ve=setTimeout(()=>{Be&&!Re&&tt(!0)},l);try{let Oe=He();nt=new hr.default(ge,{mode:"ir",value:ce.body,cdn:ee(),lang:"zh_CN",cache:{enable:!1},toolbar:[],counter:{enable:!1},outline:{enable:!1},height:"auto",theme:Oe?"dark":"classic",preview:{theme:{current:Oe?"dark":"light"},hljs:{enable:!0,lineNumber:!1,style:"github"}},after:()=>{Re=!0,Be&&(clearTimeout(Ve),Ne(!0),window.requestAnimationFrame(Ge))},input:yt=>{Be&&(be.current=yt,I.current(le.current+yt),window.requestAnimationFrame(Ge))}}),re.current=nt}catch(Oe){clearTimeout(Ve),console.error("[markdown-inline-editor] Vditor mount failed",Oe),tt(!0)}return()=>{Be=!1,clearTimeout(Ve);try{nt!==void 0&&typeof nt.destroy=="function"&&nt.destroy()}catch(Oe){console.error("[markdown-inline-editor] Vditor destroy failed",Oe)}re.current=null,ge.innerHTML=""}},[]),Q.useEffect(()=>{if(!pe)return;let ge=re.current;re.current=null;try{ge!==null&&typeof ge.destroy=="function"&&ge.destroy()}catch(ce){console.error("[markdown-inline-editor] Vditor destroy failed",ce)}},[pe]),Q.useEffect(()=>{let ge=re.current;if(ge===null)return;let ce=Ce(x.text);if(le.current=ce.front,ce.body!==be.current){be.current=ce.body;try{typeof ge.setValue=="function"&&ge.setValue(ce.body)}catch(Be){console.error("[markdown-inline-editor] Vditor setValue failed",Be)}}},[x.text]),Q.useEffect(()=>{let ge=re.current;if(ge!==null)try{typeof ge.setTheme=="function"&&ge.setTheme(st?"dark":"classic",st?"dark":"light","github")}catch(ce){console.error("[markdown-inline-editor] Vditor setTheme failed",ce)}},[st]),Q.useEffect(()=>{let ge=ce=>{if(!(ce.ctrlKey||ce.metaKey)||ce.altKey||ce.key!=="s"&&ce.key!=="S")return;let Be=P.current,Re=document.activeElement;Be===null||Re===null||!Be.contains(Re)||(ce.preventDefault(),ce.stopPropagation(),U.current())};return window.addEventListener("keydown",ge,!0),()=>{window.removeEventListener("keydown",ge,!0)}},[]),pe?F("div",{className:"dsh-md-ir"},F("div",{className:"dsh-md-placeholder",role:"alert"},F("span",null,O("status.irFailed")),F("button",{type:"button",className:"dsh-md-save",onClick:()=>{x.onFallback()}},O("status.irFallback")))):F("div",{className:"dsh-md-ir"},F("style",{key:"vditor-css"},pr),F("div",{className:"dsh-md-vditor",ref:P}),xe?null:F("div",{className:"dsh-md-ir-loading",role:"status"},O("status.irLoading")))}function oe(x){let O=M(x),R=x.sessionId,I=x.content,U=x.resourceAddress,V=x.useResource(U),P=V!==void 0&&V.value!==void 0&&typeof V.value.absolutePath=="string"?V.value.absolutePath:void 0,re=V!==void 0&&V.value!==void 0&&typeof V.value.version=="string"?V.value.version:void 0,le=I!==void 0&&I.kind==="renderer"?I.revision:-1,[be,xe]=Q.useState({phase:"loading",text:"",baseline:"",mtimeMs:0,failure:null}),[Ne,pe]=Q.useState(Y),[tt,st]=Q.useState(!1),[Fe,Ge]=Q.useState(!1),[ge,ce]=Q.useState(null),[Be,Re]=Q.useState(!1),[nt,Ve]=Q.useState(!1),Oe=Q.useRef(be);Q.useLayoutEffect(()=>{Oe.current=be},[be]);let yt=Q.useRef(null),Ht=Q.useRef(!1),Nt=Q.useRef(null);Q.useEffect(()=>{if(I===void 0||I.kind!=="renderer"||typeof P!="string"||P===""||typeof re!="string"||re==="")return;let ie=q(R,P),Se=!1,ze=Ee=>{if(Oe.current.phase==="ready"){ce({tone:"error",text:Ee});return}typeof I.failed=="function"&&I.failed(),xe({phase:"failure",text:"",baseline:"",mtimeMs:0,failure:Ee})};return(async()=>{try{let{response:Ee,payload:Le}=await Ot(R,P);if(Se)return;if(Ee.status===401||Ee.status===403){ze(O("error.unauthorized"));return}if(!Ee.ok||Le===null||typeof Le.text!="string"){ze(Ke(Le,O,"error.load"));return}let qe=Le.text,ct=typeof Le.mtimeMs=="number"?Le.mtimeMs:0,ut=Oe.current;if(ct!==0&&ut.mtimeMs!==0&&ct<ut.mtimeMs)return;let Zt=ut.phase==="ready"?void 0:gt.get(ie);typeof Zt=="string"&&Zt!==qe?(xe({phase:"ready",text:Zt,baseline:qe,mtimeMs:ct,failure:null}),ce({tone:"info",text:O("status.draft")})):ut.text===qe?xe({phase:"ready",text:ut.text,baseline:qe,mtimeMs:ct,failure:null}):ut.phase!=="ready"||ut.text===ut.baseline?(xe({phase:"ready",text:qe,baseline:qe,mtimeMs:ct,failure:null}),Re(!1)):yt.current===qe?xe({phase:"ready",text:ut.text,baseline:qe,mtimeMs:ct,failure:null}):ct!==0&&ct===ut.mtimeMs?(xe({phase:"ready",text:qe,baseline:qe,mtimeMs:ct,failure:null}),Re(!1)):(xe({phase:"ready",text:ut.text,baseline:ut.baseline,mtimeMs:ct,failure:null}),Re(!0)),typeof I.loaded=="function"&&I.loaded(re)}catch(Ee){if(Se)return;ze(O("error.load")+": "+St(Ee,O))}})(),()=>{Se=!0}},[le,P,re,R,O]),Q.useEffect(()=>{let ie=Nt.current;if(ie===null||typeof ResizeObserver>"u")return;let Se=new ResizeObserver(ze=>{let Ee=ze[0]===void 0?0:ze[0].contentRect.width;Ve(Ee>0&&Ee<c)});return Se.observe(ie),()=>{Se.disconnect()}},[]);let wt=be.phase==="ready"&&be.text!==be.baseline,Rt=Q.useRef(null),It=Q.useRef(0),tn=Q.useCallback(ie=>{Rt.current=ie,typeof x.scrollportRef=="function"&&x.scrollportRef(ie)},[x.scrollportRef]),un=Q.useCallback(async()=>{if(!(typeof P!="string"||P===""))try{let{response:ie,payload:Se}=await Ot(R,P);if(!ie.ok||Se===null||typeof Se.text!="string"){ce({tone:"error",text:Ke(Se,O,"error.load")});return}let ze=q(R,P);gt.delete(ze),yt.current=Se.text,xe({phase:"ready",text:Se.text,baseline:Se.text,mtimeMs:typeof Se.mtimeMs=="number"?Se.mtimeMs:0,failure:null}),Re(!1),Ge(!1),ce({tone:"info",text:O("status.reloaded")})}catch(ie){ce({tone:"error",text:O("error.load")+": "+St(ie,O)})}},[P,R,O]),Pt=Q.useCallback(async()=>{let ie=Oe.current;if(ie.phase!=="ready"||Ht.current)return;if(typeof P!="string"||P===""){ce({tone:"error",text:O("error.noPath")});return}let Se=ie.text;Ht.current=!0,st(!0),ce(null);try{let ze=await at(T,{sessionId:R,path:P,text:Se,ifMtimeMs:ie.mtimeMs,force:Fe},A),Ee=await ze.json().catch(()=>null),Le=Oe.current;if(ze.status===401||ze.status===403){ce({tone:"error",text:O("error.unauthorized")});return}if(!ze.ok){if((Ee!==null&&typeof Ee=="object"&&typeof Ee.code=="string"?Ee.code:"")==="changed-on-disk"){Ge(!0),ce({tone:"error",text:O("error.changed")});return}Ge(!1),ce({tone:"error",text:Ke(Ee,O,"error.save")});return}yt.current=Se,gt.delete(q(R,P)),Ge(!1),Re(!1);let qe=Le.text!==Se;xe({phase:"ready",text:Le.text,baseline:Se,mtimeMs:Ee!==null&&typeof Ee.mtimeMs=="number"?Ee.mtimeMs:Le.mtimeMs,failure:null}),ce(qe?null:{tone:"info",text:O("toolbar.saved")})}catch(ze){ce({tone:"error",text:O("error.save")+": "+St(ze,O)})}finally{Ht.current=!1,st(!1)}},[P,Fe,R,O]),Vt=Q.useCallback(ie=>{ie.isComposing||ie.keyCode===229||(ie.ctrlKey||ie.metaKey)&&!ie.altKey&&(ie.key==="s"||ie.key==="S")&&(ie.preventDefault(),Pt())},[Pt]),Ct=Q.useCallback(ie=>{let Se=Oe.current;xe(ze=>ze.phase==="ready"?{...ze,text:ie}:{phase:"ready",text:ie,baseline:"",mtimeMs:0,failure:null}),Se.phase==="ready"&&ie===Se.baseline?gt.delete(q(R,P)):gt.set(q(R,P),ie),ce(null)},[P,R]),qt=Q.useCallback(ie=>{Ct(ie.target.value)},[Ct]),Mt=Q.useDeferredValue(be.text),Kt=Q.useMemo(()=>Ne==="source"||Ne==="ir"?"":De(Mt,P),[Mt,P,Ne]);Q.useLayoutEffect(()=>{let ie=Rt.current;ie!==null&&ie.scrollTop!==It.current&&(ie.scrollTop=It.current)},[Kt,Ne]);let jt=(ie,Se)=>F("button",{key:ie,type:"button",className:"dsh-md-chip","aria-pressed":Ne===ie?"true":"false",onClick:()=>{B(ie),pe(ie)}},Se),Qe=F("div",{className:"dsh-md-toolbar"},F("div",{className:"dsh-md-group",role:"group","aria-label":O("viewer.label")},jt("ir",O("toolbar.ir")),jt("split",O("toolbar.split")),jt("source",O("toolbar.source")),jt("preview",O("toolbar.preview"))),F("span",{className:"dsh-md-state","data-dirty":wt?"true":"false"},wt?O("toolbar.dirty"):""),F("button",{type:"button",className:"dsh-md-save","data-primary":"true",disabled:tt||be.phase!=="ready",title:O("toolbar.hint"),onClick:()=>{Pt()}},O(tt?"toolbar.saving":Fe?"toolbar.overwrite":"toolbar.save"))),ht=[];ge!==null&&ht.push(F("div",{key:"notice",className:"dsh-md-notice","data-tone":ge.tone==="error"?"error":"info",role:"status"},F("span",null,ge.text))),Be&&ht.push(F("div",{key:"external",className:"dsh-md-notice","data-tone":"error",role:"status"},F("span",null,O("status.external")),F("button",{type:"button",onClick:()=>{un()}},O(wt?"status.reloadDirty":"status.reload"))));let nn=()=>{I!==void 0&&typeof I.reload=="function"&&I.reload()},rt=V!==void 0&&V.failure!==void 0;if(be.phase==="failure")return F("div",{className:"dsh-md-root",ref:Nt,onKeyDown:Vt},F("style",{key:"dsh-md-css"},Me),F("div",{className:"dsh-md-placeholder",role:"alert"},F("span",null,be.failure),F("button",{type:"button",className:"dsh-md-save",onClick:nn},O("dialog.retry"))));if(be.phase==="loading")return F("div",{className:"dsh-md-root",ref:Nt,onKeyDown:Vt},F("style",{key:"dsh-md-css"},Me),F("div",{className:"dsh-md-placeholder",role:"status"},F("span",null,O(rt?"error.load":"status.loading")),rt?F("button",{type:"button",className:"dsh-md-save",onClick:nn},O("dialog.retry")):null));let Gt=Ne!=="preview",kt=Ne!=="source",Et=Ne==="ir"?F("div",{className:"dsh-md-panes"},F(We,{text:be.text,documentPath:P,onInput:Ct,onSave:()=>{Pt()},onFallback:()=>{B("split"),pe("split"),ce({tone:"error",text:O("status.irFailed")})},t:O})):null,lt=F("div",{className:"dsh-md-panes",style:{flexDirection:nt?"column":"row"}},F("div",{className:"dsh-md-pane",hidden:!Gt},F("textarea",{className:"dsh-md-source",value:be.text,spellCheck:!1,wrap:"soft","aria-label":O("source.label"),onChange:qt})),Gt&&kt?F("div",{key:"divider",className:nt?"dsh-md-split-line dsh-md-split-line-h":"dsh-md-split-line"}):null,F("div",{className:"dsh-md-pane",hidden:!kt},F("div",{className:"dsh-md-preview",ref:tn,tabIndex:-1,role:"document","aria-label":O("preview.label"),onMouseDown:ie=>{ie.currentTarget.focus()},onScroll:ie=>{It.current=ie.currentTarget.scrollTop},dangerouslySetInnerHTML:{__html:Kt===""?"<p></p>":Kt}})));return F("div",{className:"dsh-md-root",ref:Nt,onKeyDown:Vt},F("style",{key:"dsh-md-css"},Me),Qe,...ht,Et===null?lt:Et)}return{inject:["slots","locale","documentPreviews"],apply(x){x.effect(()=>{let O=[];try{if(x.locale!==void 0&&x.locale!==null)try{O.push(x.locale.register(ft,{zh:g,en:b}))}catch(R){console.error("[markdown-inline-editor] dictionary registration failed",R),O.push(x.locale.register(ft,"zh",g)),O.push(x.locale.register(ft,"en",b))}}catch(R){console.error("[markdown-inline-editor] locale registration failed",R)}try{if(x.locale!==void 0&&x.locale!==null&&typeof x.locale.getLocale=="function"){Tt=x.locale.getLocale().active;let R=x.locale.subscribe(()=>{try{Tt=x.locale.getLocale().active}catch(I){console.error("[markdown-inline-editor] locale read failed",I)}});O.push(R)}}catch(R){console.error("[markdown-inline-editor] locale tracking failed",R)}return()=>{for(let R of O)try{R()}catch(I){console.error("[markdown-inline-editor] locale disposal failed",I)}}},"markdown-inline-editor: dictionaries"),x.effect(()=>x.documentPreviews.register({id:ne,extensions:["md","markdown"],priority:"extension",title:()=>je("viewer.label"),loading:"renderer"}),"markdown-inline-editor: Markdown implementation"),x.effect(()=>x.slots.inject("sidebar.right.tab.document",()=>x.slots.register({name:"sidebar.right.tab.document",key:ne,locale:ft},oe)),"markdown-inline-editor: editor body")},__renderMarkdown:De}}});})();
