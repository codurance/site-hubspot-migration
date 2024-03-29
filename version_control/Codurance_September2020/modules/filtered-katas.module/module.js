let filters = {
  types: ["difficulty", "topic"],
  all: {
    difficulty: [],
    topic: []
  },
  applied: {
    difficulty: [],
    topic: []
  }
};

const getAll = (entity, type) => {
  const selectors = {
    tags: "[blogTags]",
    options: `[data-${type}-option]`,
    dropdown_containers: "[data-dropdown-container]",
    remove_filter_buttons: `[data-remove-${type}-filter]`
  };

  return Array.prototype.slice.call(
    document.querySelectorAll(selectors[entity])
  );
};

const get = (entity, value, type) => {
  const selectors = {
    filter_toggle: "[data-filter-toggle]",
    filter_toggle_icon: "[data-filter-toggle-icon]",
    filters_wrapper: "[data-filters-wrapper]",
    dropdown_container: `[data-dropdown-container="${value}"]`,
    dropdown_icon: `[data-dropdown-icon=${value}]`,
    applied_filter: `[data-applied-${type}-filter="${value}"]`,
    option: `[data-${type}-option="${value}"]`,
    selected_icon: `[data-${type}-option-selected="${value}"]`,
    grid_container: "[data-grid-container]"
  };

  return document.querySelector(selectors[entity]);
};

const allBlogPosts = getAll("tags");

let katas = {
  all: allBlogPosts,
  visible: allBlogPosts,
  hidden: []
};

const filterOptions = (type) => {
  return getAll("options", type)
    .map((option) => option.dataset[`${type}Option`])
    .filter((x) => x.length > 0);
};

const setFilterOptions = (_) => {
  filters.types.forEach((type) => (filters.all[type] = filterOptions(type)));
};

const hide = (element) => {
  element.classList.add("hidden");
};

const show = (element) => {
  element.classList.remove("hidden");
};

const toggleShowHideFilters = (_) => {
  const filtersWrapper = get("filters_wrapper");
  const mobileFilterIcon = get("filter_toggle_icon");

  filtersWrapper.classList.toggle("show");
  mobileFilterIcon.classList.toggle("katas__filter-toggle-icon--selected");
};

const addFilterToggleListener = (_) => {
  const filterToggleButton = get("filter_toggle");
  filterToggleButton.addEventListener("click", toggleShowHideFilters);
};

const showDropdown = (container) => {
  const type = container.dataset.dropdownContainer;
  show(container);
  get("dropdown_icon", type).classList.add(
    "katas__filter-dropdown-icon--selected"
  );
};

const hideDropdown = (container) => {
  const type = container.dataset.dropdownContainer;
  hide(container);
  get("dropdown_icon", type).classList.remove(
    "katas__filter-dropdown-icon--selected"
  );
};

const closeOtherDropdowns = (type) => {
  getAll("dropdown_containers")
    .filter((dropdown) => dropdown.dataset.dropdownContainer !== type)
    .forEach(hideDropdown);
};

const openDropdown = (type) => {
  closeOtherDropdowns(type);
  const dropdown = get("dropdown_container", type);
  if (dropdown.classList.contains("hidden")) {
    showDropdown(dropdown, type);
  } else {
    hideDropdown(dropdown, type);
  }
};

const isDropdownButton = (element) => {
  return !!element.dataset.dropdownButton;
};

const optionTypeFrom = (element) => {
  const dataAttributes = Object.keys(element.dataset);
  const optionMatcher = new RegExp("^(difficulty|topic)(?=Option)");
  for (let i = 0; i < dataAttributes.length; i++) {
    const key = dataAttributes[i];
    const match = key.match(optionMatcher);
    if (match) {
      return match[0];
    }
  }
};

const addDropdownListeners = (_) => {
  window.addEventListener("click", ({ target }) => {
    if (isDropdownButton(target)) {
      openDropdown(target.dataset.dropdownButton);
    } else {
      const optionType = optionTypeFrom(target);
      closeOtherDropdowns(optionType);
    }
  });
};

