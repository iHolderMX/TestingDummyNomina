const now = new Date()
const today = now.toISOString().slice(0, 10)

const HE_RATE = 100

const workers = [
  { id: 1, internal_id: 'W-001', qr_code: 'W-001', name: 'Juan Pérez López', role_title: 'Albañil', weekly_salary: 2800, daily_salary: 467,
    contractor_id: 1, active: 1, obra_ids: [1], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '12345678901', rfc: 'PELJ850412ABC', curp: 'PELJ850412HDFRZN09', domicilio: 'Calle Hidalgo #45, Col. Centro, CDMX',
    telefono_emergencia: '5512345678', sbc: 467, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2026-12-15', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [] },
  { id: 2, internal_id: 'W-002', qr_code: 'W-002', name: 'María García Hernández', role_title: 'Ayudante General', weekly_salary: 2100, daily_salary: 350,
    contractor_id: 1, active: 1, obra_ids: [1, 2], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '98765432109', rfc: 'GAHM900215DEF', curp: 'GAHM900215MDFRRR05', domicilio: 'Av. Insurgentes #890, Col. Roma, CDMX',
    telefono_emergencia: '5598765432', sbc: 350, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2026-10-01', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [] },
  { id: 3, internal_id: 'W-003', qr_code: 'W-003', name: 'Carlos Martínez Rodríguez', role_title: 'Plomero', weekly_salary: 3200, daily_salary: 533,
    contractor_id: 2, active: 1, obra_ids: [1], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '11122334455', rfc: 'MARC880730GHI', curp: 'MARC880730HNTRRR08', domicilio: 'Calle Morelos #123, Ecatepec, EDOMEX',
    telefono_emergencia: '5511122233', sbc: 533, registro_patronal: 'RP-002', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-03-01', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [{ fecha_inicio: '2026-05-10', fecha_fin: '2026-05-20', tipo: 'IMSS', justificante: 'Incapacidad por fractura' }] },
  { id: 4, internal_id: 'W-004', qr_code: 'W-004', name: 'Ana Sánchez Cruz', role_title: 'Electricista', weekly_salary: 3500, daily_salary: 583,
    contractor_id: 2, active: 1, obra_ids: [2], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '55667788900', rfc: 'SACA920501JKL', curp: 'SACA920501MDFNZN03', domicilio: 'Blvd. Reforma #555, Col. Juárez, CDMX',
    telefono_emergencia: '5544455566', sbc: 583, registro_patronal: 'RP-002', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2026-08-20', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [] },
  { id: 5, internal_id: 'W-005', qr_code: 'W-005', name: 'José Ramírez Morales', role_title: 'Carpintero', weekly_salary: 3000, daily_salary: 500,
    contractor_id: 1, active: 1, obra_ids: [1], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '99887766554', rfc: 'RAMJ850212MNO', curp: 'RAMJ850212HDFRMR07', domicilio: 'Calle 5 de Mayo #78, Tlalnepantla, EDOMEX',
    telefono_emergencia: '5577788899', sbc: 500, registro_patronal: 'RP-001', tiene_contrato: false,
    ds3_activo: false, ds3_vigencia: null, ds3_norma: null,
    incapacidades: [{ fecha_inicio: '2026-05-20', fecha_fin: '2026-05-22', tipo: 'justificante', justificante: 'Permiso médico un día' }] },
  { id: 6, internal_id: 'W-006', qr_code: 'W-006', name: 'Luis Torres Vega', role_title: 'Soldador', weekly_salary: 3400, daily_salary: 567,
    contractor_id: null, active: 1, obra_ids: [], contractor_name: null,
    nss: '44332211009', rfc: 'TOVL830901PQR', curp: 'TOVL830901HDFRRR00', domicilio: 'Av. Central #234, Naucalpan, EDOMEX',
    telefono_emergencia: '5533344455', sbc: 567, registro_patronal: 'RP-ZZ9', tiene_contrato: false,
    ds3_activo: true, ds3_vigencia: '2026-11-30', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [] },
  { id: 7, internal_id: 'W-007', qr_code: 'W-007', name: 'Mónica Rangel Soto', role_title: 'Arquitecta', weekly_salary: 4500, daily_salary: 750,
    contractor_id: 1, active: 1, obra_ids: [1, 2], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '11223344556', rfc: 'RASM870605STU', curp: 'RASM870605MDFNTN01', domicilio: 'Cerrada del Sol #12, Coyoacán, CDMX',
    telefono_emergencia: '5566677788', sbc: 750, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-06-01', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [] },
  { id: 8, internal_id: 'W-008', qr_code: 'W-008', name: 'Roberto Delgado Núñez', role_title: 'Pintor', weekly_salary: 2500, daily_salary: 417,
    contractor_id: 2, active: 1, obra_ids: [2], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '77889900112', rfc: 'DENR790412VWX', curp: 'DENR790412HDFLZB06', domicilio: 'Calle Independencia #67, Iztapalapa, CDMX',
    telefono_emergencia: '5599900011', sbc: 417, registro_patronal: 'RP-002', tiene_contrato: false,
    ds3_activo: true, ds3_vigencia: '2026-09-15', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [] },
  { id: 9, internal_id: 'W-009', qr_code: 'W-009', name: 'Laura Mendoza Ortiz', role_title: 'Supervisora', weekly_salary: 4200, daily_salary: 700,
    contractor_id: null, active: 1, obra_ids: [1], contractor_name: null,
    nss: '66554433221', rfc: 'MEOL921110YZA', curp: 'MEOL921110MDFNRR04', domicilio: 'Av. Universidad #901, Benito Juárez, CDMX',
    telefono_emergencia: '5522233344', sbc: 700, registro_patronal: 'RP-ZZ9', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-01-20', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [] },
  { id: 10, internal_id: 'W-010', qr_code: 'W-010', name: 'Pedro Castillo Silva', role_title: 'Ayudante General', weekly_salary: 2000, daily_salary: 333,
    contractor_id: 1, active: 0, obra_ids: [1], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '88990011223', rfc: 'CASP851010BCD', curp: 'CASP851010HDFSLD02', domicilio: 'Privada del Río #45, Nezahualcóyotl, EDOMEX',
    telefono_emergencia: '5511100099', sbc: 333, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: false, ds3_vigencia: null, ds3_norma: null,
    incapacidades: [], fecha_baja: '2026-05-15', imss_post_baja: true, infonavit_post_baja: true },
  { id: 11, internal_id: 'W-011', qr_code: 'W-011', name: 'Fernando Herrera Díaz', role_title: 'Maestro Albañil', weekly_salary: 3600, daily_salary: 600,
    contractor_id: 1, active: 1, obra_ids: [1], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '22334455667', rfc: 'HEDF820315JKL', curp: 'HEDF820315HDFRZN01', domicilio: 'Calle 16 de Sept #23, Azcapotzalco, CDMX',
    telefono_emergencia: '5512340001', sbc: 600, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-02-01', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 12, internal_id: 'W-012', qr_code: 'W-012', name: 'Gabriela López Ruiz', role_title: 'Ayudante General', weekly_salary: 2100, daily_salary: 350,
    contractor_id: 1, active: 1, obra_ids: [2], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '33445566778', rfc: 'LORG910420MNO', curp: 'LORG910420MDFRZN02', domicilio: 'Cerrada Norte #7, Gustavo A. Madero, CDMX',
    telefono_emergencia: '5512340002', sbc: 350, registro_patronal: 'RP-001', tiene_contrato: false,
    ds3_activo: true, ds3_vigencia: '2026-07-15', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 13, internal_id: 'W-013', qr_code: 'W-013', name: 'Ricardo Mejía Flores', role_title: 'Fierrero', weekly_salary: 3100, daily_salary: 517,
    contractor_id: 2, active: 1, obra_ids: [1, 2], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '44556677889', rfc: 'MEFR860612PQR', curp: 'MEFR860612HDFLRR03', domicilio: 'Av. Tláhuac #890, Iztapalapa, CDMX',
    telefono_emergencia: '5512340003', sbc: 517, registro_patronal: 'RP-002', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-04-10', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 14, internal_id: 'W-014', qr_code: 'W-014', name: 'Sandra Vega Campos', role_title: 'Almacenista', weekly_salary: 2400, daily_salary: 400,
    contractor_id: 1, active: 1, obra_ids: [1], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '55667788990', rfc: 'VECS900808STU', curp: 'VECS900808MDFGMN04', domicilio: 'Calle Sur #56, Coyoacán, CDMX',
    telefono_emergencia: '5512340004', sbc: 400, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2026-11-20', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 15, internal_id: 'W-015', qr_code: 'W-015', name: 'Héctor Núñez Bautista', role_title: 'Operador Excavadora', weekly_salary: 5000, daily_salary: 833,
    contractor_id: 2, active: 1, obra_ids: [2], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '66778899001', rfc: 'NUBH780211VWX', curp: 'NUBH780211HDFTZC05', domicilio: 'Av. Constituyentes #301, Miguel Hidalgo, CDMX',
    telefono_emergencia: '5512340005', sbc: 833, registro_patronal: 'RP-002', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-01-15', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 16, internal_id: 'W-016', qr_code: 'W-016', name: 'Patricia Ochoa Medina', role_title: 'Topógrafa', weekly_salary: 4500, daily_salary: 750,
    contractor_id: null, active: 1, obra_ids: [1, 2], contractor_name: null,
    nss: '77889900123', rfc: 'OEMP880315YZA', curp: 'OEMP880315MDFCDR06', domicilio: 'Blvd. Puerto Aéreo #78, Venustiano Carranza, CDMX',
    telefono_emergencia: '5512340006', sbc: 750, registro_patronal: 'RP-ZZ9', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-05-01', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 17, internal_id: 'W-017', qr_code: 'W-017', name: 'Jorge Rivera Hernández', role_title: 'Yesero', weekly_salary: 2700, daily_salary: 450,
    contractor_id: 1, active: 1, obra_ids: [1], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '88990011234', rfc: 'RIHJ820801BCD', curp: 'RIHJ820801HDFVRR07', domicilio: 'Calle Norte 18 #12, Cuauhtémoc, CDMX',
    telefono_emergencia: '5512340007', sbc: 450, registro_patronal: 'RP-001', tiene_contrato: false,
    ds3_activo: false, ds3_vigencia: null, ds3_norma: null, incapacidades: [] },
  { id: 18, internal_id: 'W-018', qr_code: 'W-018', name: 'Alejandro Dávila Ríos', role_title: 'Soldador', weekly_salary: 3500, daily_salary: 583,
    contractor_id: 2, active: 1, obra_ids: [2], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '99001122345', rfc: 'DARA850520EFG', curp: 'DARA850520HDFVLR08', domicilio: 'Privada Insurgentes #89, Álvaro Obregón, CDMX',
    telefono_emergencia: '5512340008', sbc: 583, registro_patronal: 'RP-002', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2026-10-10', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 19, internal_id: 'W-019', qr_code: 'W-019', name: 'Norma Tapia Galván', role_title: 'Veladora / Vigilante', weekly_salary: 1900, daily_salary: 317,
    contractor_id: 1, active: 1, obra_ids: [1, 2], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '00112233456', rfc: 'TAGN830702HIJ', curp: 'TAGN830702MDFPRR09', domicilio: 'Av. Ermita #1500, Iztapalapa, CDMX',
    telefono_emergencia: '5512340009', sbc: 317, registro_patronal: 'RP-001', tiene_contrato: false,
    ds3_activo: true, ds3_vigencia: '2026-06-30', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [{ fecha_inicio: '2026-05-01', fecha_fin: '2026-05-05', tipo: 'justificante', justificante: 'Permiso familiar' }] },
  { id: 20, internal_id: 'W-020', qr_code: 'W-020', name: 'Eduardo Salinas Ponce', role_title: 'Yesero', weekly_salary: 2700, daily_salary: 450,
    contractor_id: 1, active: 1, obra_ids: [2], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '11223344567', rfc: 'SAPE860811KLM', curp: 'SAPE860811HDFLRR10', domicilio: 'Cerrada Oriente #34, Iztacalco, CDMX',
    telefono_emergencia: '5512340010', sbc: 450, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-03-15', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 21, internal_id: 'W-021', qr_code: 'W-021', name: 'Claudia Juárez Álvarez', role_title: 'Ayudante de Pintor', weekly_salary: 1800, daily_salary: 300,
    contractor_id: 2, active: 1, obra_ids: [2], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '22334455678', rfc: 'JUAC930503NOP', curp: 'JUAC930503MDFRLR11', domicilio: 'Av. Oceanía #210, Venustiano Carranza, CDMX',
    telefono_emergencia: '5512340011', sbc: 300, registro_patronal: 'RP-002', tiene_contrato: false,
    ds3_activo: true, ds3_vigencia: '2026-09-01', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 22, internal_id: 'W-022', qr_code: 'W-022', name: 'Víctor Manuel Córdova', role_title: 'Ingeniero Residente', weekly_salary: 6000, daily_salary: 1000,
    contractor_id: null, active: 1, obra_ids: [1], contractor_name: null,
    nss: '33445566789', rfc: 'COMV900101QRS', curp: 'COMV900101HDFRRR12', domicilio: 'Paseo de la Reforma #500, Cuauhtémoc, CDMX',
    telefono_emergencia: '5512340012', sbc: 1000, registro_patronal: 'RP-ZZ9', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-08-01', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 23, internal_id: 'W-023', qr_code: 'W-023', name: 'Diana Ruiz Montoya', role_title: 'Cadena de Custodia', weekly_salary: 2800, daily_salary: 467,
    contractor_id: 1, active: 1, obra_ids: [1], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '44556677890', rfc: 'RUMD891215TUV', curp: 'RUMD891215MDFZNR13', domicilio: 'Calle 20 de Nov #89, Benito Juárez, CDMX',
    telefono_emergencia: '5512340013', sbc: 467, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2026-08-28', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 24, internal_id: 'W-024', qr_code: 'W-024', name: 'Oscar Pineda León', role_title: 'Tablarroquero', weekly_salary: 2900, daily_salary: 483,
    contractor_id: 2, active: 1, obra_ids: [1], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '55667788901', rfc: 'PILO881020WXY', curp: 'PILO881020HDFNNR14', domicilio: 'Av. Revolución #123, Miguel Hidalgo, CDMX',
    telefono_emergencia: '5512340014', sbc: 483, registro_patronal: 'RP-002', tiene_contrato: false,
    ds3_activo: false, ds3_vigencia: null, ds3_norma: null, incapacidades: [] },
  { id: 25, internal_id: 'W-025', qr_code: 'W-025', name: 'Alma Rivas Contreras', role_title: 'Enfermera Industrial', weekly_salary: 3800, daily_salary: 633,
    contractor_id: null, active: 1, obra_ids: [1, 2], contractor_name: null,
    nss: '66778899012', rfc: 'RICA850430ZAB', curp: 'RICA850430MDFVMR15', domicilio: 'Av. Chapultepec #67, Cuauhtémoc, CDMX',
    telefono_emergencia: '5512340015', sbc: 633, registro_patronal: 'RP-ZZ9', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-04-20', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 26, internal_id: 'W-026', qr_code: 'W-026', name: 'Raúl Estrada Juárez', role_title: 'Operador Grúa', weekly_salary: 5200, daily_salary: 867,
    contractor_id: 2, active: 1, obra_ids: [2], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '77889900134', rfc: 'ESJR920701CDE', curp: 'ESJR920701HDFSRL16', domicilio: 'Cerrada del Bosque #12, Cuajimalpa, CDMX',
    telefono_emergencia: '5512340016', sbc: 867, registro_patronal: 'RP-002', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2026-12-01', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 27, internal_id: 'W-027', qr_code: 'W-027', name: 'Berenice Cuevas León', role_title: 'Limpieza de Obra', weekly_salary: 1600, daily_salary: 267,
    contractor_id: 1, active: 1, obra_ids: [1], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '88990011245', rfc: 'CULB910515FGH', curp: 'CULB910515MDFVNR17', domicilio: 'Calle Hidalgo #12, Milpa Alta, CDMX',
    telefono_emergencia: '5512340017', sbc: 267, registro_patronal: 'RP-001', tiene_contrato: false,
    ds3_activo: true, ds3_vigencia: '2026-10-20', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 28, internal_id: 'W-028', qr_code: 'W-028', name: 'Miguel Ángel Vargas', role_title: 'Cabo de Obra', weekly_salary: 3300, daily_salary: 550,
    contractor_id: 1, active: 1, obra_ids: [1, 2], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '99001122356', rfc: 'VAAM960201IJK', curp: 'VAAM960201HDFRGR18', domicilio: 'Av. División del Norte #789, Coyoacán, CDMX',
    telefono_emergencia: '5512340018', sbc: 550, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-07-10', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
  { id: 29, internal_id: 'W-029', qr_code: 'W-029', name: 'Erika Chávez Delgado', role_title: 'Impermeabilizadora', weekly_salary: 2500, daily_salary: 417,
    contractor_id: 2, active: 0, obra_ids: [1], contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.',
    nss: '00112233467', rfc: 'CADE880310LMN', curp: 'CADE880310MDFHLR19', domicilio: 'Av. Universidad #300, Álvaro Obregón, CDMX',
    telefono_emergencia: '5512340019', sbc: 417, registro_patronal: 'RP-002', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2026-05-30', ds3_norma: 'NOM-031-STPS-2011',
    incapacidades: [], fecha_baja: '2026-05-20', imss_post_baja: true, infonavit_post_baja: false },
  { id: 30, internal_id: 'W-030', qr_code: 'W-030', name: 'Francisco Téllez Ocampo', role_title: 'Albañil', weekly_salary: 2800, daily_salary: 467,
    contractor_id: 1, active: 1, obra_ids: [1], contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.',
    nss: '11223344578', rfc: 'TEOF830405OPQ', curp: 'TEOF830405HDFLCR20', domicilio: 'Calle Sur 2 #34, Xochimilco, CDMX',
    telefono_emergencia: '5512340020', sbc: 467, registro_patronal: 'RP-001', tiene_contrato: true,
    ds3_activo: true, ds3_vigencia: '2027-03-01', ds3_norma: 'NOM-031-STPS-2011', incapacidades: [] },
]

const worksites = [
  { id: 1, name: 'Edificio Corporativo Reforma', location: 'Av. Paseo de la Reforma #342, Col. Juárez', active: 1, worker_count: 20,
    numero_contrato: 'CTO-2026-001', cliente: 'Grupo Inmobiliario Reforma S.A.',
    fianza_monto: 5000000, fianza_vigencia: '2027-03-01',
    addendums: [{ fecha: '2026-04-01', tipo: 'ampliacion', monto_original: 5000000, monto_nuevo: 6500000, motivo: 'Extras en fachada' }],
    monto_contrato: 6500000, monto_imss: 320000, monto_infonavit: 95000, monto_mano_obra: 1800000, numero_ziroc: 'ZRG-2026-001' },
  { id: 2, name: 'Residencial Las Lomas', location: 'Blvd. Adolfo López Mateos #120, Col. Lomas de Chapultepec', active: 1, worker_count: 10,
    numero_contrato: 'CTO-2026-002', cliente: 'Desarrollos Las Lomas S.A.',
    fianza_monto: 3500000, fianza_vigencia: '2026-12-01',
    addendums: [],
    monto_contrato: 3500000, monto_imss: 210000, monto_infonavit: 62000, monto_mano_obra: 1200000, numero_ziroc: 'ZRG-2026-002' },
]

const contractors = [
  { id: 1, name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.', contact: 'Lic. Eduardo Gómez - 555-1000', active: 1,
    obras_ids: [1, 2], worker_count: 15,
    casas: [{ direccion: 'Calle Pensil #34, Col. Pensil, CDMX', costo_mensual: 8000 },
            { direccion: 'Av. Observatorio #56, Col. Tacubaya, CDMX', costo_mensual: 10000 }],
    viaticos_monto: 3500, viaticos_periodo: 'trimestral',
    prestamo_herramienta: { monto_total: 25000, saldo_pendiente: 15000, cuota_semanal: 500 } },
  { id: 2, name: 'Instalaciones y Servicios Técnicos Integrales S.A.', contact: 'Ing. Patricia Herrera - 555-2000', active: 1,
    obras_ids: [1, 2], worker_count: 8,
    casas: [{ direccion: 'Calle Ferrocarril #12, Col. Morelos, CDMX', costo_mensual: 7000 }],
    viaticos_monto: 2500, viaticos_periodo: 'trimestral',
    prestamo_herramienta: null },
]

const dates = ['2026-05-21','2026-05-22','2026-05-23','2026-05-24','2026-05-25','2026-05-26','2026-05-27']
const attendanceRecords = []
const statuses = ['presente','presente','presente','presente','presente','presente','presente','presente','presente','falta','retardo','justificante']

for (const d of dates) {
  for (const w of workers) {
    if (w.active !== 1) continue
    if (w.incapacidades && w.incapacidades.some(inc => d >= inc.fecha_inicio && d <= inc.fecha_fin)) {
      attendanceRecords.push({ id: attendanceRecords.length+1, worker_id: w.id, worker_name: w.name, role_title: w.role_title, date: d, check_in: null, status: 'incapacidad', worksite_id: w.obra_ids[0] ?? 1, worker_internal_id: w.internal_id })
      continue
    }
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const entry = status === 'retardo' ? '07:35' : status === 'falta' ? null : (status === 'justificante' ? '08:00' : '07:00')
    const obraId = status === 'falta' ? null : (w.obra_ids.length > 0 ? w.obra_ids[Math.floor(Math.random() * w.obra_ids.length)] : null)
    attendanceRecords.push({ id: attendanceRecords.length+1, worker_id: w.id, worker_name: w.name, role_title: w.role_title, date: d, check_in: entry, status, worksite_id: obraId, worker_internal_id: w.internal_id })
  }
}

const attendanceSummary = workers.filter(w => w.active === 1).map(w => {
  const recs = attendanceRecords.filter(r => r.worker_id === w.id)
  const obrasUnicas = [...new Set(recs.filter(r => r.worksite_id).map(r => r.worksite_id))]
  const dias = recs.length
  const asistencias = recs.filter(r => r.status === 'presente' || r.status === 'justificante').length
  const retardos = recs.filter(r => r.status === 'retardo').length
  const faltas = recs.filter(r => r.status === 'falta').length
  const incapacidad = recs.filter(r => r.status === 'incapacidad').length
  const dias_efectivos = asistencias + (retardos * 0.5)
  return { ...w, dias, asistencias, retardos, faltas, incapacidad, dias_efectivos, dias_asistidos: asistencias, obras_ids: w.obra_ids, obrasUnicas }
})

const payroll = workers.filter(w => w.active === 1).map(w => {
  const sum = attendanceSummary.find(s => s.id === w.id)
  const diasEfectivos = sum ? sum.dias_efectivos : 6
  const hrExtra = Math.floor(Math.random() * 6)
  const basePay = Math.round(w.daily_salary * diasEfectivos)
  const overtimePay = hrExtra * HE_RATE
  const foodAllowance = Math.round(Math.random() * 300)
  const travelAllowance = Math.round(Math.random() * 500)
  const bonus = Math.round(Math.random() * 400)
  const imssRate = 0.015
  const infonavitRate = 0.05
  const imssDed = Math.round(w.sbc * 7 * imssRate)
  const infonavitDed = Math.round(w.sbc * 7 * infonavitRate)
  const loanDed = Math.round(Math.random() * 200)
  const totalDev = basePay + overtimePay + foodAllowance + travelAllowance + bonus
  const totalDed = loanDed + imssDed + infonavitDed
  const periodStart = '2026-05-21', periodEnd = '2026-05-27'
  const worksiteName = w.obra_ids.length > 0 ? worksites.find(ws => ws.id === w.obra_ids[0])?.name : 'Sin obra'
  return {
    id: w.id, worker_id: w.id, worker_name: w.name, role_title: w.role_title, weekly_salary: w.weekly_salary, daily_salary: w.daily_salary, sbc: w.sbc,
    period_start: periodStart, period_end: periodEnd, worksite_name: worksiteName,
    days_attended_jue_sab: Math.min(diasEfectivos, 6), days_attended_lun_mie: Math.max(0, diasEfectivos - 3),
    overtime_hours: hrExtra, overtime_pay: overtimePay,
    base_pay: basePay, food_allowance: foodAllowance, travel_allowance: travelAllowance, bonus,
    loan_deduction: loanDed, imss_deduction: imssDed, infonavit_deduction: infonavitDed,
    total_devengado: totalDev, total_deducciones: totalDed, total_neto: totalDev - totalDed,
    status: 'calculated', contractor_name: w.contractor_name,
    bono_puntualidad: sum && sum.retardos === 0 ? 250 : 0,
  }
})

const auditLogs = [
  { id: 1, created_at: '2026-05-22T10:30:00', user_name: 'admin', entity_type: 'payroll', field_name: 'bonus', old_value: '0', new_value: '300', reason: 'Bono aprobado por jefe de obra', period: '2026-05-21 al 2026-05-27' },
  { id: 2, created_at: '2026-05-23T08:15:00', user_name: 'encargado', entity_type: 'attendance', field_name: 'status', old_value: 'falta', new_value: 'justificante', reason: 'Presentó justificante médico', period: '2026-05-23' },
  { id: 3, created_at: '2026-05-24T14:00:00', user_name: 'admin', entity_type: 'worker', field_name: 'active', old_value: '1', new_value: '0', reason: 'Baja voluntaria del trabajador', period: '-' },
  { id: 4, created_at: '2026-05-25T09:45:00', user_name: 'admin', entity_type: 'payroll', field_name: 'imss_deduction', old_value: '55', new_value: '65', reason: 'Actualización SBC por nuevo salario', period: '2026-05-21 al 2026-05-27' },
]

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms))

export const mockApi = {
  async login(user, pass) {
    await delay()
    if (user === 'admin' && pass === 'admin123') return { token: 'demo-token-admin', user: { name: 'Admin Demo', role: 'admin' } }
    if (user === 'encargado' && pass === 'obra123') return { token: 'demo-token-enc', user: { name: 'Encargado Demo', role: 'encargado' } }
    throw new Error('Usuario o contraseña incorrectos')
  },
  async getMe() { await delay(); return { name: 'Admin Demo', role: 'admin' } },

  async getWorkers() { await delay(); return workers.map(w => ({...w})) },
  async getWorker(id) { await delay(); const w = workers.find(x => x.id === Number(id)); if (!w) throw new Error('No encontrado'); return {...w} },
  async createWorker(data) { await delay(); const nw = { id: workers.length+1, internal_id: `W-${String(workers.length+1).padStart(3,'0')}`, ...data, active: 1 }; workers.push(nw); return nw },
  async updateWorker(id, data) { await delay(); const idx = workers.findIndex(w => w.id === Number(id)); if (idx === -1) throw new Error('No encontrado'); workers[idx] = {...workers[idx], ...data}; return workers[idx] },

  async getWorksites() { await delay(); return worksites.map(ws => ({...ws})) },
  async getWorksite(id) { await delay(); const ws = worksites.find(x => x.id === Number(id)); if (!ws) throw new Error('No encontrado'); return {...ws} },

  async getContractors() { await delay(); return contractors.map(c => ({...c})) },
  async getContractor(id) { await delay(); const c = contractors.find(x => x.id === Number(id)); if (!c) throw new Error('No encontrado'); return {...c} },

  async getAttendances() { await delay(); return attendanceRecords.map(r => ({...r})) },
  async getAttendanceSummary() { await delay(); return attendanceSummary.map(s => ({...s})) },

  async scanQR(qr_code, worksite_id) {
    await delay(500)
    const worker = workers.find(w => w.qr_code === qr_code)
    if (!worker) throw new Error('Trabajador no encontrado')
    const existing = attendanceRecords.find(r => r.worker_id === worker.id && r.date === today)
    if (existing && (existing.status === 'presente' || existing.status === 'retardo')) {
      return { status: 'duplicate', message: 'El trabajador ya registró asistencia hoy' }
    }
    const hora = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0')
    const entradaHora = 7, entradaMin = 0
    const llegoTarde = now.getHours() > entradaHora || (now.getHours() === entradaHora && now.getMinutes() > entradaMin)
    const status = llegoTarde ? 'retardo' : 'presente'
    const rec = {
      id: attendanceRecords.length + 1, worker_id: worker.id, worker_name: worker.name, worker_internal_id: worker.internal_id,
      role_title: worker.role_title, date: today, check_in: hora, status, worksite_id: Number(worksite_id),
    }
    attendanceRecords.push(rec)
    return { status: 'ok', worker_name: worker.name, attendance: { date: today, entry_time: hora, status } }
  },

  async updateAttendance(id, data) {
    await delay()
    const idx = attendanceRecords.findIndex(r => r.id === Number(id))
    if (idx === -1) throw new Error('No encontrado')
    attendanceRecords[idx] = { ...attendanceRecords[idx], ...data }
    return attendanceRecords[idx]
  },

  async getPayroll() { await delay(); return payroll.map(p => ({...p})) },
  async calculatePayroll() { await delay(); return payroll.map(p => ({...p})) },
  async savePayroll() { await delay(); return { ok: true } },

  async correctPayroll(id, data) {
    await delay()
    const idx = payroll.findIndex(p => p.worker_id === Number(id))
    if (idx === -1) throw new Error('No encontrado')
    const original = { ...payroll[idx] }
    const correction = { ...payroll[idx], ...data }
    correction.total_devengado = (data.base_pay ?? payroll[idx].base_pay) +
      (data.overtime_pay ?? payroll[idx].overtime_pay) +
      (data.food_allowance ?? payroll[idx].food_allowance) +
      (data.travel_allowance ?? payroll[idx].travel_allowance) +
      (data.bonus ?? payroll[idx].bonus) +
      (data.bono_puntualidad ?? payroll[idx].bono_puntualidad ?? 0)
    correction.total_deducciones = (data.loan_deduction ?? payroll[idx].loan_deduction) +
      (data.imss_deduction ?? payroll[idx].imss_deduction) +
      (data.infonavit_deduction ?? payroll[idx].infonavit_deduction)
    correction.total_neto = correction.total_devengado - correction.total_deducciones
    correction.status = 'corrected'
    payroll[idx] = correction
    const keys = Object.keys(data).filter(k => k !== 'reason')
    auditLogs.unshift({
      id: auditLogs.length + 1, created_at: new Date().toISOString(), user_name: 'admin',
      entity_type: 'payroll', field_name: keys[0] || 'total_neto',
      old_value: String(original[keys[0]] ?? '-'), new_value: String(data[keys[0]] ?? '-'),
      reason: data.reason || 'Sin motivo', period: `${payroll[idx].period_start} al ${payroll[idx].period_end}`,
    })
    return correction
  },

  async getAuditLog(filters = {}) {
    await delay()
    let result = [...auditLogs]
    if (filters.entity_type) result = result.filter(l => l.entity_type === filters.entity_type)
    return result
  },

  async getContractorsByWorksites() {
    await delay()
    return [
      { contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.', worksite_name: 'Edificio Corporativo Reforma', worker_count: 3 },
      { contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.', worksite_name: 'Edificio Corporativo Reforma', worker_count: 2 },
      { contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.', worksite_name: 'Residencial Las Lomas', worker_count: 2 },
      { contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.', worksite_name: 'Residencial Las Lomas', worker_count: 2 },
      { contractor_name: 'Sin contratista', worksite_name: 'Edificio Corporativo Reforma', worker_count: 2 },
      { contractor_name: 'Sin contratista', worksite_name: 'Residencial Las Lomas', worker_count: 0 },
    ]
  },

  async getTopOvertime() {
    await delay()
    return payroll.map(p => ({ ...p })).sort((a, b) => b.overtime_hours - a.overtime_hours).slice(0, 5)
  },

  async getTopNetPay() {
    await delay()
    return payroll.map(p => ({ ...p })).sort((a, b) => b.total_neto - a.total_neto).slice(0, 5)
  },

  async getWorksiteSummary() {
    await delay()
    return worksites.map(ws => {
      const wsPayroll = payroll.filter(p => p.worksite_name === ws.name)
      return {
        name: ws.name, worker_count: ws.worker_count,
        total_devengado: wsPayroll.reduce((s, p) => s + p.total_devengado, 0),
        total_deducciones: wsPayroll.reduce((s, p) => s + p.total_deducciones, 0),
        total_neto: wsPayroll.reduce((s, p) => s + p.total_neto, 0),
        monto_contrato: ws.monto_contrato, monto_mano_obra: ws.monto_mano_obra,
        monto_imss: ws.monto_imss, monto_infonavit: ws.monto_infonavit,
      }
    })
  },

  async getContractorPayrollSummary() {
    await delay()
    const contractorsSet = [...new Set(payroll.map(p => p.contractor_name).filter(Boolean))]
    return [
      ...contractorsSet.map(cn => {
        const cp = payroll.filter(p => p.contractor_name === cn)
        const cont = contractors.find(c => c.name === cn)
        return {
          contractor_name: cn, worker_count: cp.length,
          total_devengado: cp.reduce((s, p) => s + p.total_devengado, 0),
          total_deducciones: cp.reduce((s, p) => s + p.total_deducciones, 0),
          total_neto: cp.reduce((s, p) => s + p.total_neto, 0),
          costo_casas: cont?.casas?.reduce((s, c) => s + c.costo_mensual, 0) / 4 || 0,
          viaticos: cont?.viaticos_monto || 0,
          prestamo_herramienta: cont?.prestamo_herramienta?.cuota_semanal || 0,
        }
      }),
    ]
  },

  async getDailyAttendanceSummary() {
    await delay()
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort()
    return allDates.map(d => {
      const recs = attendanceRecords.filter(r => r.date === d)
      return {
        date: d, total: recs.length,
        presentes: recs.filter(r => r.status === 'presente').length,
        faltas: recs.filter(r => r.status === 'falta').length,
        retardos: recs.filter(r => r.status === 'retardo').length,
        justificantes: recs.filter(r => r.status === 'justificante').length,
        incapacidad: recs.filter(r => r.status === 'incapacidad').length,
      }
    })
  },

  async getFuerzaTrabajo() {
    await delay()
    const totalSemanal = payroll.reduce((s, p) => s + p.total_devengado, 0)
    const totalNeto = payroll.reduce((s, p) => s + p.total_neto, 0)
    const totalIMSS = payroll.reduce((s, p) => s + p.imss_deduction, 0)
    const totalInfonavit = payroll.reduce((s, p) => s + p.infonavit_deduction, 0)
    const imssPostBaja = workers.filter(w => w.active === 0 && w.imss_post_baja).reduce((s, w) => s + Math.round(w.sbc * 7 * 0.015), 0)
    const infonavitPostBaja = workers.filter(w => w.active === 0 && w.infonavit_post_baja).reduce((s, w) => s + Math.round(w.sbc * 7 * 0.05), 0)
    return {
      fecha: today, total_trabajadores_activos: workers.filter(w => w.active === 1).length,
      total_trabajadores_baja: workers.filter(w => w.active === 0).length,
      costo_semanal_devengado: totalSemanal, costo_semanal_neto: totalNeto,
      imss_semanal: totalIMSS, infonavit_semanal: totalInfonavit,
      imss_post_baja: imssPostBaja, infonavit_post_baja: infonavitPostBaja,
      costo_diario: Math.round(totalSemanal / 6), costo_mensual: Math.round(totalSemanal * 4.33),
      proyeccion_siguiente_mes: Math.round(totalSemanal * 4.33 * 1.05),
    }
  },

  async getReporteGeneral() {
    await delay()
    return {
      periodo: '2026-05-21 al 2026-05-27',
      trabajadores: attendanceSummary.map(s => ({
        name: s.name, internal_id: s.internal_id, role_title: s.role_title, weekly_salary: s.weekly_salary,
        dias_asistidos: s.asistencias, retardos: s.retardos, faltas: s.faltas, incapacidad: s.incapacidad,
        dias_efectivos: s.dias_efectivos, obra_ids: s.obra_ids,
      })),
      nomina: payroll.map(p => ({
        worker_name: p.worker_name, total_devengado: p.total_devengado, total_deducciones: p.total_deducciones,
        total_neto: p.total_neto, bono_puntualidad: p.bono_puntualidad,
      })),
      resumen: {
        total_devengado: payroll.reduce((s, p) => s + p.total_devengado, 0),
        total_deducciones: payroll.reduce((s, p) => s + p.total_deducciones, 0),
        total_neto: payroll.reduce((s, p) => s + p.total_neto, 0),
        total_imss: payroll.reduce((s, p) => s + p.imss_deduction, 0),
        total_infonavit: payroll.reduce((s, p) => s + p.infonavit_deduction, 0),
      },
    }
  },

  async getCertificacionesDS3() {
    await delay()
    return workers.map(w => ({
      worker_id: w.id, worker_name: w.name, internal_id: w.internal_id,
      ds3_activo: w.ds3_activo, ds3_vigencia: w.ds3_vigencia, ds3_norma: w.ds3_norma,
      dias_restantes: w.ds3_vigencia ? Math.ceil((new Date(w.ds3_vigencia) - now) / (1000 * 60 * 60 * 24)) : null,
      estado: !w.ds3_activo ? 'pendiente' : (w.ds3_vigencia && new Date(w.ds3_vigencia) < now ? 'vencido' : (w.ds3_vigencia && new Date(w.ds3_vigencia) - now < 30*24*60*60*1000 ? 'por_vencer' : 'vigente')),
    }))
  },

  async getRbacData() {
    await delay()
    return {
      roles: [
        { key: 'admin', label: 'Administrador', description: 'Acceso completo a todos los módulos. Puede crear, editar, eliminar, corregir y auditar.',
          groups: ['gestion_trabajadores','gestion_obras','gestion_asistencia','gestion_nomina','reportes','seguridad','certificaciones'] },
        { key: 'encargado', label: 'Encargado de Obra', description: 'Gestión limitada a su obra asignada. Registra asistencia, ve trabajadores de su obra.',
          groups: ['gestion_trabajadores','gestion_obras','gestion_asistencia','gestion_nomina','reportes','certificaciones'] },
        { key: 'nomina', label: 'Encargado de Nómina', description: 'Calcula, corrige y cierra nóminas. Acceso a reportes financieros.',
          groups: ['gestion_trabajadores','gestion_obras','gestion_asistencia','gestion_nomina','reportes','certificaciones'] },
        { key: 'contratista', label: 'Contratista', description: 'Consulta reportes de sus trabajadores asignados. Sin permisos de escritura.',
          groups: ['gestion_trabajadores','gestion_nomina','reportes'] },
      ],
      users: [
        { id: 1, name: 'Admin Demo', email: 'admin@constructora.com', role: 'admin', active: true, filtro: 'Global' },
        { id: 2, name: 'Encargado Demo', email: 'encargado@constructora.com', role: 'encargado', active: true, filtro: 'Obra 1: Edif. Corporativo Reforma' },
        { id: 3, name: 'Personal Nómina', email: 'nomina@constructora.com', role: 'nomina', active: true, filtro: 'Global' },
        { id: 4, name: 'Contratista Ext.', email: 'contratista@externo.com', role: 'contratista', active: true, filtro: 'Contratista: Construcciones y Edif. Prof.' },
      ],
      groups: [
        { key: 'gestion_trabajadores', label: 'Gestión de Trabajadores', color: 'bg-blue-50 text-blue-700 border-blue-200', permissions: ['workers.read','workers.write','workers.delete'] },
        { key: 'gestion_obras', label: 'Gestión de Obras', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', permissions: ['worksites.read','worksites.write'] },
        { key: 'gestion_asistencia', label: 'Gestión de Asistencia', color: 'bg-green-50 text-green-700 border-green-200', permissions: ['attendance.read','attendance.write','attendance.correct'] },
        { key: 'gestion_nomina', label: 'Gestión de Nómina', color: 'bg-violet-50 text-violet-700 border-violet-200', permissions: ['payroll.read','payroll.correct','payroll.close'] },
        { key: 'reportes', label: 'Reportes', color: 'bg-amber-50 text-amber-700 border-amber-200', permissions: ['reports.read','reports.export'] },
        { key: 'seguridad', label: 'Seguridad y Auditoría', color: 'bg-gray-100 text-gray-700 border-gray-300', permissions: ['audit.read','users.read','users.write','rbac.read','rbac.write'] },
        { key: 'certificaciones', label: 'Certificaciones DS3', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', permissions: ['ds3.read','ds3.write'] },
      ],
      permissions: [
        { key: 'workers.read', label: 'Ver trabajadores' }, { key: 'workers.write', label: 'Crear/editar trabajadores' }, { key: 'workers.delete', label: 'Eliminar trabajadores' },
        { key: 'worksites.read', label: 'Ver obras' }, { key: 'worksites.write', label: 'Crear/editar obras' },
        { key: 'attendance.read', label: 'Ver asistencia' }, { key: 'attendance.write', label: 'Registrar asistencia' }, { key: 'attendance.correct', label: 'Corregir asistencia' },
        { key: 'payroll.read', label: 'Ver nómina' }, { key: 'payroll.correct', label: 'Corregir nómina' }, { key: 'payroll.close', label: 'Cerrar período' },
        { key: 'reports.read', label: 'Ver reportes' }, { key: 'reports.export', label: 'Exportar reportes' },
        { key: 'audit.read', label: 'Ver auditoría' },
        { key: 'users.read', label: 'Ver usuarios' }, { key: 'users.write', label: 'Gestionar usuarios y roles' },
        { key: 'rbac.read', label: 'Ver configuración RBAC' }, { key: 'rbac.write', label: 'Modificar RBAC' },
        { key: 'ds3.read', label: 'Ver DS3' }, { key: 'ds3.write', label: 'Gestionar DS3' },
      ],
      matriz: [
        { recurso: 'Trabajadores', roles: { admin: 'read, write, delete', encargado: 'read', nomina: 'read', contratista: 'read' } },
        { recurso: 'Obras', roles: { admin: 'read, write', encargado: 'read', nomina: 'read', contratista: '—' } },
        { recurso: 'Contratistas', roles: { admin: 'read, write', encargado: '—', nomina: 'read', contratista: '—' } },
        { recurso: 'Asistencia', roles: { admin: 'read, write, correct', encargado: 'read, write', nomina: 'read', contratista: '—' } },
        { recurso: 'Nómina', roles: { admin: 'read, correct, close', encargado: 'read', nomina: 'read, correct', contratista: 'read' } },
        { recurso: 'Reportes', roles: { admin: 'read, export', encargado: 'read', nomina: 'read, export', contratista: 'read' } },
        { recurso: 'Auditoría', roles: { admin: 'read', encargado: '—', nomina: '—', contratista: '—' } },
        { recurso: 'Usuarios / RBAC', roles: { admin: 'read, write', encargado: '—', nomina: '—', contratista: '—' } },
        { recurso: 'Certificaciones DS3', roles: { admin: 'read, write', encargado: 'read', nomina: 'read', contratista: '—' } },
      ],
    }
  },
}
