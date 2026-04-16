import { useMemo, useState } from "react"
import siroLogo from "./assets/siro-logo-mobile.png"
import neversecondLogo from "./assets/Neversecond logo.png"
import whcLogo from "./assets/whc logo mobile.png"
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient"

const ratingCategories = ["taste", "texture", "tolerance", "ease", "aftertaste"]

const associationOptionKeys = ["fastShipping", "productQuality", "greatWebsite", "valueForMoney", "effectiveness"]

const brandOptions = [
  { key: "siro", name: "SiRo Supplements", logo: siroLogo },
  { key: "neversecond", name: "Neversecond", logo: neversecondLogo },
  { key: "whc", name: "WHC", logo: whcLogo }
]

const productsByBrand = {
  siro: ["Collagen FIT", "Creatine FIT", "Collagen SKIN", "Collagen SKIN SHOT", "Other (SiRo)"],
  neversecond: [
    "C30 Energy Gel",
    "C30 Drink Mix",
    "P30 Protein Drink Mix",
    "C90 High Carb Drink Mix",
    "C30 Fuel Bar",
    "Other (Neversecond)"
  ],
  whc: [
    "Unocardio 1000 + Vitamin D3",
    "B-Hada",
    "Unocardio Athletics",
    "WHC Chewy",
    "WHC Unocardio X2",
    "WHC Ubiquor",
    "WHC Mini",
    "WHC OHisa",
    "Other (WHC)"
  ]
}