const showAppliedFilter = (type, filter) => {
  const filterPill = get("applied_filter", filter, type);
  show(filterPill);
};

const hideUnappliedFilter = (type, filter) => {
  const filterPill = get("applied_filter", filter, type);
  hide(filterPill);
};

const markOptionSelected = (type, filter) => {
  const selectedIcon = get("selected_icon", filter, type);
  const option = get("option", filter, type);
  show(selectedIcon);
  option.classList.add("katas__filter-dropdown-option--selected");
};

const markOptionDeselected = (type, filter) => {
  const selectedIcon = get("selected_icon", filter, type);
  const option = get("option", filter, type);
  hide(selectedIcon);
  option.classList.remove("katas__filter-dropdown-option--selected");
};

const updateAppliedFilters = (_) => {
  Object.keys(filters.applied).forEach((type) => {
    const all = filters.all[type];
    const applied = filters.applied[type];
    const unapplied = arrayDifference(all, applied);

    applied.forEach((filter) => {
      showAppliedFilter(type, filter);
      markOptionSelected(type, filter);
    });

    unapplied.forEach((filter) => {
      hideUnappliedFilter(type, filter);
      markOptionDeselected(type, filter);
    });
  });
};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const flatten = (array) => {
  return Array.prototype.concat.apply([], array);
};

const arrayDifference = (a, b) => {
  return a.filter((item) => !b.includes(item));
};

const getKataData = (kata, type) => {
  return type == "kataDifficulty"
    ? kata.dataset.difficulty
    : kata.dataset.topics.split(",");
};

const filtersAvailableFor = (type) => {
  const opts = {
    difficulty: {
      kata_dataset_name: "kataDifficulty",
      remaining: (katas) => katas.filter(byDifficulty).filter(byTopic)
    },
    topic: {
      kata_dataset_name: "kataTopic",
      remaining: (katas) => katas.filter(byTopic).filter(byDifficulty)
    }
  };

  const remainingKatas = opts[type].remaining(katas.all);

  return remainingKatas.map((kata) =>
    getKataData(kata, opts[type].kata_dataset_name)
  );
};

const disableButton = (button) => {
  button.setAttribute("disabled", "true");
};

const enableButton = (button) => {
  button.removeAttribute("disabled");
};

const updateAvailableTopicFilters = (_) => {
  var topic = filters.types.filter((type) => type == "topic");
  const availableFilters = flatten(filtersAvailableFor(topic))
    .filter(onlyUnique)
    .filter((element) => {
      return element != null ? element.trim().length > 0 : 0;
    });
  const unavailableFilters = arrayDifference(
    filters.all[topic],
    availableFilters
  );
  availableFilters.forEach((filter) =>
    enableButton(get("option", filter, topic))
  );
  unavailableFilters.forEach((filter) =>
    disableButton(get("option", filter, topic))
  );
};

const byDifficulty = (kata) => {
  let difficultyFilters = filters.applied.difficulty;
  let kataDifficulty = kata.dataset.difficulty;
  return (
    difficultyFilters.length === 0 || difficultyFilters.includes(kataDifficulty)
  );
};

const byTopic = (kata) => {
  let topicFilters = filters.applied.topic;
  let kataTopics = kata.dataset.topics.split(",");

  return (
    topicFilters.length === 0 ||
    topicFilters.some((filter) => kataTopics.includes(filter))
  );
};

const calculateVisibleKatas = (_) => {
  return katas.all.filter(byDifficulty).filter(byTopic);
};

const refilter = (_) => {
  katas.visible = calculateVisibleKatas();
  katas.hidden = arrayDifference(katas.all, katas.visible);

  katas.visible.forEach(showWithAnimation);
  katas.hidden.forEach(hideWithAnimation);
};

