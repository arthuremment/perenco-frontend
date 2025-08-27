import { useState, useEffect } from "react";
import {
  Save,
  Calendar,
  Ship,
  Fuel,
  Package,
  Clock,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowDownUp,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import { useShipsStore } from "../../store/ships";
import { useReportsStore } from "../../store/reports";
import { useToast } from "../../hooks/useToast";

export default function ShipOperationalForm() {
  const { currentShip } = useShipsStore();
  const {
    reports,
    createReport,
    loading,
    error,
    validationErrors,
    clearErrors,
  } = useReportsStore();
  const { showLoading, updateToast } = useToast();
  const [formData, setFormData] = useState({
    // Header Information
    vessel_name: currentShip?.name || "",
    report_date: new Date().toISOString().split("T")[0],

    // Vessel Information
    vessel_info: {
      master: currentShip.captain || "",
    },

    // Daily Operations Log
    operations: Array(24)
      .fill()
      .map((_, i) => ({
        time_from: `${String(i).padStart(2, "0")}:00`,
        time_to: i === 23 ? "00:00" : `${String(i + 1).padStart(2, "0")}:00`,
        activity: "",
        location: "",
        remarks: "",
      })),

    // Time Distribution (24 hours)
    time_distribution: {
      sailing_eco: 0,
      sailing_full: 0,
      cargo_ops: 0,
      lifting_ops: 0,
      standby_offshore: 0,
      standby_port: 0,
      standby_anchorage: 0,
      downtime: 0,
      total: 24,
      distance: 0,
    },

    // Tank Status
    tanks: [
      {
        tank: "1P",
        type: "",
        fluid_type: "",
        sg: 0,
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        tank: "1S",
        type: "",
        fluid_type: "",
        sg: 0,
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        tank: "2P",
        type: "",
        fluid_type: "",
        sg: 0,
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        tank: "2S",
        type: "",
        fluid_type: "",
        sg: 0,
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        tank: "3P",
        type: "",
        fluid_type: "",
        sg: 0,
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        tank: "3S",
        type: "",
        fluid_type: "",
        sg: 0,
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        tank: "4P",
        type: "",
        fluid_type: "",
        sg: 0,
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        tank: "4S",
        type: "",
        fluid_type: "",
        sg: 0,
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
    ],

    // Silo Status
    silos: [
      {
        silo: "1S",
        type: "",
        product: "",
        sg: "",
        bulk_density: "",
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        silo: "2P",
        type: "",
        product: "",
        sg: "",
        bulk_density: "",
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        silo: "3S",
        type: "",
        product: "",
        sg: "",
        bulk_density: "",
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
      {
        silo: "4P",
        type: "",
        product: "",
        sg: "",
        bulk_density: "",
        capacity: "",
        quantity: 0,
        status: "Empty & clean",
        origin_site: "",
        origin_well: "",
        dest_site: "",
        dest_well: "",
        loading_date: "",
        offloading_date: "",
        offloading_to: "",
        bc_st_ref: "",
        last_cleaning: "",
        cleaning_cert: "n/a",
        priority: "",
        comments: "",
      },
    ],

    // Fuel and Consumables
    fuel_consumables: {
      fuel_oil_rob: 0,
      fuel_oil_received: 0,
      fuel_oil_consumed: 0,
      fuel_oil_delivered: 0,
      fuel_oil_total: 0,
      lub_oil_rob: 0,
      lub_oil_received: 0,
      lub_oil_consumed: 0,
      lub_oil_delivered: 0,
      lub_oil_total: 0,
      fresh_water_rob: 0,
      fresh_water_received: 0,
      fresh_water_consumed: 0,
      fresh_water_delivered: 0,
      fresh_water_total: 0,
    },

    fuel_transfers: Array.from({ length: 6 }, () => ({
      to: "",
      to_m3: "",
      to_details: "",
      from: "",
      from_m3: "",
      from_details: "",
    })),

    // Personnel on Board
    pob: {
      crew: 0,
      visitors: 0,
      total: 0,
    },

    // General Remarks
    general_remarks: "",
    report_prepared_by: "",
  });

  const mostRecentReport =
    reports.length > 0
      ? [...reports].sort(
          (a, b) => new Date(b.report_date) - new Date(a.report_date)
        )[0]
      : null;

  //console.log(mostRecentReport)

  // Préremplir le formulaire avec les données du rapport le plus récent
  useEffect(() => {
    if (mostRecentReport) {
      const getNumber = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      };

      setFormData((prev) => ({
        ...prev,
        vessel_name: currentShip?.name,

        // Tanks
        tanks: mostRecentReport.tanks
          ? [...mostRecentReport.tanks]
          : prev.tanks,

        // Silos
        silos: mostRecentReport.silos
          ? [...mostRecentReport.silos]
          : prev.silos,

        // Fuel and Consumables
        fuel_consumables: {
          fuel_oil_rob:
            getNumber(mostRecentReport.fuel_oil_rob) +
            getNumber(mostRecentReport.fuel_oil_received) -
            (getNumber(mostRecentReport.fuel_oil_consumed) +
              getNumber(mostRecentReport.fuel_oil_delivered)),
          fuel_oil_received: 0,
          fuel_oil_consumed: 0,
          fuel_oil_delivered: 0,
          lub_oil_rob:
            getNumber(mostRecentReport.lub_oil_rob) +
            getNumber(mostRecentReport.lub_oil_received) -
            (getNumber(mostRecentReport.lub_oil_consumed) +
              getNumber(mostRecentReport.lub_oil_delivered)),
          lub_oil_received: 0,
          lub_oil_consumed: 0,
          lub_oil_delivered: 0,
          fresh_water_rob:
            getNumber(mostRecentReport.fresh_water_rob) +
            getNumber(mostRecentReport.fresh_water_received) -
            (getNumber(mostRecentReport.fresh_water_consumed) +
              getNumber(mostRecentReport.fresh_water_delivered)),
          fresh_water_received: 0,
          fresh_water_consumed: 0,
          fresh_water_delivered: 0,
        },

        // Personnel
        pob: {
          crew: mostRecentReport.crew || 0,
          visitors: mostRecentReport.visitors || 0,
          total:
            (mostRecentReport.crew || 0) + (mostRecentReport.visitors || 0),
        },
      }));

      // toast.info("Formulaire prérempli avec le rapport le plus récent", {
      //   autoClose: 3000,
      // });
    }
  }, [mostRecentReport, currentShip]);

  const totalTo = formData.fuel_transfers.reduce(
    (sum, item) => sum + Number(item.to_m3 || 0),
    0
  );
  const totalFrom = formData.fuel_transfers.reduce(
    (sum, item) => sum + Number(item.from_m3 || 0),
    0
  );

  //console.log(formData)

  // En haut de ton composant (ShipOperationalForm.jsx)
  const shipsList = [
    "BL 154",
    "BL 305",
    "BL 212",
    "SURF MITRA",
    "COASTAL FIGHTER",
    "COMOTTO",
    "EKOUNDOU",
    "LA LOBE",
    "LEBOUEF",
    "MASSONGO",
    "MUNJA",
    "ORTALANO",
    "DEROCHE",
    "DESOTO",
    "GUBERT",
    "PLATEFORME",
    "SECURITY",
    "SILI GWENN",
    "SL  EGRET",
    "SL AFRICA",
    "SL EUROPE",
    "WOURI",
    "EBOME",
    "VT",
    "DANIEL-M",
    "DANIELLA-M",
    "DIANA-L",
    "DRUMBEAT",
    "GENNY-L",
    "ATLANTIC GUARD",
    "CHALLENGER",
    "COAST GUARD",
    "GUARDIAN",
    "MARINE GUARD",
    "OCEAN GUARD",
    "SEA GUARD",
    "ALIX",
    "SPIRIT",
    "BANDJOUN3",
    "KIENKE",
    "AKWA6",
    "ARGUS",
    "AKWAYAFE",
    "EBODJE",
    "DHERY -M",
    "GRAND BATANGA",
    "LA BENOUE",
    "LA KIENKE",
    "MATHILDA1",
    "THIBAUD1",
    "ACF1",
    "ACF2",
    "ASF2",
    "ASP1",
    "BAP",
    "BVF1",
    "BVF2",
    "BVF3",
    "BVF4",
    "DIF1",
    "DIF2",
    "DKF1",
    "DKF2",
    "ENF1",
    "KLF1",
    "KLF2",
    "KLF3",
    "KLF4",
    "KLP1",
    "LSF1",
    "SIRONA",
    "AKF1",
    "BDF1",
    "BGF1",
    "BJF1",
    "BKF1",
    "BOF2",
    "BRF1",
    "BTF1",
    "BTF2",
    "EKF1",
    "EKF2",
    "EKF3",
    "ESF1",
    "ESP1",
    "ESP2",
    "ESQ1",
    "INF1",
    "ITF1",
    "KCF1",
    "KCF2",
    "KCF3",
    "KEF1",
    "KLP1",
    "KNF1",
    "NNF1",
    "VA",
    "ALIENOR",
    "CHIARA",
    "MAYLIS",
    "VICTOIRE",
    "PRISCA",
    "SEVERINE",
    "MIRANDA",
    "VALERY",
    "NICOLE",
    "HALLIBURTON",
    "SCHLUMBERGER",
    "AUTRES",
  ];

  const handleInputChange = (section, field, value, index = null) => {
    setFormData((prev) => {
      if (index !== null) {
        return {
          ...prev,
          [section]: prev[section].map((item, i) =>
            i === index ? { ...item, [field]: value } : item
          ),
        };
      } else if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  // Mise à jour du tableau des transferts
  const handleFuelTransferChange = (rowIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.fuel_transfers];
      updated[rowIndex] = { ...updated[rowIndex], [field]: value };
      return { ...prev, fuel_transfers: updated };
    });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fuel_consumables: {
        ...prev.fuel_consumables,
        fuel_oil_delivered: totalTo ?? prev.fuel_consumables.fuel_oil_delivered,
        fuel_oil_received: totalFrom ?? prev.fuel_consumables.fuel_oil_received,
      },
    }));
  }, [totalTo, totalFrom]);

  // Nettoyer les erreurs au montage
  useEffect(() => {
    clearErrors();
    return () => clearErrors();
  }, []);

  // Afficher les erreurs du store via toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [error]);

  // Valider le formulaire avant soumission
  const validateForm = () => {
    const errors = [];

    // Validation du time distribution
    const timeDistribution = formData.time_distribution;
    const timeTotal =
      (parseFloat(timeDistribution.sailing_eco) || 0) +
      (parseFloat(timeDistribution.sailing_full) || 0) +
      (parseFloat(timeDistribution.cargo_ops) || 0) +
      (parseFloat(timeDistribution.lifting_ops) || 0) +
      (parseFloat(timeDistribution.standby_offshore) || 0) +
      (parseFloat(timeDistribution.standby_port) || 0) +
      (parseFloat(timeDistribution.standby_anchorage) || 0) +
      (parseFloat(timeDistribution.downtime) || 0);

    if (Math.abs(timeTotal - 24) > 0.1) {
      errors.push(
        `The time allocation must total 24 hours. (currently: ${timeTotal.toFixed(
          1
        )}h)`
      );
    }

    // Validation des quantités de fuel
    const fuelTotal =
      formData.fuel_consumables.fuel_oil_rob +
      formData.fuel_consumables.fuel_oil_received -
      (formData.fuel_consumables.fuel_oil_consumed +
        formData.fuel_consumables.fuel_oil_delivered);

    if (fuelTotal < 0) {
      errors.push("The total amount of fuel cannot be negative.");
    }

    // Validation des opérations
    const hasOperations = formData.operations.some(
      (op) => op.activity.trim() || op.location.trim()
    );

    if (!hasOperations) {
      errors.push("Please enter at least one operation");
    }

    // Validation de la date
    const reportDate = formData.report_date;
    const today = new Date().toISOString().split("T")[0];

    if (reportDate > today) {
      errors.push("The report date cannot be in the future.");
      //console.log("reportDate", reportDate)
      //console.log("today", today)
    }

    // Validation de la distance
    // const distance = formData.time_distribution.distance;

    // if (distance < 0) {
    //   errors.push("The distance can't be null.");
    // }

    //Validation de la signature
    const prepared_by = formData.report_prepared_by;

    if (!prepared_by || prepared_by == "") {
      errors.push("Name of the author of this report.");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    // Validation locale
    const formErrors = validateForm();
    if (formErrors.length > 0) {
      formErrors.forEach((error) => {
        toast.error(error, {
          autoClose: 5000,
        });
      });
      return;
    }

    // Toast de chargement
    const toastId = showLoading("Saving the current report...");

    try {
      const reportData = {
        ship_id: currentShip.id,
        report_date: formData.report_date,
        crew: formData.pob.crew,
        visitors: formData.pob.visitors,
        sailing_eco: formData.time_distribution.sailing_eco,
        sailing_full: formData.time_distribution.sailing_full,
        cargo_ops: formData.time_distribution.cargo_ops,
        lifting_ops: formData.time_distribution.lifting_ops,
        standby_offshore: formData.time_distribution.standby_offshore,
        standby_port: formData.time_distribution.standby_port,
        standby_anchorage: formData.time_distribution.standby_anchorage,
        downtime: formData.time_distribution.downtime,
        distance: formData.time_distribution.distance,
        operations: formData.operations,
        tanks: formData.tanks,
        silos: formData.silos,
        fuel_transfers: formData.fuel_transfers,
        fuel_oil_rob: formData.fuel_consumables.fuel_oil_rob,
        fuel_oil_received: formData.fuel_consumables.fuel_oil_received,
        fuel_oil_consumed: formData.fuel_consumables.fuel_oil_consumed,
        fuel_oil_delivered: formData.fuel_consumables.fuel_oil_delivered,
        lub_oil_rob: formData.fuel_consumables.lub_oil_rob,
        lub_oil_received: formData.fuel_consumables.lub_oil_received,
        lub_oil_consumed: formData.fuel_consumables.lub_oil_consumed,
        lub_oil_delivered: formData.fuel_consumables.lub_oil_delivered,
        fresh_water_rob: formData.fuel_consumables.fresh_water_rob,
        fresh_water_received: formData.fuel_consumables.fresh_water_received,
        fresh_water_consumed: formData.fuel_consumables.fresh_water_consumed,
        fresh_water_delivered: formData.fuel_consumables.fresh_water_delivered,
        remarks: formData.general_remarks,
        prepared_by: formData.report_prepared_by,
        vessel_name: formData.vessel_name,
      };

      const response = await createReport(reportData, false);

      // Mettre à jour le toast pour indiquer le succès
      updateToast(toastId, {
        render: "Report successfully saved! ✅",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      //console.log('Rapport sauvegardé avec succès:', response);
    } catch (err) {
      // Mettre à jour le toast pour indiquer l'erreur
      updateToast(toastId, {
        render: `Error during backup: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });

      console.error("Erreur lors de la sauvegarde:", err);
    }
  };

  //console.log(formData)

  // Afficher les erreurs de validation spécifiques aux champs
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        toast.error(`${field}: ${message}`, {
          autoClose: 5000,
        });
      });
    }
  }, [validationErrors]);

  if (!currentShip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No ships connected
          </h2>
          <p className="text-gray-600">
            Please log in with a ship account to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-900 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Ship className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">DAILY LOGISTICS REPORT</h1>
                <p className="text-blue-200">
                  Rapport Journalier des Opérations
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">
                {formData.vessel_name || currentShip.name}
              </div>
              <div className="text-blue-200">
                <Calendar className="inline h-4 w-4 mr-1" />
                {new Date(formData.report_date).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </div>

        {/* Vessel Information */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Ship className="h-6 w-6 mr-2 text-blue-600" />
            Vessel Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report date
              </label>
              <input
                type="date"
                value={formData.report_date}
                onChange={(e) =>
                  handleInputChange(null, "report_date", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crew
              </label>
              <input
                type="number"
                value={formData.pob.crew}
                onChange={(e) =>
                  handleInputChange(
                    "pob",
                    "crew",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passengers
              </label>
              <input
                type="number"
                value={formData.pob.visitors}
                onChange={(e) =>
                  handleInputChange(
                    "pob",
                    "visitors",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total POB
              </label>
              <div className="w-full px-3 py-2 bg-yellow-100 border border-gray-300 rounded-md font-bold text-lg">
                {formData.pob.crew + formData.pob.visitors}
              </div>
            </div>
          </div>
        </div>

        {/* Time Distribution */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-blue-600" />
            Distribution of the 24 hours of the day according to the type of
            activity of the vessel
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="grid grid-cols-9  gap-4">
                <label className="flex justify-center items-center text-center text-xs font-semibold text-gray-700 mb-1">
                  Sailing Eco speed
                </label>
                <label className="flex justify-center items-center text-center text-xs font-semibold text-gray-700 mb-1">
                  Sailing Full speed
                </label>
                <label className="flex justify-center items-center text-center text-xs font-semibold text-gray-700 mb-1">
                  Cargo Ops./Off loading,Loading/Loading dry bulk/Pumping fresh
                  water, mud, bunkering, etc...
                </label>
                <label className="flex justify-center items-center text-center text-xs font-semibold text-gray-700 mb-1">
                  Lifting operations
                </label>
                <label className="flex justify-center items-center text-center text-xs font-semibold text-gray-700 mb-1">
                  Standby offshore with Engine/ON DP MODE
                </label>
                <label className="flex justify-center items-center text-center text-xs font-semibold text-gray-700 mb-1">
                  Standby @ Port
                </label>
                <label className="flex justify-center items-center text-center text-xs font-semibold text-gray-700 mb-1">
                  Standby @ Anchorage(anchor dropped)
                </label>
                <label className="flex justify-center items-center text-center text-xs font-semibold text-gray-700 mb-1">
                  Downtime/Vessel failure
                </label>
                <label className="flex justify-center items-center text-center text-xs font-semibold text-red-700 mb-1">
                  Distance (NM)
                </label>
              </div>
              <div className="grid grid-cols-9 gap-4">
                <input
                  type="number"
                  step="0.1"
                  value={formData.time_distribution.sailing_eco}
                  onChange={(e) =>
                    handleInputChange(
                      "time_distribution",
                      "sailing_eco",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.time_distribution.sailing_full}
                  onChange={(e) =>
                    handleInputChange(
                      "time_distribution",
                      "sailing_full",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.time_distribution.cargo_ops}
                  onChange={(e) =>
                    handleInputChange(
                      "time_distribution",
                      "cargo_ops",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.time_distribution.lifting_ops}
                  onChange={(e) =>
                    handleInputChange(
                      "time_distribution",
                      "lifting_ops",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.time_distribution.standby_offshore}
                  onChange={(e) =>
                    handleInputChange(
                      "time_distribution",
                      "standby_offshore",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.time_distribution.standby_port}
                  onChange={(e) =>
                    handleInputChange(
                      "time_distribution",
                      "standby_port",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.time_distribution.standby_anchorage}
                  onChange={(e) =>
                    handleInputChange(
                      "time_distribution",
                      "standby_anchorage",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.time_distribution.downtime}
                  onChange={(e) =>
                    handleInputChange(
                      "time_distribution",
                      "downtime",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.time_distribution.distance}
                  onChange={(e) =>
                    handleInputChange(
                      "time_distribution",
                      "distance",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  Total 24 hours:
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {(
                    parseFloat(formData.time_distribution.sailing_eco) +
                    parseFloat(formData.time_distribution.sailing_full) +
                    parseFloat(formData.time_distribution.cargo_ops) +
                    parseFloat(formData.time_distribution.lifting_ops) +
                    parseFloat(formData.time_distribution.standby_offshore) +
                    parseFloat(formData.time_distribution.standby_port) +
                    parseFloat(formData.time_distribution.standby_anchorage) +
                    parseFloat(formData.time_distribution.downtime)
                  ).toFixed(1)}{" "}
                  h
                </span>
              </div>
            </div>

            {/* <div className={`mt-3 p-2 rounded text-sm font-medium ${
              Math.abs(Object.values(formData.time_distribution)
                .filter((val, key) => key !== 'total' && key !== 'distance')
                .reduce((sum, val) => sum + (parseFloat(val) || 0), 0) - 24) < 0.1
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              Total: {Object.values(formData.time_distribution)
                .filter((val, key) => key !== 'total' && key !== 'distance')
                .reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(1)}h / 24h
            </div> */}
          </div>
        </div>

        {/* Operation Log */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-blue-600" />
            Operation Log
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr className="text-xs text-gray-700">
                  <th className="border border-gray-300 px-2 py-1">
                    Time (Start)
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Time (Stop)
                  </th>
                  <th className="border border-gray-300 px-2 py-1">Duration</th>
                  <th className="border border-gray-300 px-2 py-1">Location</th>
                  <th className="border border-gray-300 px-2 py-1">Activity</th>
                </tr>
              </thead>
              <tbody>
                {formData.operations.map((op, index) => {
                  // Calculer durée en HH:MM
                  const [startH, startM] = op.time_from.split(":").map(Number);
                  let [endH, endM] = op.time_to.split(":").map(Number);

                  // Si l'heure de fin est 00:00, traiter comme 24:00 pour le calcul
                  if (endH === 0 && endM === 0) {
                    endH = 24;
                  }

                  const durationMins =
                    endH * 60 + endM - (startH * 60 + startM);
                  const duration = `${String(
                    Math.floor(durationMins / 60)
                  ).padStart(2, "0")}:${String(durationMins % 60).padStart(
                    2,
                    "0"
                  )}`;

                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="time"
                          value={op.time_from}
                          onChange={(e) =>
                            handleInputChange(
                              "operations",
                              "time_from",
                              e.target.value,
                              index
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="time"
                          value={op.time_to}
                          onChange={(e) =>
                            handleInputChange(
                              "operations",
                              "time_to",
                              e.target.value,
                              index
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 bg-yellow-100 px-2 py-1 text-center text-xs font-semibold">
                        {duration}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={op.location}
                          onChange={(e) =>
                            handleInputChange(
                              "operations",
                              "location",
                              e.target.value,
                              index
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={op.activity}
                          onChange={(e) =>
                            handleInputChange(
                              "operations",
                              "activity",
                              e.target.value,
                              index
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tank Status */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Package className="h-6 w-6 mr-2 text-blue-600" />
            Tank Status
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-yellow-400">
                <tr className="text-xs">
                  <th className="border border-gray-300 px-2 py-1">Tank #</th>
                  <th className="border border-gray-300 px-2 py-1">
                    Dedicated Tank
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Fluid type
                  </th>
                  <th className="border border-gray-300 px-2 py-1">S.G.</th>
                  <th className="border border-gray-300 px-2 py-1">
                    Capacity (m<sup>3</sup>)
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Qty (m<sup>3</sup>)
                  </th>
                  <th className="border border-gray-300 px-2 py-1">Status</th>
                  <th className="border border-gray-300 px-2 py-1">
                    Origin Site
                  </th>
                  {/* <th className="border border-gray-300 py-1">Origin Well</th> */}
                  <th className="border border-gray-300 px-2 py-1">
                    Dest Site
                  </th>
                  {/* <th className="border border-gray-300 py-1">Dest Well</th> */}
                  <th className="border border-gray-300 px-2 py-1">
                    Loading Date
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Off loading date
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Off loading to
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Last Cleaning
                  </th>
                  <th className="border border-gray-300 px-2 py-1">Comments</th>
                </tr>
              </thead>
              <tbody>
                {formData.tanks.map((tank, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
                  >
                    <td className="border border-gray-300 px-2 py-1 font-bold text-center bg-yellow-200">
                      <input
                        type="text"
                        value={tank?.tank}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "tank",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full outline-none px-1 py-0.5 border-0 bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-xs">
                      <input
                        type="text"
                        value={tank?.type}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "type",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full outline-none px-1 py-0.5 border-0 bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={tank?.fluid_type}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "fluid_type",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full outline-none px-1 py-0.5 text-xs border-0 bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        step="0.01"
                        value={tank?.sg}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "sg",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                      <input
                        type="text"
                        value={tank?.capacity}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "capacity",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full outline-none px-1 py-0.5 text-xs border-0 bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        value={tank?.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "quantity",
                            parseInt(e.target.value) || 0,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <select
                        value={tank?.status}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "status",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      >
                        <option value="Residues">Residues</option>
                        <option value="Not empty">Not empty</option>
                        <option value="Empty & clean">Empty & clean</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={tank?.origin_site}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "origin_site",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    {/* <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={tank?.origin_well}
                        onChange={(e) => handleInputChange('tanks', 'origin_well', e.target.value, index)}
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500"
                      />
                    </td> */}
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={tank?.dest_site}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "dest_site",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    {/* <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={tank?.dest_well}
                        onChange={(e) => handleInputChange('tanks', 'dest_well', e.target.value, index)}
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent focus:ring-1 focus:ring-blue-500"
                      />
                    </td> */}
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="date"
                        value={tank?.loading_date}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "loading_date",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="date"
                        value={tank?.offloading_date}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "offloading_date",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={tank?.offloading_to}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "offloading_to",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="date"
                        value={tank?.last_cleaning}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "last_cleaning",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={tank?.comments}
                        onChange={(e) =>
                          handleInputChange(
                            "tanks",
                            "comments",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Silo Status */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Package className="h-6 w-6 mr-2 text-blue-600" />
            Silo Status
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-yellow-400">
                <tr className="text-xs">
                  <th className="border border-gray-300 px-2 py-1">Silo #</th>
                  <th className="border border-gray-300 px-2 py-1">
                    Dedicated Silo
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Product type
                  </th>
                  <th className="border border-gray-300 px-2 py-1">S.G</th>
                  <th className="border border-gray-300 px-2 py-1">
                    Bulk Density
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Capacity (m<sup>3</sup>)
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Quantity (T)
                  </th>
                  <th className="border border-gray-300 px-2 py-1">Status</th>
                  <th className="border border-gray-300 px-2 py-1">
                    Last Cleaning
                  </th>
                  <th className="border border-gray-300 px-2 py-1">Comments</th>
                </tr>
              </thead>
              <tbody>
                {formData.silos.map((silo, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
                  >
                    <td className="border border-gray-300 px-2 py-1 font-bold text-center bg-yellow-200">
                      <input
                        type="text"
                        value={silo?.silo}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "silo",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full outline-none px-1 py-0.5 border-0 bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-xs">
                      <input
                        type="text"
                        value={silo?.type}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "type",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full outline-none px-1 py-0.5 border-0 bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-xs">
                      <input
                        type="text"
                        value={silo?.product}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "product",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full outline-none px-1 py-0.5 border-0 bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        step="0.01"
                        value={silo?.sg}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "sg",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        step="0.01"
                        value={silo?.bulk_density}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "bulk_density",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                      <input
                        type="text"
                        value={silo?.capacity}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "capacity",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full outline-none px-1 py-0.5 border-0 bg-transparent"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        value={silo?.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "quantity",
                            parseInt(e.target.value) || 0,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <select
                        value={silo?.status}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "status",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      >
                        <option value="Residues">Residues</option>
                        <option value="Not empty">Not empty</option>
                        <option value="Empty & clean">Empty & clean</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-xs">
                      <input
                        type="date"
                        value={silo?.last_cleaning}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "last_cleaning",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={silo?.comments}
                        onChange={(e) =>
                          handleInputChange(
                            "silos",
                            "comments",
                            e.target.value,
                            index
                          )
                        }
                        className="w-full px-1 py-0.5 text-xs border-0 bg-transparent outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fuel Transfers */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ArrowDownUp className="h-6 w-6 mr-2 text-blue-600" />
            Fuel Oil Transfers
          </h2>
          <div className="overflow-x-auto border border-gray-200">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th
                    colSpan="3"
                    className="px-2 py-2 text-red-600 font-semibold border border-r-10 border-gray-300"
                  >
                    <div className="flex items-center justify-center font-bold">
                      F.O. DISCHARGES <ArrowUpRight />
                    </div>
                  </th>
                  <th
                    colSpan="3"
                    className="px-2 py-2 text-green-600 font-semibold border border-gray-200"
                  >
                    <div className="flex items-center justify-center font-bold">
                      F.O. CHARGES <ArrowDownLeft />
                    </div>
                  </th>
                </tr>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="border border-gray-200 px-2 py-1 text-red-600 font-medium">
                    To
                  </th>
                  <th className="border border-gray-200 px-2 py-1 text-red-600 font-medium">
                    m³
                  </th>
                  <th className="border-r-10 border-gray-300 px-2 py-1 text-red-600 font-medium">
                    Details
                  </th>

                  <th className="border border-gray-200 px-2 py-1 text-green-600 font-medium">
                    From
                  </th>
                  <th className="border border-gray-200 px-2 py-1 text-green-600 font-medium">
                    m³
                  </th>
                  <th className="border border-gray-200 px-2 py-1 text-green-600 font-medium">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.fuel_transfers.map((transfer, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {/* Discharges */}
                    <td className="border border-gray-200 px-2 py-1">
                      <select
                        value={transfer.to}
                        onChange={(e) =>
                          handleFuelTransferChange(idx, "to", e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs outline-none"
                      >
                        <option value="">-- Select --</option>
                        {shipsList.sort().map((ship, i) => (
                          <option key={i} value={ship}>
                            {ship}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      <input
                        type="number"
                        step="0.001"
                        value={transfer.to_m3}
                        onChange={(e) =>
                          handleFuelTransferChange(idx, "to_m3", e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs rounded text-right outline-none"
                      />
                    </td>
                    <td className="border border-r-10 border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={transfer.to_details}
                        onChange={(e) =>
                          handleFuelTransferChange(
                            idx,
                            "to_details",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-xs outline-none"
                      />
                    </td>

                    {/* Charges */}
                    <td className="border border-gray-200 px-2 py-1">
                      <select
                        value={transfer.from}
                        onChange={(e) =>
                          handleFuelTransferChange(idx, "from", e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs outline-none"
                      >
                        <option value="">-- Select --</option>
                        {shipsList.sort().map((ship, i) => (
                          <option key={i} value={ship}>
                            {ship}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      <input
                        type="number"
                        step="0.001"
                        value={transfer.from_m3}
                        onChange={(e) =>
                          handleFuelTransferChange(
                            idx,
                            "from_m3",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-xs text-right outline-none"
                      />
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      <input
                        type="text"
                        value={transfer.from_details}
                        onChange={(e) =>
                          handleFuelTransferChange(
                            idx,
                            "from_details",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-xs outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fuel and Consumables */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Fuel className="h-6 w-6 mr-2 text-blue-600" />
            Fuel and Lub Oil
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                Lub Oil (ltrs)
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Onboard
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.lub_oil_rob}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "lub_oil_rob",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Received
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.lub_oil_received}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "lub_oil_received",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Used
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.lub_oil_consumed}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "lub_oil_consumed",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivered
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.lub_oil_delivered}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "lub_oil_delivered",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total
                </label>
                <div className="w-full px-3 py-2 bg-yellow-100 border border-gray-300 rounded-md font-semibold">
                  {(
                    formData.fuel_consumables.lub_oil_rob +
                    formData.fuel_consumables.lub_oil_received -
                    formData.fuel_consumables.lub_oil_consumed
                  ).toFixed()}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">FW / DW (m³)</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Onboard
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.fresh_water_rob}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "fresh_water_rob",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Received
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.fresh_water_received}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "fresh_water_received",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Used
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.fresh_water_consumed}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "fresh_water_consumed",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivered
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.fresh_water_delivered}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "fresh_water_delivered",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total
                </label>
                <div className="w-full px-3 py-2 bg-yellow-100 border border-gray-300 rounded-md font-semibold">
                  {(
                    formData.fuel_consumables.fresh_water_rob +
                    formData.fuel_consumables.fresh_water_received -
                    formData.fuel_consumables.fresh_water_consumed
                  ).toFixed()}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                Fuel Oil (m³)
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Onboard
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.fuel_oil_rob}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "fuel_oil_rob",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Received
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.fuel_oil_received}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "fuel_oil_received",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Used
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.fuel_oil_consumed}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "fuel_oil_consumed",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivered
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuel_consumables.fuel_oil_delivered}
                    onChange={(e) =>
                      handleInputChange(
                        "fuel_consumables",
                        "fuel_oil_delivered",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total
                </label>
                <div className="w-full px-3 py-2 bg-yellow-100 border border-gray-300 rounded-md font-semibold">
                  {(
                    formData.fuel_consumables.fuel_oil_rob +
                    formData.fuel_consumables.fuel_oil_received -
                    (formData.fuel_consumables.fuel_oil_consumed +
                      formData.fuel_consumables.fuel_oil_delivered)
                  ).toFixed()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personnel on Board */}
        {/* <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personnel à Bord (POB)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Équipage</label>
              <input
                type="number"
                value={formData.pob.crew}
                onChange={(e) => handleInputChange('pob', 'crew', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input
                type="number"
                value={formData.pob.client}
                onChange={(e) => handleInputChange('pob', 'client', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visiteurs</label>
              <input
                type="number"
                value={formData.pob.visitors}
                onChange={(e) => handleInputChange('pob', 'visitors', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total POB</label>
              <div className="w-full px-3 py-2 bg-yellow-100 border border-gray-300 rounded-md font-bold text-lg">
                {formData.pob.crew + formData.pob.client + formData.pob.visitors}
              </div>
            </div>
          </div>
        </div> */}

        {/* Equipment Status */}
        {/* <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            État des Équipements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(formData.equipment).filter(([key]) => key !== 'remarks').map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replace('_', ' ')}
                </label>
                <select
                  value={value}
                  onChange={(e) => handleInputChange('equipment', key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OK">OK</option>
                  <option value="Défaillant">Défaillant</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Arrêté">Arrêté</option>
                </select>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarques équipements</label>
            <textarea
              value={formData.equipment.remarks}
              onChange={(e) => handleInputChange('equipment', 'remarks', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Détails sur l'état des équipements..."
            />
          </div>
        </div> */}

        {/* General Remarks */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Remarks</h2>
          <textarea
            value={formData.general_remarks}
            onChange={(e) =>
              handleInputChange(null, "general_remarks", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
            rows="4"
            placeholder="General observations, specific events, recommendations..."
          />
        </div>

        {/* Signature Section */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report prepared by
              </label>
              <input
                type="text"
                value={formData.report_prepared_by}
                onChange={(e) =>
                  handleInputChange(null, "report_prepared_by", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                placeholder="Name & position"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-6 bg-blue-900">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm">
                Daily report for {formData.vessel_name || currentShip.name}
              </p>
              <p className="text-xs text-blue-200">
                Date:{" "}
                {new Date(formData.report_date).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[150px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  In progress...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
