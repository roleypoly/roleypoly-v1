import * as React from 'react'

const Logotype = ({ fill = 'var(--c-7)', width, height, circleFill = 'var(--c-3)', typeFill, style, className }) => (
  <svg style={style} className={className} viewBox='0 0 1566 298' version='1.1' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <path d='M86.5351562,318.050781 C171.587008,318.050781 240.535156,249.102633 240.535156,164.050781 C240.535156,78.9989298 163.535156,10.0507812 86.5351562,10.0507812 L86.5351562,318.050781 Z M86.5351563,280.050781 C150.600187,280.050781 202.535156,227.668097 202.535156,163.050781 C202.535156,98.4334655 144.535156,46.0507812 86.5351563,46.0507812 C86.5351562,96.9058949 86.5351563,230.260095 86.5351563,280.050781 Z' id='path-1' />
    </defs>
    <g id='Logotype' stroke='none' strokeWidth='1' fill={fill} fillRule='evenodd'>
      <path fill={typeFill || fill} d='M270.888,32.368 L369.096,32.368 C391.752113,32.368 408.743943,37.263951 420.072,47.056 C431.400057,56.848049 437.064,70.4799126 437.064,87.952 C437.064,97.744049 435.624014,105.855968 432.744,112.288 C429.863986,118.720032 426.504019,123.90398 422.664,127.84 C418.823981,131.77602 415.032019,134.607991 411.288,136.336 C407.543981,138.064009 404.808009,139.215997 403.08,139.792 L403.08,140.368 C406.152015,140.752002 409.463982,141.711992 413.016,143.248 C416.568018,144.784008 419.879985,147.231983 422.952,150.592 C426.024015,153.952017 428.56799,158.319973 430.584,163.696 C432.60001,169.072027 433.608,175.79196 433.608,183.856 C433.608,195.95206 434.519991,206.943951 436.344,216.832 C438.168009,226.720049 440.999981,233.775979 444.84,238 L406.248,238 C403.559987,233.583978 401.976002,228.688027 401.496,223.312 C401.015998,217.935973 400.776,212.752025 400.776,207.76 C400.776,198.351953 400.200006,190.240034 399.048,183.424 C397.895994,176.607966 395.784015,170.944023 392.712,166.432 C389.639985,161.919977 385.464026,158.608011 380.184,156.496 C374.903974,154.383989 368.136041,153.328 359.88,153.328 L306.888,153.328 L306.888,238 L270.888,238 L270.888,32.368 Z M306.888,125.968 L365.928,125.968 C377.448058,125.968 386.18397,123.232027 392.136,117.76 C398.08803,112.287973 401.064,104.080055 401.064,93.136 C401.064,86.6079674 400.10401,81.2800206 398.184,77.152 C396.26399,73.0239794 393.624017,69.8080115 390.264,67.504 C386.903983,65.1999885 383.064022,63.6640038 378.744,62.896 C374.423978,62.1279962 369.960023,61.744 365.352,61.744 L306.888,61.744 L306.888,125.968 Z M537.288,242.032 C525.38394,242.032 514.776047,240.06402 505.464,236.128 C496.151953,232.19198 488.280032,226.768035 481.848,219.856 C475.415968,212.943965 470.520017,204.688048 467.16,195.088 C463.799983,185.487952 462.12,174.928058 462.12,163.408 C462.12,152.079943 463.799983,141.616048 467.16,132.016 C470.520017,122.415952 475.415968,114.160035 481.848,107.248 C488.280032,100.335965 496.151953,94.9120197 505.464,90.976 C514.776047,87.0399803 525.38394,85.072 537.288,85.072 C549.19206,85.072 559.799953,87.0399803 569.112,90.976 C578.424047,94.9120197 586.295968,100.335965 592.728,107.248 C599.160032,114.160035 604.055983,122.415952 607.416,132.016 C610.776017,141.616048 612.456,152.079943 612.456,163.408 C612.456,174.928058 610.776017,185.487952 607.416,195.088 C604.055983,204.688048 599.160032,212.943965 592.728,219.856 C586.295968,226.768035 578.424047,232.19198 569.112,236.128 C559.799953,240.06402 549.19206,242.032 537.288,242.032 Z M537.288,216.112 C544.584036,216.112 550.919973,214.576015 556.296,211.504 C561.672027,208.431985 566.087983,204.400025 569.544,199.408 C573.000017,194.415975 575.543992,188.800031 577.176,182.56 C578.808008,176.319969 579.624,169.936033 579.624,163.408 C579.624,157.071968 578.808008,150.736032 577.176,144.4 C575.543992,138.063968 573.000017,132.448024 569.544,127.552 C566.087983,122.655976 561.672027,118.672015 556.296,115.6 C550.919973,112.527985 544.584036,110.992 537.288,110.992 C529.991964,110.992 523.656027,112.527985 518.28,115.6 C512.903973,118.672015 508.488017,122.655976 505.032,127.552 C501.575983,132.448024 499.032008,138.063968 497.4,144.4 C495.767992,150.736032 494.952,157.071968 494.952,163.408 C494.952,169.936033 495.767992,176.319969 497.4,182.56 C499.032008,188.800031 501.575983,194.415975 505.032,199.408 C508.488017,204.400025 512.903973,208.431985 518.28,211.504 C523.656027,214.576015 529.991964,216.112 537.288,216.112 Z M640.68,32.368 L673.512,32.368 L673.512,238 L640.68,238 L640.68,32.368 Z M811.464,150.448 C811.079998,145.263974 809.976009,140.272024 808.152,135.472 C806.327991,130.671976 803.832016,126.496018 800.664,122.944 C797.495984,119.391982 793.656023,116.512011 789.144,114.304 C784.631977,112.095989 779.592028,110.992 774.024,110.992 C768.263971,110.992 763.032024,111.99999 758.328,114.016 C753.623976,116.03201 749.592017,118.815982 746.232,122.368 C742.871983,125.920018 740.18401,130.095976 738.168,134.896 C736.15199,139.696024 735.048001,144.879972 734.856,150.448 L811.464,150.448 Z M734.856,172.048 C734.856,177.808029 735.671992,183.375973 737.304,188.752 C738.936008,194.128027 741.383984,198.83198 744.648,202.864 C747.912016,206.89602 752.039975,210.111988 757.032,212.512 C762.024025,214.912012 767.975965,216.112 774.888,216.112 C784.488048,216.112 792.215971,214.048021 798.072,209.92 C803.928029,205.791979 808.295986,199.600041 811.176,191.344 L842.28,191.344 C840.551991,199.40804 837.576021,206.607968 833.352,212.944 C829.127979,219.280032 824.04003,224.607978 818.088,228.928 C812.13597,233.248022 805.464037,236.511989 798.072,238.72 C790.679963,240.928011 782.95204,242.032 774.888,242.032 C763.175941,242.032 752.808045,240.112019 743.784,236.272 C734.759955,232.431981 727.128031,227.056035 720.888,220.144 C714.647969,213.231965 709.944016,204.976048 706.776,195.376 C703.607984,185.775952 702.024,175.216058 702.024,163.696 C702.024,153.135947 703.703983,143.104048 707.064,133.6 C710.424017,124.095952 715.223969,115.744036 721.464,108.544 C727.704031,101.343964 735.239956,95.6320211 744.072,91.408 C752.904044,87.1839789 762.887944,85.072 774.024,85.072 C785.736059,85.072 796.247953,87.5199755 805.56,92.416 C814.872047,97.3120245 822.599969,103.79196 828.744,111.856 C834.888031,119.92004 839.351986,129.183948 842.136,139.648 C844.920014,150.112052 845.640007,160.911944 844.296,172.048 L734.856,172.048 Z M852.936,89.104 L888.936,89.104 L927.816,200.272 L928.392,200.272 L966.12,89.104 L1000.392,89.104 L942.504,246.064 C939.815987,252.784034 937.176013,259.215969 934.584,265.36 C931.991987,271.504031 928.824019,276.927976 925.08,281.632 C921.335981,286.336024 916.680028,290.079986 911.112,292.864 C905.543972,295.648014 898.440043,297.04 889.8,297.04 C882.119962,297.04 874.536037,296.464006 867.048,295.312 L867.048,267.664 C869.736013,268.048002 872.327988,268.479998 874.824,268.96 C877.320012,269.440002 879.911987,269.68 882.6,269.68 C886.440019,269.68 889.607988,269.200005 892.104,268.24 C894.600012,267.279995 896.663992,265.888009 898.296,264.064 C899.928008,262.239991 901.319994,260.080012 902.472,257.584 C903.624006,255.087988 904.679995,252.208016 905.64,248.944 L909.384,237.424 L852.936,89.104 Z M1019.688,89.104 L1050.792,89.104 L1050.792,109.264 L1051.368,109.264 C1055.97602,100.623957 1062.40796,94.4320187 1070.664,90.688 C1078.92004,86.9439813 1087.84795,85.072 1097.448,85.072 C1109.16006,85.072 1119.38396,87.1359794 1128.12,91.264 C1136.85604,95.3920206 1144.10397,101.055964 1149.864,108.256 C1155.62403,115.456036 1159.94399,123.855952 1162.824,133.456 C1165.70401,143.056048 1167.144,153.327945 1167.144,164.272 C1167.144,174.25605 1165.84801,183.951953 1163.256,193.36 C1160.66399,202.768047 1156.72803,211.071964 1151.448,218.272 C1146.16797,225.472036 1139.49604,231.231978 1131.432,235.552 C1123.36796,239.872022 1113.86405,242.032 1102.92,242.032 C1098.11998,242.032 1093.32002,241.600004 1088.52,240.736 C1083.71998,239.871996 1079.11202,238.48001 1074.696,236.56 C1070.27998,234.63999 1066.20002,232.192015 1062.456,229.216 C1058.71198,226.239985 1055.59201,222.73602 1053.096,218.704 L1052.52,218.704 L1052.52,293.008 L1019.688,293.008 L1019.688,89.104 Z M1134.312,163.696 C1134.312,156.975966 1133.44801,150.448032 1131.72,144.112 C1129.99199,137.775968 1127.40002,132.160024 1123.944,127.264 C1120.48798,122.367976 1116.16803,118.432015 1110.984,115.456 C1105.79997,112.479985 1099.84803,110.992 1093.128,110.992 C1079.30393,110.992 1068.88804,115.791952 1061.88,125.392 C1054.87196,134.992048 1051.368,147.75992 1051.368,163.696 C1051.368,171.184037 1052.27999,178.143968 1054.104,184.576 C1055.92801,191.008032 1058.66398,196.527977 1062.312,201.136 C1065.96002,205.744023 1070.32797,209.391987 1075.416,212.08 C1080.50403,214.768013 1086.40797,216.112 1093.128,216.112 C1100.61604,216.112 1106.95197,214.576015 1112.136,211.504 C1117.32003,208.431985 1121.59198,204.448024 1124.952,199.552 C1128.31202,194.655976 1130.71199,189.088031 1132.152,182.848 C1133.59201,176.607969 1134.312,170.224033 1134.312,163.696 Z M1263.048,242.032 C1251.14394,242.032 1240.53605,240.06402 1231.224,236.128 C1221.91195,232.19198 1214.04003,226.768035 1207.608,219.856 C1201.17597,212.943965 1196.28002,204.688048 1192.92,195.088 C1189.55998,185.487952 1187.88,174.928058 1187.88,163.408 C1187.88,152.079943 1189.55998,141.616048 1192.92,132.016 C1196.28002,122.415952 1201.17597,114.160035 1207.608,107.248 C1214.04003,100.335965 1221.91195,94.9120197 1231.224,90.976 C1240.53605,87.0399803 1251.14394,85.072 1263.048,85.072 C1274.95206,85.072 1285.55995,87.0399803 1294.872,90.976 C1304.18405,94.9120197 1312.05597,100.335965 1318.488,107.248 C1324.92003,114.160035 1329.81598,122.415952 1333.176,132.016 C1336.53602,141.616048 1338.216,152.079943 1338.216,163.408 C1338.216,174.928058 1336.53602,185.487952 1333.176,195.088 C1329.81598,204.688048 1324.92003,212.943965 1318.488,219.856 C1312.05597,226.768035 1304.18405,232.19198 1294.872,236.128 C1285.55995,240.06402 1274.95206,242.032 1263.048,242.032 Z M1263.048,216.112 C1270.34404,216.112 1276.67997,214.576015 1282.056,211.504 C1287.43203,208.431985 1291.84798,204.400025 1295.304,199.408 C1298.76002,194.415975 1301.30399,188.800031 1302.936,182.56 C1304.56801,176.319969 1305.384,169.936033 1305.384,163.408 C1305.384,157.071968 1304.56801,150.736032 1302.936,144.4 C1301.30399,138.063968 1298.76002,132.448024 1295.304,127.552 C1291.84798,122.655976 1287.43203,118.672015 1282.056,115.6 C1276.67997,112.527985 1270.34404,110.992 1263.048,110.992 C1255.75196,110.992 1249.41603,112.527985 1244.04,115.6 C1238.66397,118.672015 1234.24802,122.655976 1230.792,127.552 C1227.33598,132.448024 1224.79201,138.063968 1223.16,144.4 C1221.52799,150.736032 1220.712,157.071968 1220.712,163.408 C1220.712,169.936033 1221.52799,176.319969 1223.16,182.56 C1224.79201,188.800031 1227.33598,194.415975 1230.792,199.408 C1234.24802,204.400025 1238.66397,208.431985 1244.04,211.504 C1249.41603,214.576015 1255.75196,216.112 1263.048,216.112 Z M1366.44,32.368 L1399.272,32.368 L1399.272,238 L1366.44,238 L1366.44,32.368 Z M1418.568,89.104 L1454.568,89.104 L1493.448,200.272 L1494.024,200.272 L1531.752,89.104 L1566.024,89.104 L1508.136,246.064 C1505.44799,252.784034 1502.80801,259.215969 1500.216,265.36 C1497.62399,271.504031 1494.45602,276.927976 1490.712,281.632 C1486.96798,286.336024 1482.31203,290.079986 1476.744,292.864 C1471.17597,295.648014 1464.07204,297.04 1455.432,297.04 C1447.75196,297.04 1440.16804,296.464006 1432.68,295.312 L1432.68,267.664 C1435.36801,268.048002 1437.95999,268.479998 1440.456,268.96 C1442.95201,269.440002 1445.54399,269.68 1448.232,269.68 C1452.07202,269.68 1455.23999,269.200005 1457.736,268.24 C1460.23201,267.279995 1462.29599,265.888009 1463.928,264.064 C1465.56001,262.239991 1466.95199,260.080012 1468.104,257.584 C1469.25601,255.087988 1470.312,252.208016 1471.272,248.944 L1475.016,237.424 L1418.568,89.104 Z' id='Roleypoly' />
      <mask id='mask-2' fill='white'>
        <use href='#path-1' />
      </mask>
      <use id='Oval' fill={circleFill || fill} transform='translate(163.535156, 164.050781) rotate(45.000000) translate(-163.535156, -164.050781) ' href='#path-1' />
    </g>
  </svg>
)