const update = (_) => {
  updateAppliedFilters();
  refilter();
  updateAvailableTopicFilters();
};

const applyFilter = (type, value) => {
  filters.applied[type].push(value);
  update();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const filterAlreadyApplied = (type, value) => {
  const appliedFiltersForType = filters.applied[type];
  return appliedFiltersForType.includes(value);
};

const filterSelected = (type, value) => {
  filterAlreadyApplied(type, value)
    ? removeFilter(type, value)
    : applyFilter(type, value);
};

const addFilterListener = (button, type) => {
  button.addEventListener("click", (_) =>
    filterSelected(type, button.dataset[`${type}Option`])
  );
};

const addFilterOptionListeners = (_) => {
  filters.types.forEach((type) => {
    getAll("options", type).forEach((button) => {
      addFilterListener(button, type);
    });
  });
};

const removeItemFromArray = (array, value) => {
  const removableIndex = array.indexOf(value);
  if (removableIndex >= 0) {
    array.splice(removableIndex, 1);
  }
};

const removeFilter = (type, value) => {
  removeItemFromArray(filters.applied[type], value);
  update();
};

const capitalise = (string) => {
  return string.charAt(0).toUpperCase() + string.substring(1);
};

const regexRemoveSpecialCharacters = (string) => {
  return string.replace(/[^a-zA-Z -]/g, "");
};

const addRemoveFilterListener = (type, button) => {
  button.addEventListener("click", (_) => {
    const value = button.dataset[`remove${capitalise(type)}Filter`];
    removeFilter(type, value);
  });
};

const addRemoveFilterListeners = (_) => {
  Object.keys(filters.all).forEach((type) => {
    getAll("remove_filter_buttons", type).forEach((button) =>
      addRemoveFilterListener(type, button)
    );
  });
};

function showWithAnimation(element) {
  const animationDuration = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--fading-animation-duration"
    )
  );

  removeHiddenModifier(element);

  // Timeout to show the transition before the display property changes
  setTimeout(removeFadeAnimationModifier, animationDuration, element);
}

function hideWithAnimation(element) {
  const animationDuration = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--fading-animation-duration"
    )
  );

  addFadeAnimationModifier(element);

  // Timeout to show the transition before the display property changes
  setTimeout(addHiddenModifier, animationDuration, element);
}

function removeFadeAnimationModifier(element) {
  element.classList.remove("fade-animation");
}

function addFadeAnimationModifier(element) {
  element.classList.add("fade-animation");
}

function removeHiddenModifier(element) {
  element.classList.remove("hidden");
}

function addHiddenModifier(element) {
  element.classList.add("hidden");
}

const initialiseKataTags = (_) => {
  let difficulties = ["Novice", "Beginner", "Competent", "Expert"];
  allBlogPosts.forEach((kata) => {
    const tagsArray = kata.attributes.blogTags.value.split(", ");
    const topicsTagsArray = [];

    tagsArray.forEach((blogTag) => {
      blogTag = regexRemoveSpecialCharacters(blogTag);

      //Adds difficulty tags to kata.dataset
      if (difficulties.includes(blogTag)) {
        kata.dataset.difficulty = blogTag;
        const difficultyTagIndex = tagsArray.indexOf(blogTag);
        tagsArray.splice(difficultyTagIndex, 1);
      }
    });

    //Adds topic tags to kata.dataset
    tagsArray.forEach((blogTag) => {
      topicsTagsArray.push(regexRemoveSpecialCharacters(blogTag));
    });
    kata.dataset.topics = topicsTagsArray;
  });
};

const addListeners = (_) => {
  addFilterToggleListener();
  addDropdownListeners();
  addFilterOptionListeners();
  addRemoveFilterListeners();
};

const initialiseFilters = (_) => {
  setFilterOptions();
  addListeners();
  initialiseKataTags();
};

window.addEventListener("DOMContentLoaded", initialiseFilters);