const I18N = {
  EN: {
    stepWord: "Step",
    shareExperience: "Share your experience",
    welcomeTitle: "Help us improve your experience!",
    welcomeSubtitle: "This will only take 2 minutes and there's a small gift waiting for you at the end...",
    brandProductTitle: "Brand & Product Selection",
    brandProductSubtitle: "Select one or more brands, then choose up to 3 products.",
    productsMax: "Products (max 3)",
    selectedCount: "selected",
    selectBrandPrompt: "Select at least one brand to load products.",
    specifyOther: "Please specify your other product",
    productRatingTitle: "Product Rating",
    productRatingSubtitle: "You selected {{count}} product(s). Open each row and complete all required fields.",
    rowHint: "Click to expand",
    rowHintOpen: "Click to collapse",
    required: "Required",
    productSpecificRatings: "Product-specific ratings",
    shortExperience: "Give a short description of your experience?",
    shortExperiencePlaceholder: "Tell us what stood out...",
    results: "What results did you notice?",
    resultsPlaceholder: "Share any benefits or changes...",
    siroExperienceTitle: "SiRo Supplements Experience",
    siroExperienceSubtitle: "Help us understand what you associate with the brand.",
    associationQuestion: "Which of the following do you associate with the SiRo brand?",
    improveLabel: "What could we improve?",
    improvePlaceholder: "Share your thoughts...",
    recommendLabel: "How likely are you to recommend us to someone else?",
    demographicsTitle: "Demographics & Submit",
    demographicsSubtitle: "Finish the survey so we can reward you with SiRo points.",
    age: "Age",
    chooseAge: "Choose age group",
    gender: "Gender",
    zipCode: "Zip Code",
    zipPlaceholder: "e.g. 12345",
    back: "Back",
    next: "Next",
    submit: "Submit Survey",
    successTitle: "Thank you for your feedback!",
    successReward: "You've earned 200 SiRo points! We will automatically add them to your account.",
    errors: {
      step1: "Please select a language.",
      step2base: "Please select at least one brand and at least one product.",
      step2other: "Please specify the selected 'Other' product.",
      step3: "Please complete ratings, short description, and results for each selected product.",
      step4: "Please select at least one association and tell us what we can improve.",
      step5: "Please complete the age, gender, and zip code fields."
    },
    associations: {
      fastShipping: "Fast shipping",
      productQuality: "Product quality",
      greatWebsite: "Great website",
      valueForMoney: "Value for money",
      effectiveness: "Effectiveness"
    },
    ratings: {
      taste: "Taste / Flavor",
      texture: "Texture / Mixability",
      tolerance: "Stomach tolerance",
      ease: "Ease of use",
      aftertaste: "Aftertaste"
    },
    ageOptions: ["Under 18", "18-24", "25-34", "35-55", "56+"],
    genders: ["Male", "Female", "Other", "Prefer not to say"]
  },
  FR: {
    stepWord: "Etape",
    shareExperience: "Partagez votre experience",
    welcomeTitle: "Aidez-nous a ameliorer votre experience !",
    welcomeSubtitle: "Cela ne prendra que 2 minutes et un petit cadeau vous attend a la fin...",
    brandProductTitle: "Marque & Produits",
    brandProductSubtitle: "Selectionnez une ou plusieurs marques, puis jusqu'a 3 produits.",
    productsMax: "Produits (max 3)",
    selectedCount: "selectionnes",
    selectBrandPrompt: "Selectionnez au moins une marque pour afficher les produits.",
    specifyOther: "Veuillez preciser votre autre produit",
    productRatingTitle: "Evaluation des produits",
    productRatingSubtitle: "Vous avez selectionne {{count}} produit(s). Ouvrez chaque ligne et completez tous les champs requis.",
    rowHint: "Cliquer pour ouvrir",
    rowHintOpen: "Cliquer pour reduire",
    required: "Requis",
    productSpecificRatings: "Evaluations specifiques du produit",
    shortExperience: "Donnez une courte description de votre experience ?",
    shortExperiencePlaceholder: "Dites-nous ce qui vous a marque...",
    results: "Quels resultats avez-vous constates ?",
    resultsPlaceholder: "Partagez les benefices ou changements...",
    siroExperienceTitle: "Experience SiRo Supplements",
    siroExperienceSubtitle: "Aidez-nous a comprendre ce que vous associez a la marque.",
    associationQuestion: "Que associez-vous a la marque SiRo ?",
    improveLabel: "Que pourrions-nous ameliorer ?",
    improvePlaceholder: "Partagez vos idees...",
    recommendLabel: "Quelle est la probabilite que vous nous recommandiez ?",
    demographicsTitle: "Demographie & Envoi",
    demographicsSubtitle: "Terminez l'enquete pour recevoir vos points SiRo.",
    age: "Age",
    chooseAge: "Choisissez une tranche d'age",
    gender: "Genre",
    zipCode: "Code postal",
    zipPlaceholder: "ex. 12345",
    back: "Retour",
    next: "Suivant",
    submit: "Envoyer l'enquete",
    successTitle: "Merci pour votre retour !",
    successReward: "Vous avez gagne 200 points SiRo ! Ils seront ajoutes automatiquement a votre compte.",
    errors: {
      step1: "Veuillez selectionner une langue.",
      step2base: "Veuillez selectionner au moins une marque et au moins un produit.",
      step2other: "Veuillez preciser le produit 'Other' selectionne.",
      step3: "Veuillez completer les notes, la description courte et les resultats pour chaque produit.",
      step4: "Veuillez selectionner au moins une association et indiquer ce que nous pouvons ameliorer.",
      step5: "Veuillez completer l'age, le genre et le code postal."
    },
    associations: {
      fastShipping: "Livraison rapide",
      productQuality: "Qualite produit",
      greatWebsite: "Excellent site web",
      valueForMoney: "Bon rapport qualite/prix",
      effectiveness: "Efficacite"
    },
    ratings: {
      taste: "Gout / Saveur",
      texture: "Texture / Melange",
      tolerance: "Tolerance digestive",
      ease: "Facilite d'utilisation",
      aftertaste: "Arriere-gout"
    },
    ageOptions: ["Moins de 18 ans", "18-24", "25-34", "35-55", "56+"],
    genders: ["Homme", "Femme", "Autre", "Prefere ne pas dire"]
  },
  NL: {
    stepWord: "Stap",
    shareExperience: "Deel je ervaring",
    welcomeTitle: "Help ons je ervaring te verbeteren!",
    welcomeSubtitle: "Dit duurt slechts 2 minuten en er wacht een kleine beloning op het einde...",
    brandProductTitle: "Merk & Productkeuze",
    brandProductSubtitle: "Selecteer een of meerdere merken en kies daarna maximaal 3 producten.",
    productsMax: "Producten (max 3)",
    selectedCount: "geselecteerd",
    selectBrandPrompt: "Selecteer minstens een merk om producten te tonen.",
    specifyOther: "Specificeer je andere product",
    productRatingTitle: "Productbeoordeling",
    productRatingSubtitle: "Je hebt {{count}} product(en) geselecteerd. Open elke rij en vul alle verplichte velden in.",
    rowHint: "Klik om uit te klappen",
    rowHintOpen: "Klik om in te klappen",
    required: "Verplicht",
    productSpecificRatings: "Productspecifieke beoordelingen",
    shortExperience: "Geef een korte beschrijving van je ervaring?",
    shortExperiencePlaceholder: "Vertel ons wat opviel...",
    results: "Welke resultaten merkte je op?",
    resultsPlaceholder: "Deel voordelen of veranderingen...",
    siroExperienceTitle: "SiRo Supplements Ervaring",
    siroExperienceSubtitle: "Help ons begrijpen wat je met het merk associeert.",
    associationQuestion: "Welke van de volgende punten associeer je met het SiRo-merk?",
    improveLabel: "Wat kunnen we verbeteren?",
    improvePlaceholder: "Deel je suggesties...",
    recommendLabel: "Hoe waarschijnlijk is het dat je ons zou aanbevelen?",
    demographicsTitle: "Demografie & Verzenden",
    demographicsSubtitle: "Rond de quiz af om je SiRo-punten te ontvangen.",
    age: "Leeftijd",
    chooseAge: "Kies leeftijdsgroep",
    gender: "Geslacht",
    zipCode: "Postcode",
    zipPlaceholder: "bv. 12345",
    back: "Terug",
    next: "Volgende",
    submit: "Quiz verzenden",
    successTitle: "Bedankt voor je feedback!",
    successReward: "Je hebt 200 SiRo-punten verdiend! We voegen ze automatisch toe aan je account.",
    errors: {
      step1: "Selecteer een taal.",
      step2base: "Selecteer minstens een merk en minstens een product.",
      step2other: "Specificeer het geselecteerde 'Other' product.",
      step3: "Vul beoordelingen, korte beschrijving en resultaten in voor elk geselecteerd product.",
      step4: "Selecteer minstens een associatie en vertel wat we kunnen verbeteren.",
      step5: "Vul leeftijd, geslacht en postcode in."
    },
    associations: {
      fastShipping: "Snelle levering",
      productQuality: "Productkwaliteit",
      greatWebsite: "Goede website",
      valueForMoney: "Goede prijs-kwaliteit",
      effectiveness: "Effectiviteit"
    },
    ratings: {
      taste: "Smaak",
      texture: "Textuur / Mixbaarheid",
      tolerance: "Maagtolerantie",
      ease: "Gebruiksgemak",
      aftertaste: "Nasmaak"
    },
    ageOptions: ["Onder 18", "18-24", "25-34", "35-55", "56+"],
    genders: ["Man", "Vrouw", "Anders", "Zeg ik liever niet"]
  }
}