const Logomark = ({ fill = 'var(--c-7)', width, height, circleFill = 'var(--c-3)', typeFill, style, className }) => (
  <svg style={style} className={className} viewBox='0 0 350 350' version='1.1'>
    <defs>
      <path d='M95.5351562,425.050781 C180.587008,425.050781 249.535156,356.102633 249.535156,271.050781 C249.535156,185.99893 172.535156,117.050781 95.5351562,117.050781 L95.5351562,425.050781 Z M95.5351563,387.050781 C159.600187,387.050781 211.535156,334.668097 211.535156,270.050781 C211.535156,205.433466 153.535156,153.050781 95.5351563,153.050781 C95.5351562,203.905895 95.5351563,337.260095 95.5351563,387.050781 Z' id='path-1' />
    </defs>
    <g id='Logomark' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <g id='Group' transform='translate(35.000000, -46.000000)'>
        <path fill={typeFill || fill} d='M21.888,75.368 L120.096,75.368 C142.752113,75.368 159.743943,80.263951 171.072,90.056 C182.400057,99.848049 188.064,113.479913 188.064,130.952 C188.064,140.744049 186.624014,148.855968 183.744,155.288 C180.863986,161.720032 177.504019,166.90398 173.664,170.84 C169.823981,174.77602 166.032019,177.607991 162.288,179.336 C158.543981,181.064009 155.808009,182.215997 154.08,182.792 L154.08,183.368 C157.152015,183.752002 160.463982,184.711992 164.016,186.248 C167.568018,187.784008 170.879985,190.231983 173.952,193.592 C177.024015,196.952017 179.56799,201.319973 181.584,206.696 C183.60001,212.072027 184.608,218.79196 184.608,226.856 C184.608,238.95206 185.519991,249.943951 187.344,259.832 C189.168009,269.720049 191.999981,276.775979 195.84,281 L157.248,281 C154.559987,276.583978 152.976002,271.688027 152.496,266.312 C152.015998,260.935973 151.776,255.752025 151.776,250.76 C151.776,241.351953 151.200006,233.240034 150.048,226.424 C148.895994,219.607966 146.784015,213.944023 143.712,209.432 C140.639985,204.919977 136.464026,201.608011 131.184,199.496 C125.903974,197.383989 119.136041,196.328 110.88,196.328 L57.888,196.328 L57.888,281 L21.888,281 L21.888,75.368 Z M57.888,168.968 L116.928,168.968 C128.448058,168.968 137.18397,166.232027 143.136,160.76 C149.08803,155.287973 152.064,147.080055 152.064,136.136 C152.064,129.607967 151.10401,124.280021 149.184,120.152 C147.26399,116.023979 144.624017,112.808012 141.264,110.504 C137.903983,108.199988 134.064022,106.664004 129.744,105.896 C125.423978,105.127996 120.960023,104.744 116.352,104.744 L57.888,104.744 L57.888,168.968 Z' id='R' />
        <mask id='mask-2' fill='white'>
          <use href='#path-1' />
        </mask>
        <use id='Oval' fill={circleFill || fill} transform='translate(172.535156, 271.050781) rotate(45.000000) translate(-172.535156, -271.050781) ' href='#path-1' />
      </g>
    </g>
  </svg>
)

export default Logotype
export { Logotype, Logomark }