const initialAnswers = {
  language: "",
  brands: [],
  products: [],
  productRatings: {},
  otherProductDetails: {},
  associations: [],
  improvement: "",
  recommend: 5,
  age: "",
  gender: "",
  zip: ""
}

const StepBadge = ({ label, index, active, completed }) => (
  <div className="relative z-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.12em]">
    <div
      className={`grid h-10 w-10 place-items-center rounded-full border text-xs font-semibold transition ${
        active || completed
          ? "border-[#111111] bg-[#111111] text-white"
          : "border-[#D1D5DB] bg-white text-[#6B7280]"
      }`}
    >
      {index}
    </div>
    <span className={`${active ? "text-[#111111]" : "text-[#6B7280]"}`}>{label}</span>
  </div>
)

const Star = ({ filled }) => <span className={`text-base ${filled ? "text-[#111111]" : "text-[#CBD5E1]"}`}>★</span>

function App() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState(initialAnswers)
  const [error, setError] = useState("")
  const [openRatingProduct, setOpenRatingProduct] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const locale = answers.language || "EN"
  const copy = I18N[locale] || I18N.EN

  const steps = useMemo(
    () => [1, 2, 3, 4, 5].map((n) => `${copy.stepWord} ${n}`),
    [copy.stepWord]
  )

  const progress = useMemo(() => {
    if (step <= 1) return 0
    if (step >= 5) return 100
    return ((step - 1) / 4) * 100
  }, [step])

  const availableProducts = useMemo(() => {
    const all = answers.brands.flatMap((brandKey) => productsByBrand[brandKey] || [])
    return [...new Set(all)]
  }, [answers.brands])

  const replaceCount = (text, count) => text.replace("{{count}}", String(count))

  const getStepError = (targetStep) => {
    if (targetStep === 1) {
      return answers.language ? "" : copy.errors.step1
    }

    if (targetStep === 2) {
      if (answers.brands.length === 0 || answers.products.length === 0) return copy.errors.step2base
      const hasInvalidOther = answers.products.some(
        (p) => p.startsWith("Other (") && !(answers.otherProductDetails[p] || "").trim()
      )
      return hasInvalidOther ? copy.errors.step2other : ""
    }

    if (targetStep === 3) {
      if (answers.products.length === 0) return copy.errors.step3
      const allComplete = answers.products.every((product) => {
        const block = answers.productRatings[product]
        if (!block) return false
        const ratingsComplete = ratingCategories.every((category) => (block[category] || 0) > 0)
        return ratingsComplete && (block.experience || "").trim() && (block.results || "").trim()
      })
      return allComplete ? "" : copy.errors.step3
    }

    if (targetStep === 4) {
      if (answers.associations.length === 0) return copy.errors.step4
      if (!answers.improvement.trim()) return copy.errors.step4
      return ""
    }

    if (targetStep === 5) {
      return answers.age && answers.gender && answers.zip.trim() ? "" : copy.errors.step5
    }

    return ""
  }

  const isCurrentStepValid = !getStepError(step)

  const setField = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleToggleBrand = (brandKey) => {
    setAnswers((prev) => {
      const already = prev.brands.includes(brandKey)
      const nextBrands = already ? prev.brands.filter((item) => item !== brandKey) : [...prev.brands, brandKey]
      const nextAvailable = nextBrands.flatMap((key) => productsByBrand[key] || [])

      const nextProducts = prev.products.filter((product) => nextAvailable.includes(product))

      const nextRatings = Object.fromEntries(
        Object.entries(prev.productRatings).filter(([productName]) => nextProducts.includes(productName))
      )

      const nextOtherDetails = Object.fromEntries(
        Object.entries(prev.otherProductDetails).filter(([productName]) => nextProducts.includes(productName))
      )

      const firstOpen = nextProducts[0] || ""
      setOpenRatingProduct(firstOpen)

      return {
        ...prev,
        brands: nextBrands,
        products: nextProducts,
        productRatings: nextRatings,
        otherProductDetails: nextOtherDetails
      }
    })
    setError("")
  }

  const handleToggleProduct = (product) => {
    setAnswers((prev) => {
      const selected = prev.products.includes(product)
      let nextProducts = prev.products

      if (selected) {
        nextProducts = prev.products.filter((item) => item !== product)
      } else if (prev.products.length < 3) {
        nextProducts = [...prev.products, product]
      }

      const nextRatings = { ...prev.productRatings }
      if (!selected && !nextRatings[product]) {
        nextRatings[product] = {
          taste: 0,
          texture: 0,
          tolerance: 0,
          ease: 0,
          aftertaste: 0,
          experience: "",
          results: ""
        }
      }

      if (selected) {
        delete nextRatings[product]
      }

      const nextOtherDetails = { ...prev.otherProductDetails }
      if (selected) {
        delete nextOtherDetails[product]
      }

      if (!openRatingProduct && nextProducts.length > 0) {
        setOpenRatingProduct(nextProducts[0])
      }

      if (openRatingProduct && !nextProducts.includes(openRatingProduct)) {
        setOpenRatingProduct(nextProducts[0] || "")
      }

      return {
        ...prev,
        products: nextProducts,
        productRatings: nextRatings,
        otherProductDetails: nextOtherDetails
      }
    })
    setError("")
  }

  const handleProductRating = (product, categoryKey, value) => {
    setAnswers((prev) => ({
      ...prev,
      productRatings: {
        ...prev.productRatings,
        [product]: {
          ...prev.productRatings[product],
          [categoryKey]: value
        }
      }
    }))
    setError("")
  }

  const handleProductText = (product, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      productRatings: {
        ...prev.productRatings,
        [product]: {
          ...prev.productRatings[product],
          [field]: value
        }
      }
    }))
    setError("")
  }

  const handleAssociationToggle = (item) => {
    setAnswers((prev) => {
      const next = prev.associations.includes(item)
        ? prev.associations.filter((v) => v !== item)
        : [...prev.associations, item]
      return { ...prev, associations: next }
    })
    setError("")
  }

  const validateStep = () => {
    const msg = getStepError(step)
    if (msg) {
      setError(msg)
      return false
    }
    setError("")
    return true
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep((value) => Math.min(value + 1, 6))
    }
  }

  const prevStep = () => {
    setError("")
    setStep((value) => Math.max(value - 1, 1))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validateStep()) return

    const submit = async () => {
      try {
        setIsSubmitting(true)

        if (isSupabaseConfigured && supabase) {
          const payload = {
            language: answers.language,
            brands: answers.brands,
            products: answers.products,
            product_ratings: answers.productRatings,
            other_product_details: answers.otherProductDetails,
            associations: answers.associations,
            improvement: answers.improvement,
            recommend: answers.recommend,
            age: answers.age,
            gender: answers.gender,
            zip: answers.zip,
            answers_json: answers
          }

          const { error: insertError } = await supabase.from("survey_responses").insert(payload)

          if (insertError) {
            throw insertError
          }
        }

        setStep(6)
      } catch (submitError) {
        setError(submitError?.message || "Submission failed. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }

    void submit()
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-6 text-[#333333] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-glow sm:p-6">
        <div className="mb-5 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <img src={siroLogo} alt="SiRo logo" className="h-11 w-auto" />
            <h1 className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">{copy.shareExperience}</h1>
          </div>

          {step < 6 && (
            <div className="relative">
              <div className="absolute left-0 right-0 top-5 h-[2px] bg-[#D1D5DB]" />
              <div className="absolute left-0 top-5 h-[2px] bg-[#111111] transition-all" style={{ width: `${progress}%` }} />
              <div className="relative grid grid-cols-5 gap-3">
                {steps.map((item, index) => (
                  <StepBadge
                    key={item}
                    label={item}
                    index={index + 1}
                    active={step === index + 1}
                    completed={step > index + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit}>
          {step === 1 && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F3F4F6] p-5 sm:p-6">
                <p className="text-base font-semibold text-[#111827]">{copy.welcomeTitle}</p>
                <p className="mt-2 text-sm text-[#6B7280]">{copy.welcomeSubtitle}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { code: "NL", emoji: "🇧🇪", label: "NL" },
                    { code: "FR", emoji: "🇫🇷", label: "FR" },
                    { code: "EN", emoji: "🇬🇧", label: "EN" }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setField("language", lang.code)
                        setStep(2)
                      }}
                      className="rounded-2xl border border-[#111111] bg-white px-4 py-3 text-base font-semibold text-[#111111] transition hover:bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>{lang.emoji}</span>
                        <span>{lang.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F3F4F6] p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-[#111827]">{copy.brandProductTitle}</h2>
                <p className="mt-1 text-sm text-[#6B7280]">{copy.brandProductSubtitle}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {brandOptions.map((brand) => {
                    const selected = answers.brands.includes(brand.key)
                    return (
                      <button
                        key={brand.key}
                        type="button"
                        onClick={() => handleToggleBrand(brand.key)}
                        className={`rounded-2xl border p-3 text-left transition ${
                          selected
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#111111]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={brand.logo} alt={brand.name} className="h-8 w-auto rounded bg-white p-1" />
                          <p className="text-sm font-semibold leading-tight">{brand.name}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">{copy.productsMax}</p>
                    <p className="text-xs text-[#6B7280]">
                      {answers.products.length}/3 {copy.selectedCount}
                    </p>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {availableProducts.length === 0 && (
                      <p className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#6B7280]">
                        {copy.selectBrandPrompt}
                      </p>
                    )}
                    {availableProducts.map((product) => {
                      const checked = answers.products.includes(product)
                      const disabled = !checked && answers.products.length >= 3
                      const isOther = product.startsWith("Other (")
                      return (
                        <div key={product}>
                          <label
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                              checked
                                ? "border-[#111111] bg-[#111111] text-white"
                                : "border-[#E5E7EB] bg-white text-[#333333]"
                            } ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-[#111111]"}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() => handleToggleProduct(product)}
                              className="h-4 w-4 accent-[#111111]"
                            />
                            <span>{product}</span>
                          </label>

                          {checked && isOther && (
                            <input
                              type="text"
                              value={answers.otherProductDetails[product] || ""}
                              onChange={(event) => {
                                setAnswers((prev) => ({
                                  ...prev,
                                  otherProductDetails: {
                                    ...prev.otherProductDetails,
                                    [product]: event.target.value
                                  }
                                }))
                                setError("")
                              }}
                              placeholder={copy.specifyOther}
                              className="mt-2 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2 text-xs text-[#333333] outline-none focus:border-[#111111]"
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F3F4F6] p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-[#111827]">{copy.productRatingTitle}</h2>
                <p className="mt-1 text-sm text-[#6B7280]">{replaceCount(copy.productRatingSubtitle, answers.products.length)}</p>

                <div className="mt-4 space-y-3">
                  {answers.products.length === 0 && (
                    <p className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#6B7280]">
                      {copy.errors.step3}
                    </p>
                  )}

                  {answers.products.map((product) => {
                    const isOpen = openRatingProduct === product
                    const ratingData = answers.productRatings[product] || {
                      taste: 0,
                      texture: 0,
                      tolerance: 0,
                      ease: 0,
                      aftertaste: 0,
                      experience: "",
                      results: ""
                    }

                    return (
                      <div key={product} className="rounded-2xl border-2 border-[#D1D5DB] bg-white shadow-sm">
                        <button
                          type="button"
                          onClick={() => setOpenRatingProduct(isOpen ? "" : product)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{product}</p>
                            <p className="text-xs text-[#6B7280]">
                              {copy.productSpecificRatings} • {isOpen ? copy.rowHintOpen : copy.rowHint}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full border border-[#111111] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#111111]">
                              {copy.required}
                            </span>
                            <span className="text-sm font-semibold text-[#111111]">{isOpen ? "−" : "+"}</span>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-[#E5E7EB] px-4 py-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              {ratingCategories.map((category) => (
                                <div key={category} className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                                  <p className="text-xs font-semibold text-[#111827]">{copy.ratings[category]}</p>
                                  <div className="mt-1 flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                      <button
                                        key={value}
                                        type="button"
                                        onClick={() => handleProductRating(product, category, value)}
                                        className="rounded p-1 hover:bg-[#ECEEF1]"
                                      >
                                        <Star filled={(ratingData[category] || 0) >= value} />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <label className="space-y-1">
                                <span className="text-xs font-semibold text-[#111827]">{copy.shortExperience}</span>
                                <textarea
                                  value={ratingData.experience || ""}
                                  onChange={(event) => handleProductText(product, "experience", event.target.value)}
                                  rows={2}
                                  className="w-full rounded-xl border border-[#E5E7EB] bg-white p-2.5 text-sm text-[#333333] outline-none focus:border-[#111111]"
                                  placeholder={copy.shortExperiencePlaceholder}
                                />
                              </label>
                              <label className="space-y-1">
                                <span className="text-xs font-semibold text-[#111827]">{copy.results}</span>
                                <textarea
                                  value={ratingData.results || ""}
                                  onChange={(event) => handleProductText(product, "results", event.target.value)}
                                  rows={2}
                                  className="w-full rounded-xl border border-[#E5E7EB] bg-white p-2.5 text-sm text-[#333333] outline-none focus:border-[#111111]"
                                  placeholder={copy.resultsPlaceholder}
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F3F4F6] p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-[#111827]">{copy.siroExperienceTitle}</h2>
                <p className="mt-1 text-sm text-[#6B7280]">{copy.siroExperienceSubtitle}</p>
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                    <p className="text-sm font-semibold text-[#111827]">{copy.associationQuestion}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {associationOptionKeys.map((item) => (
                        <label
                          key={item}
                          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 transition hover:border-[#111111]"
                        >
                          <input
                            type="checkbox"
                            checked={answers.associations.includes(item)}
                            onChange={() => handleAssociationToggle(item)}
                            className="h-4 w-4 accent-[#111111]"
                          />
                          <span className="text-sm text-[#333333]">{copy.associations[item]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-[#111827]">{copy.improveLabel}</span>
                    <textarea
                      value={answers.improvement}
                      onChange={(event) => setField("improvement", event.target.value)}
                      rows={3}
                      className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 text-sm text-[#333333] outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10"
                      placeholder={copy.improvePlaceholder}
                    />
                  </label>
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                    <p className="text-sm font-semibold text-[#111827]">{copy.recommendLabel}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {[...Array(11).keys()].map((value) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() => setField("recommend", value)}
                          className={`min-w-[2rem] rounded-full border px-2.5 py-1.5 text-xs font-semibold transition ${
                            answers.recommend === value
                              ? "border-[#111111] bg-[#111111] text-white"
                              : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#111111]"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F3F4F6] p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-[#111827]">{copy.demographicsTitle}</h2>
                <p className="mt-1 text-sm text-[#6B7280]">{copy.demographicsSubtitle}</p>
                <div className="mt-4 grid gap-4">
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-[#111827]">{copy.age}</span>
                    <select
                      value={answers.age}
                      onChange={(event) => setField("age", event.target.value)}
                      className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 text-sm text-[#333333] outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10"
                    >
                      <option value="">{copy.chooseAge}</option>
                      {copy.ageOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                    <p className="text-sm font-semibold text-[#111827]">{copy.gender}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {copy.genders.map((gender) => (
                        <label
                          key={gender}
                          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 transition hover:border-[#111111]"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={answers.gender === gender}
                            onChange={(event) => setField("gender", event.target.value)}
                            className="h-4 w-4 accent-[#111111]"
                          />
                          <span className="text-sm text-[#333333]">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-[#111827]">{copy.zipCode}</span>
                    <input
                      value={answers.zip}
                      onChange={(event) => setField("zip", event.target.value)}
                      type="text"
                      placeholder={copy.zipPlaceholder}
                      className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 text-sm text-[#333333] outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="rounded-[28px] border border-[#E5E7EB] bg-[#F3F4F6] p-7 text-center sm:p-9">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-[#111111]">🎉</div>
              <h2 className="mt-4 text-2xl font-semibold text-[#111827]">{copy.successTitle}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6B7280]">{copy.successReward}</p>
            </div>
          )}

          {error && step < 6 && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {step < 6 && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="inline-flex items-center justify-center rounded-full border border-[#D1D5DB] bg-white px-5 py-2.5 text-sm font-semibold text-[#333333] transition hover:border-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copy.back}
              </button>
              {step === 5 ? (
                <button
                  type="submit"
                  disabled={!isCurrentStepValid || isSubmitting}
                  className="inline-flex items-center justify-center rounded-full border border-[#111111] bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? "Saving..." : copy.submit}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isCurrentStepValid}
                  className="inline-flex items-center justify-center rounded-full border border-[#111111] bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copy.next}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default App
